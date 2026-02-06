"""Planner Agent - Generates migration plan and streams it to the frontend."""

import asyncio
from pathlib import Path
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models import Job, JobEvent
from app.integrations.gemini import stream
from app.integrations.redis_client import publish_event


# === System Prompt ===

PLANNER_SYSTEM_PROMPT = """You are an elite software architect creating a structured migration plan for Kandra, an autonomous code migration agent.

## CRITICAL: OUTPUT FORMAT
You MUST output ONLY valid JSON. No markdown, no explanations, no code blocks around the JSON.
The JSON must follow this exact structure:

{
  "summary": {
    "title": "Source Framework → Target Framework Migration",
    "description": "A clear 1-2 sentence description of what this migration accomplishes",
    "confidence": 85,
    "estimated_duration": "3-5 minutes",
    "risk_level": "low"
  },
  "stats": {
    "files_to_modify": 5,
    "files_to_create": 3,
    "files_to_delete": 1,
    "dependencies_to_add": 4,
    "dependencies_to_remove": 2
  },
  "transformation": {
    "source": {
      "stack": "Express.js",
      "language": "JavaScript",
      "key_features": ["Feature 1", "Feature 2", "Feature 3"]
    },
    "target": {
      "stack": "Fastify",
      "language": "TypeScript",
      "key_features": ["New Feature 1", "New Feature 2", "New Feature 3"]
    }
  },
  "phases": [
    {
      "id": 1,
      "title": "Phase Title",
      "description": "What this phase accomplishes",
      "tasks": [
        "Specific task 1 description",
        "Specific task 2 description",
        "Specific task 3 description"
      ],
      "files_affected": ["file1.ts", "file2.ts"]
    }
  ],
  "file_changes": [
    {
      "path": "src/app.js",
      "action": "transform",
      "new_path": "src/app.ts",
      "reason": "Brief explanation of why this file changes"
    },
    {
      "path": "src/newfile.ts",
      "action": "create",
      "reason": "Brief explanation of why this file is created"
    }
  ],
  "dependencies": {
    "add": [
      {"name": "fastify", "reason": "Core framework"},
      {"name": "typescript", "reason": "Type safety"}
    ],
    "remove": [
      {"name": "express", "reason": "Replaced by Fastify"}
    ]
  },
  "verification": {
    "auto_checks": ["Check 1", "Check 2", "Check 3"],
    "success_criteria": "What defines a successful migration"
  }
}

## IMPORTANT RULES:
1. Output ONLY the JSON object, nothing else - no markdown, no ```json blocks
2. Include at least 4-6 phases for comprehensive plans
3. Each phase should have 3-5 specific tasks
4. List ALL files that will be changed
5. Be specific about dependencies
6. confidence should be 0-100 (integer)
7. risk_level must be "low", "medium", or "high"
8. estimated_duration should be realistic (e.g., "2-4 minutes", "5-10 minutes")
9. Make the plan COMPREHENSIVE - don't skip steps

## AGENT CAPABILITIES:
The executor agent that follows this plan can:
- Create, modify, and delete files
- Run shell commands (npm, pip, cargo, etc.)
- Read existing file contents
- Install and remove dependencies
- Run tests and build commands

11. **Total Language Compliance**: Your plan MUST strictly use the file extensions and CLI flags associated with the target stack. (e.g., if target is TypeScript, ALL files in the plan MUST be `.ts` or `.tsx`, and you MUST include the `--typescript` flag for any CLI tools like `fastify-cli`).
12. **No Placeholders**: Never use "Simulate logic" or "placeholder" in your plan. The goal is a 100% functional rewrite.

Generate detailed, actionable plans that the executor can follow step-by-step.
OUTPUT ONLY VALID JSON. BEGIN WITH { AND END WITH }"""


async def generate_plan(
    job: Job,
    analysis_data: dict,
    session: AsyncSession,
) -> str:
    """
    Generate a migration plan for a job.
    
    Args:
        job: The migration job
        analysis_data: Analysis results from the analyzer agent
        session: Database session
        
    Returns:
        The complete plan as a JSON string
    """
    # Dual-Write Helper
    # Dual-Write Helper
    async def emit(event_type: str, payload: dict):
        """Helper to persist event and publish to bus."""
        from app.integrations.event_bus import bus
        
        try:
            print(f"👉 [Planner] Emitting {event_type}...")
            # 1. Persist to DB
            event = JobEvent(
                job_id=job.id,
                event_type=event_type,
                payload=payload,
                # 'created_at' is auto-filled by default=datetime.utcnow
            )
            session.add(event)
            # Flush to generate ID and created_at
            await session.flush() 
            
            # 2. Publish to Memory Bus
            await bus.publish(f"job:{job.id}", {
                "type": event_type,
                "job_id": job.id,
                "payload": payload,
                "timestamp": event.created_at.isoformat() if event.created_at else datetime.utcnow().isoformat()
            })
            print(f"✅ [Planner] Emitted {event_type} (DB+Bus)")
            
        except Exception as e:
            print(f"❌ [Planner] Failed to emit event {event_type}: {e}")
            # Do NOT raise, so main logic can continue even if logging fails
            import traceback
            traceback.print_exc()

    from app.integrations.gemini import generate
    
    # Build the planning prompt
    prompt = build_planning_prompt(job, analysis_data)
    
    # Update job status to PLANNING
    job.status = "PLANNING"
    job.updated_at = datetime.utcnow()
    await session.commit()
    
    # Emit status change
    await emit("status_changed", {"status": "PLANNING"})
    
    # Emit loading event so frontend knows plan is being generated
    await emit("plan_generating", {"message": "Generating migration plan..."})
    
    start_time = datetime.utcnow()
    print(f"[{start_time.isoformat()}] 🧠 Generating plan for job {job.id} (non-blocking)...")
    
    try:
        # Generate plan in one shot (no streaming) to ensure valid JSON
        # Using run_in_executor wrapper in gemini.py to prevent blocking event loop
        full_plan = await generate(
            prompt, 
            system_instruction=PLANNER_SYSTEM_PROMPT
        )
        
        duration = (datetime.utcnow() - start_time).total_seconds()
        print(f"[{datetime.utcnow().isoformat()}] ✅ Plan generated in {duration:.2f}s: {len(full_plan) if full_plan else 0} chars")
        
        # Clean up JSON if wrapped in code blocks
        if isinstance(full_plan, str):
            full_plan = full_plan.strip()
            if full_plan.startswith("```"):
                full_plan = full_plan.split("\n", 1)[1] if "\n" in full_plan else full_plan
            if full_plan.endswith("```"):
                full_plan = full_plan.rsplit("\n", 1)[0] if "\n" in full_plan else full_plan
            full_plan = full_plan.strip()
        
        # Emit the complete plan as a single chunk
        await emit("plan_chunk", {
            "content": full_plan,
            "chunk_index": 1,
        })
        
        # Update job status to AWAITING_APPROVAL
        job.status = "AWAITING_APPROVAL"
        job.updated_at = datetime.utcnow()
        await session.commit()
        
        # Emit completion events
        # CRITICAL: payload must include 'plan' for the /approve endpoint to read it
        await emit("plan_complete", {
            "plan": full_plan,
            "chunk_count": 1
        })
        await emit("status_changed", {"status": "AWAITING_APPROVAL"})
        
        # FINAL COMMIT: Ensure these last events are persisted!
        await session.commit()
        
        print(f"✅ Plan generated: 1 chunks, {len(full_plan)} chars")
        return full_plan
        
    except Exception as e:
        print(f"❌ Planning error: {e}")
        
        # Update job to failed
        job.status = "FAILED"
        job.error = f"Planning failed: {str(e)}"
        job.updated_at = datetime.utcnow()
        await session.commit()
        
        await emit("error", {"error": str(e)})
        
        raise


def build_planning_prompt(job: Job, analysis_data: dict) -> str:
    """Build the prompt for the planning agent."""
    
    # Get workspace info
    workspace_path = job.workspace_path
    
    # Extract analysis info
    detected_stack = analysis_data.get("detected_stack", "Unknown")
    complexity_score = analysis_data.get("complexity_score", 50)
    insight_detail = analysis_data.get("insight_detail", "No detailed analysis available.")
    file_count = analysis_data.get("file_count", "unknown")
    file_tree = analysis_data.get("file_tree", "No tree available.")
    
    prompt = f"""# Migration Request

## 📦 Repository Information
| Property | Value |
|----------|-------|
| **Repository** | `{job.repo_name}` |
| **Current Stack** | {detected_stack} |
| **Target Stack** | **{job.target_stack}** |
| **Complexity Score** | {complexity_score}/100 |
| **Workspace** | `{workspace_path}` |
| **Files Analyzed** | {file_count} |

## 📂 Actual Project Structure (Legacy)
```
{file_tree}
```

## 🔍 Analysis Insight
{insight_detail if insight_detail else "Standard migration - no special considerations."}

## 🎯 Your Task
Transform this codebase from **{detected_stack}** → **{job.target_stack}**

Generate a structured JSON migration plan. 

### IMPORTANT GUIDELINES:
1. **Reference REAL Files**: Look at the "Actual Project Structure" above. Your plan MUST reference the existing file names and paths. DO NOT guess or hallucinate file names.
2. **Logic Parity**: Ensure every legacy logic file (logic, models, utils) has a corresponding migration task. Do not just migrate the server shell.
3. **No Placeholders**: Never use "Simulate logic" or "placeholder" in your plan. The goal is a 100% functional rewrite.

CRITICAL: Output ONLY valid JSON. No markdown. No code blocks. Start with {{ and end with }}"""
    
    return prompt


async def start_planning(job_id: str, analysis_data: dict, session: AsyncSession):
    """
    Start the planning process for a job.
    Called after job creation or when transitioning to PLANNING.
    """
    # Fetch the job
    result = await session.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise ValueError(f"Job not found: {job_id}")
    
    # Generate the plan
    plan = await generate_plan(job, analysis_data, session)
    
    return plan
