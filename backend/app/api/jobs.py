"""Job endpoints - Create and manage migration jobs."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_session
from app.db.models import Job, JobEvent
from app.integrations.redis_client import get_redis, publish_event
from app.services.exporter import ExporterService
from fastapi.responses import FileResponse
import os

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
    
    print(f"📋 Create job request: repo={body.repo_name}, stack={body.target_stack}")
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
        
        print(f"✅ Job created: {job.id}")
        
        # Publish event to Redis for WebSocket
        await publish_event(f"job:{job.id}", {
            "type": "job_created",
            "job_id": job.id,
            "status": "CREATED",
        })
        
        return job
        
    except Exception as e:
        print(f"❌ Job creation error: {str(e)}")
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
                print(f"❌ Planning task error: {e}")
    
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
        print(f"❌ Failed to parse plan JSON: {e}")
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
                print(f"❌ Execution failed: {e}")
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
    session: AsyncSession = Depends(get_session),
):
    """Submit the certified code as a Pull Request."""
    from app.agents.audit import AuditAgent
    
    # 1. Verify Job
    result = await session.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # 2. Get Token (From body or env)
    token = body.github_token or os.environ.get("GITHUB_TOKEN")
    
    if not token:
        raise HTTPException(status_code=400, detail="No GitHub token provided. Please provide one in the request or set GITHUB_TOKEN env var.")
        
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

