"""Job endpoints - Create and manage migration jobs."""

from datetime import datetime
import asyncio
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_session
from app.db.models import Job, JobEvent
from app.integrations.redis_client import get_redis, publish_event
from app.services.exporter import ExporterService
from fastapi.responses import FileResponse, StreamingResponse
import os
import shutil
import tempfile
import zipfile
import io
import re
import base64
import httpx
from fpdf import FPDF

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

# Global Lock to ensure serial execution in resource-constrained (1GB RAM) environments
execution_lock = asyncio.Lock()


# === Request/Response Models ===

class CreateJobRequest(BaseModel):
    """Create a new migration job."""
    repo_url: str
    repo_name: str
    target_stack: str
    workspace_path: str  # From analysis


class JobResponse(BaseModel):
    """Job response model."""
    id: str
    status: str
    repo_url: str
    repo_name: str
    target_stack: str
    workspace_path: Optional[str] = None
    current_iteration: int = 0
    error: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EventResponse(BaseModel):
    """Event response model."""
    id: str
    event_type: str
    payload: dict
    created_at: datetime

    class Config:
        from_attributes = True


# === Endpoints ===

@router.post("", response_model=JobResponse)
async def create_job(
    body: CreateJobRequest,
    session: AsyncSession = Depends(get_session),
):
    """Create a new migration job."""
    import traceback
    
    print(f"Create job request: repo={body.repo_name}, stack={body.target_stack}")
    print(f"   workspace_path={body.workspace_path}")
    
    try:
        # Create job
        job = Job(
            repo_url=body.repo_url,
            repo_name=body.repo_name,
            target_stack=body.target_stack,
            workspace_path=body.workspace_path,
            status="CREATED",
        )
        session.add(job)
        await session.flush()  # Generate job.id
        
        # Add creation event
        event = JobEvent(
            job_id=job.id,
            event_type="job_created",
            payload={
                "repo_name": body.repo_name,
                "target_stack": body.target_stack,
            },
        )
        session.add(event)
        
        await session.commit()
        await session.refresh(job)
        
        print(f"Job created: {job.id}")
        
        # Publish event to Redis for WebSocket
        await publish_event(f"job:{job.id}", {
            "type": "job_created",
            "job_id": job.id,
            "status": "CREATED",
        })
        
        return job
        
    except Exception as e:
        print(f"Job creation error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Job creation failed: {str(e)}")


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Get job by ID."""
    result = await session.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job


@router.get("/{job_id}/events", response_model=list[EventResponse])
async def get_job_events(
    job_id: str,
    since_id: Optional[str] = None,
    limit: int = 100,
    session: AsyncSession = Depends(get_session),
):
    """Get events for a job (for catching up after reconnect)."""
    query = select(JobEvent).where(JobEvent.job_id == job_id)
    
    if since_id:
        # Get events after a specific event (for pagination)
        query = query.where(JobEvent.id > since_id)
    
    query = query.order_by(JobEvent.created_at.asc()).limit(limit)
    
    result = await session.execute(query)
    events = result.scalars().all()
    
    return events


@router.patch("/{job_id}/status")
async def update_job_status(
    job_id: str,
    status: str,
    error: Optional[str] = None,
    session: AsyncSession = Depends(get_session),
):
    """Update job status (internal use)."""
    result = await session.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = status
    if error:
        job.error = error
    job.updated_at = datetime.utcnow()
    
    await session.commit()
    
    # Publish status change
    await publish_event(f"job:{job_id}", {
        "type": "status_changed",
        "job_id": job_id,
        "status": status,
        "error": error,
    })
    
    return {"status": "updated"}


# === Planning Endpoints ===

class StartPlanningRequest(BaseModel):
    """Request to start planning."""
    analysis_data: dict  # Analysis results from analyzer


@router.post("/{job_id}/start-planning")
async def start_planning_endpoint(
    job_id: str,
    body: StartPlanningRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Start the planning phase for a job.
    Triggers the Planner Agent to generate a migration plan.
    Plan chunks are streamed via WebSocket.
    """
    import asyncio
    from app.agents.planner import start_planning
    
    # Verify job exists
    result = await session.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status not in ["CREATED", "FAILED"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot start planning from status: {job.status}"
        )
    
    # Start planning in background task
    async def run_planning():
        from app.db.database import async_session_context
        async with async_session_context() as new_session:
            try:
                await start_planning(job_id, body.analysis_data, new_session)
            except Exception as e:
                print(f"Planning task error: {e}")
    
    asyncio.create_task(run_planning())
    
    return {
        "status": "planning_started",
        "job_id": job_id,
        "message": "Plan generation started. Watch WebSocket for updates."
    }


@router.post("/{job_id}/approve")
async def approve_plan(
    job_id: str,
    session: AsyncSession = Depends(get_session),
):
    """
    Approve the migration plan and start execution.
    Called after user reviews the plan.
    """
    result = await session.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != "AWAITING_APPROVAL":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot approve from status: {job.status}. Expected AWAITING_APPROVAL"
        )
    
    # Fetch the generated plan
    plan_event_result = await session.execute(
        select(JobEvent)
        .where(JobEvent.job_id == job_id, JobEvent.event_type == "plan_complete")
        .order_by(JobEvent.created_at.desc())
        .limit(1)
    )
    plan_event = plan_event_result.scalar_one_or_none()
    
    if not plan_event:
        raise HTTPException(
            status_code=400,
            detail="No migration plan found for this job. Please generate a plan first."
        )
        
    try:
        import json
        plan_data = json.loads(plan_event.payload["plan"])
    except Exception as e:
        print(f"Failed to parse plan JSON: {e}")
        raise HTTPException(status_code=500, detail="Stored plan is invalid")

    # Update status to EXECUTING with atomic-like check
    if job.status == "EXECUTING":
        return {"status": "already_executing", "job_id": job_id}
        
    job.status = "EXECUTING"
    job.updated_at = datetime.utcnow()
    await session.commit()
    
    # Emit approval event
    await publish_event(f"job:{job.id}", {
        "type": "plan_approved",
        "job_id": job.id,
    })
    
    await publish_event(f"job:{job.id}", {
        "type": "status_changed",
        "job_id": job.id,
        "status": "EXECUTING",
    })
    
    # Start Execution in Background
    async def run_executor():
        from app.db.database import async_session_context
        from app.agents.executor import ExecutorAgent
        
        async with async_session_context() as new_session:
            try:
                # Re-fetch job in new session
                job_result = await new_session.execute(select(Job).where(Job.id == job_id))
                active_job = job_result.scalar_one()
                
                # Serial Execution Lock: Wait for other jobs to finish
                print(f"⏳ [Lock] Job {job_id} is waiting for the execution lock...")
                async with execution_lock:
                    print(f"🚀 [Lock] Job {job_id} acquired lock. Launching Executor Agent...")
                    agent = ExecutorAgent(active_job, new_session)
                    await agent.execute_plan(plan_data)
                
            except Exception as e:
                print(f"Execution failed: {e}")
                import traceback
                traceback.print_exc()
                
                # Update status to FAILED
                try:
                     active_job.status = "FAILED"
                     active_job.error = str(e)
                     await new_session.commit()
                     
                     await publish_event(f"job:{job_id}", {
                        "type": "status_changed", 
                        "job_id": job_id, 
                        "status": "FAILED",
                        "error": str(e)
                     })
                except:
                    pass

    import asyncio
    asyncio.create_task(run_executor())
    
    return {
        "status": "approved",
        "job_id": job_id,
        "message": "Plan approved. Execution started in background."
    }


@router.post("/{job_id}/reject")
async def reject_plan(
    job_id: str,
    feedback: Optional[str] = None,
    session: AsyncSession = Depends(get_session),
):
    """
    Reject the plan and request a new one.
    Optionally include feedback for the planner.
    """
    result = await session.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != "AWAITING_APPROVAL":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot reject from status: {job.status}"
        )
    
    # Reset to CREATED so planning can be triggered again
    job.status = "CREATED"
    job.updated_at = datetime.utcnow()
    await session.commit()
    
    # Emit rejection event
    await publish_event(f"job:{job.id}", {
        "type": "plan_rejected",
        "job_id": job.id,
        "payload": {"feedback": feedback},
    })
    
    await publish_event(f"job:{job.id}", {
        "type": "status_changed",
        "job_id": job.id,
        "status": "CREATED",
    })
    
    return {
        "status": "rejected",
        "job_id": job_id,
        "message": "Plan rejected. Ready for new planning request."
    }

# === Audit & Delivery Endpoints ===

class AuditPRRequest(BaseModel):
    repo_url: str
    branch_name: str
    github_token: Optional[str] = None

@router.get("/{job_id}/audit/report")
async def get_audit_report(
    job_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Generate and return the certification audit report."""
    from app.agents.audit import AuditAgent
    
    # 1. Verify Job
    result = await session.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # 2. Run Audit (In real app, we might cache this)
    try:
        agent = AuditAgent(job)
        report = await agent.generate_audit_report()
        return report
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{job_id}/audit/pr")
async def submit_audit_pr(
    job_id: str,
    body: AuditPRRequest,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Submit the certified code as a Pull Request."""
    from app.agents.audit import AuditAgent
    from app.api.github import _get_session
    
    # 1. Verify Job
    result = await session.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # 2. Get Token (From body or session)
    token = body.github_token
    if not token:
        # Try to get from session
        github_session = await _get_session(request)
        if github_session:
            token = github_session.get("access_token")
            
    if not token:
        # Fallback to env
        token = os.environ.get("GITHUB_TOKEN")
    
    if not token:
        raise HTTPException(status_code=400, detail="No GitHub token found. Please connect GitHub or provide a token.")
        
    # 3. Submit PR
    try:
        agent = AuditAgent(job)
        pr_url = await agent.submit_pull_request(body.repo_url, body.branch_name, token)
        
        # Publish event
        await publish_event(f"job:{job_id}", {
            "type": "pr_created",
            "job_id": job_id,
            "payload": {"pr_url": pr_url}
        })
        
        return {"success": True, "pr_url": pr_url}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{job_id}/download")
async def download_job_code(
    job_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Create and return a ZIP archive of the migrated codebase."""
    # 1. Verify Job
    result = await session.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if not job.workspace_path or not os.path.exists(job.workspace_path):
        raise HTTPException(status_code=404, detail="Workspace not found")

    # 2. Create ZIP in memory or temp file
    # We use StreamingResponse with a custom generator to avoid huge memory usage
    
    def zip_generator():
        io_buf = io.BytesIO()
        with zipfile.ZipFile(io_buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(job.workspace_path):
                # Exclude bulky/unnecessary directories
                if any(x in root for x in [
                    "node_modules", "venv", ".venv", "__pycache__", ".git", ".next", "dist", "build"
                ]):
                    continue
                
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, job.workspace_path)
                    zf.write(file_path, arcname)
                    
        io_buf.seek(0)
        yield from io_buf

    # Simplified: For small repos, we can just do it in memory. 
    # For very large ones, we'd use a temp file.
    
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(job.workspace_path):
            # Exclude bulky dirs
            if any(x in root.split(os.sep) for x in [
                "node_modules", "venv", ".venv", "__pycache__", ".git", ".next", "dist", "build"
            ]):
                continue
            
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, job.workspace_path)
                zf.write(file_path, arcname)

    buffer.seek(0)
    
    filename = f"{job.repo_name}_migrated.zip"
    return StreamingResponse(
        buffer, 
        media_type="application/x-zip-compressed",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/{job_id}/audit/download-pdf")
async def download_dossier_pdf(
    job_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Generates and returns the technical dossier as a PDF."""
    from app.agents.audit import AuditAgent
    
    # 1. Fetch Job
    result = await session.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # 2. Get Audit Report (which includes the dossier text)
    try:
        agent = AuditAgent(job)
        report = await agent.generate_audit_report()
        dossier_text = report.get("dossier", "No dossier generated.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate dossier: {str(e)}")

    # 3. Create PDF
    class PDF(FPDF):
        def header(self):
            self.set_font("Helvetica", "B", 12)
            self.cell(0, 10, "Kandra Engine - Technical Migration Dossier", border=False, ln=True, align="C")
            self.ln(5)

        def footer(self):
            self.set_y(-15)
            self.set_font("Helvetica", "I", 8)
            self.cell(0, 10, f"Page {self.page_no()} | Certified by Kandra", align="C")

    pdf = PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Effective page width
    epw = pdf.w - 2 * pdf.l_margin
    
    def safe_text(text: str) -> str:
        """Removes characters that might break Helvetica."""
        return text.encode("latin-1", "replace").decode("latin-1")

    # Helper for rich text (bold)
    def write_rich_text(fpdf, text, font_size=11):
        # Very simple bold parser: **text**
        parts = re.split(r"(\*\*.*?\*\*)", text)
        for part in parts:
            if part.startswith("**") and part.endswith("**"):
                fpdf.set_font("Helvetica", "B", font_size)
                # Remove **
                fpdf.write(5, safe_text(part[2:-2]))
            else:
                fpdf.set_font("Helvetica", "", font_size)
                fpdf.write(5, safe_text(part))
        fpdf.ln(7)

    # Simplified Markdown-ish parser with Mermaid support
    lines = dossier_text.split("\n")
    in_mermaid = False
    mermaid_code = []
    
    for line in lines:
        if line.strip() == "```mermaid":
            in_mermaid = True
            mermaid_code = []
            continue
        
        if in_mermaid:
            if line.strip() == "```":
                in_mermaid = False
                # Render Mermaid
                mermaid_str = "\n".join(mermaid_code)
                try:
                    # Sync-ish fetch for Mermaid.ink (since we are in a sync loop, but at least we can use httpx)
                    # For a truly async loop we'd need to collect all and render
                    encoded = base64.b64encode(mermaid_str.encode('utf-8')).decode('utf-8')
                    img_url = f"https://mermaid.ink/img/{encoded}/?type=png"
                    
                    # We'll use a local buffer for the image
                    # Note: FPDF.image accepts a URL directly in some versions, but we'll download to be safe
                    # Since this is an async endpoint, we can use httpx properly
                    import httpx
                    with httpx.Client() as client:
                        img_res = client.get(img_url, timeout=10)
                        if img_res.status_code == 200:
                            img_buf = io.BytesIO(img_res.content)
                            pdf.ln(5)
                            # Center image
                            pdf.image(img_buf, x=pdf.l_margin + 5, w=epw - 10)
                            pdf.ln(5)
                except Exception as e:
                    pdf.set_font("Helvetica", "I", 8)
                    pdf.cell(0, 5, f"[Diagram rendering failed: {str(e)}]", ln=True)
                continue
            else:
                mermaid_code.append(line)
                continue

        # Normal markdown parsing
        if line.startswith("# "):
            pdf.ln(5)
            pdf.set_font("Helvetica", "B", 24)
            pdf.set_text_color(30, 64, 175) # Blue-ish
            pdf.multi_cell(epw, 15, safe_text(line[2:].strip()), ln=True)
            pdf.set_text_color(0, 0, 0)
            pdf.ln(5)
        elif line.startswith("## "):
            pdf.ln(4)
            pdf.set_font("Helvetica", "B", 18)
            pdf.set_text_color(51, 65, 85) # Slate-ish
            pdf.multi_cell(epw, 12, safe_text(line[3:].strip()), ln=True)
            pdf.set_text_color(0, 0, 0)
            pdf.ln(4)
        elif line.startswith("### "):
            pdf.ln(3)
            pdf.set_font("Helvetica", "B", 14)
            pdf.multi_cell(epw, 10, safe_text(line[4:].strip()), ln=True)
            pdf.ln(2)
        elif line.startswith("- "):
            pdf.set_font("Helvetica", "", 11)
            pdf.set_x(pdf.l_margin + 5)
            # Write with bullet
            write_rich_text(pdf, f"• {line[2:].strip()}")
        elif line.startswith("|"): # Table-ish
            pdf.set_font("Helvetica", "I", 9)
            pdf.set_text_color(100, 116, 139)
            pdf.multi_cell(epw, 6, safe_text(line), ln=True)
            pdf.set_text_color(0, 0, 0)
        elif line.startswith("> "): # Quote/Alert
            pdf.set_fill_color(248, 250, 252)
            pdf.set_font("Helvetica", "I", 11)
            pdf.multi_cell(epw, 8, safe_text(line[2:].strip()), border=1, fill=True, ln=True)
        else:
            if line.strip():
                write_rich_text(pdf, line.strip())
            else:
                pdf.ln(5)

    buffer = io.BytesIO(pdf.output())
    buffer.seek(0)
    
    filename = f"{job.repo_name}_dossier.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

