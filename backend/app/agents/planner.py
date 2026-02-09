"""Planner Agent - Generates migration plan and streams it to the frontend."""

import asyncio
from pathlib import Path
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models import Job, JobEvent
from app.integrations.gemini import stream, generate_with_grounding
from app.integrations.redis_client import publish_event


# === System Prompts ===

RESEARCH_DRIVEN_PLANNER_PROMPT = """You are an elite software architect with access to real-time web search via Google Search.

## YOUR RESEARCH CAPABILITIES
You have access to Google Search. When planning a migration, you can search for:
1. Official documentation of the target framework
2. Migration guides from source to target
3. Current best practices and conventions
4. Common pitfalls and solutions
5. Latest package managers, test frameworks, and build tools

## CRITICAL: SEARCH BEFORE YOU PLAN
**DO NOT assume you know the latest syntax or conventions.**

Before creating the migration plan, you MUST search for:
- "{target_stack} latest version setup guide"
- "migrate {source_stack} to {target_stack} best practices"
- "{target_stack} project structure conventions"
- "{target_stack} package manager" (to discover npm/pnpm/pip/poetry/etc.)
- "{target_stack} testing framework" (to discover jest/pytest/vitest/etc.)
- "{target_stack} build tool" (to discover vite/webpack/rollup/etc.)
- "{target_stack} file extensions" (to discover .py/.ts/.rs/etc.)

Use the information from these searches to create an accurate, up-to-date migration plan with REAL commands.

## OUTPUT FORMAT
You MUST output ONLY valid JSON. No markdown, no explanations, no code blocks around the JSON.
The JSON must follow this exact structure:

{
  "summary": {
    "title": "Source Framework → Target Framework Migration",
    "description": "Clear 1-2 sentence description of the migration strategy",
    "confidence": 95,
    "estimated_duration": "5-10 minutes",
    "risk_level": "low"
  },
  "transformation": {
    "source_stack": "Original Stack",
    "target_stack": "Target Stack",
    "strategy": "Description of the transformation strategy (e.g., 'Modular Rewrite', 'Direct Port')",
    "package_manager": "discovered from search (e.g., npm, pnpm, pip, poetry)",
    "test_framework": "discovered from search (e.g., jest, pytest, vitest)",
    "build_tool": "discovered from search (e.g., vite, webpack, rollup)",
    "file_extensions": ["discovered from search (e.g., ['.py'], ['.ts', '.tsx'], ['.rs'])"]
  },
  "phases": [
    {
      "id": 1,
      "title": "Phase Title",
      "description": "High-level goal of this phase",
      "instructions": [
        "DETAILED technical instruction 1 (e.g., 'Map legacy MySQL types to SQLAlchemy models in models.py')",
        "DETAILED technical instruction 2 (e.g., 'Ensure all password logic uses Argon2 as per security policy')",
        "DETAILED technical instruction 3 (e.g., 'Reference legacy file X for the specific math logic in function Y')"
      ],
      "tasks": [
        "Concrete task 1",
        "Concrete task 2"
      ],
      "files_impacted": [
        {"source": "legacy/path.js", "target": "new/path.py", "reason": "Why this file exists"}
      ],
      "verification": {
        "test_commands": ["command_to_verify_success using tools discovered from search"],
        "success_criteria": "Specific technical state that defines completion"
      }
    }
  ],
  "dependencies": {
    "add": [{"name": "pkg", "reason": "Why needed"}],
    "remove": [{"name": "old_pkg", "reason": "Why removed"}]
  }
}

## IMPORTANT RULES:
1. **SEARCH FIRST**: Before generating any commands, search for official documentation
2. **CITE SOURCES**: Use information from your searches, not assumptions
3. **STACK PURITY**: Only use tools/commands for the target stack (discovered via search)
4. **NO CODE**: Don't include code snippets, only detailed instructions
5. **VERIFICATION**: Every phase must have test commands from official docs
6. **PHASE INDEPENDENCE**: Each phase must be self-contained
7. **LEGACY MAPPING**: Always explicitly map legacy source files to target files
8. **VENV AWARENESS**: For Python projects, assume `./.venv` exists. Use `./.venv/bin/python`
9. **HIGH PORT RANGE**: Use ports 9000+ for any service verification
10. **ISOLATION**: Never reference legacy `../source/` directory in commands

Generate a comprehensive, foolproof blueprint using REAL, CURRENT information from your searches.
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
            print(f"[Planner] Emitting {event_type}...")
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
            print(f"[Planner] Emitted {event_type} (DB+Bus)")
            
        except Exception as e:
            print(f"[Planner] Failed to emit event {event_type}: {e}")
            # Do NOT raise, so main logic can continue even if logging fails
            import traceback
            traceback.print_exc()

    # Build the research-driven planning prompt
    prompt = build_research_driven_prompt(job, analysis_data)
    
    # Update job status to PLANNING
    job.status = "PLANNING"
    job.updated_at = datetime.utcnow()
    await session.commit()
    
    # Emit status change
    await emit("status_changed", {"status": "PLANNING"})
    
    # Emit loading event so frontend knows plan is being generated
    await emit("plan_generating", {"message": "Generating migration plan with research..."})
    
    start_time = datetime.utcnow()
    print(f"[{start_time.isoformat()}]  Generating plan for job {job.id} with grounding...")
    
    try:
        # Generate plan with grounding enabled
        result = await generate_with_grounding(
            prompt=prompt,
            system_instruction=RESEARCH_DRIVEN_PLANNER_PROMPT
        )
        
        plan_text = result['text']
        grounding_metadata = result['grounding_metadata']
        
        duration = (datetime.utcnow() - start_time).total_seconds()
        print(f"[{datetime.utcnow().isoformat()}] Plan generated in {duration:.2f}s: {len(plan_text) if plan_text else 0} chars")
        print(f" Research: {len(grounding_metadata.get('search_queries', []))} searches, {len(grounding_metadata.get('sources', []))} sources")
        
        # Clean up JSON if wrapped in code blocks
        if isinstance(plan_text, str):
            plan_text = plan_text.strip()
            if plan_text.startswith("```"):
                plan_text = plan_text.split("\n", 1)[1] if "\n" in plan_text else plan_text
            if plan_text.endswith("```"):
                plan_text = plan_text.rsplit("\n", 1)[0] if "\n" in plan_text else plan_text
            plan_text = plan_text.strip()
        
        # Parse plan JSON and inject research metadata
        import json
        try:
            plan_json = json.loads(plan_text)
            plan_json['research_summary'] = {
                'sources_consulted': grounding_metadata.get('sources', []),
                'search_queries': grounding_metadata.get('search_queries', [])
            }
            full_plan = json.dumps(plan_json, indent=2)
        except json.JSONDecodeError:
            # If JSON parsing fails, use the raw text
            print("  Failed to parse plan JSON, using raw text")
            full_plan = plan_text
        
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
        
        print(f"Plan generated: 1 chunks, {len(full_plan)} chars")
        return full_plan
        
    except Exception as e:
        print(f"Planning error: {e}")
        
        # Update job to failed
        job.status = "FAILED"
        job.error = f"Planning failed: {str(e)}"
        job.updated_at = datetime.utcnow()
        await session.commit()
        
        await emit("error", {"error": str(e)})
        
        raise


def build_research_driven_prompt(job: Job, analysis_data: dict) -> str:
    """Build prompt that encourages the model to search for stack-specific information."""
    
    # Extract analysis info
    detected_stack = analysis_data.get("detected_stack", "Unknown")
    file_tree = analysis_data.get("file_tree", "No tree available.")
    
    prompt = f"""# Migration Request

## Source & Target
- **Current Stack**: {detected_stack}
- **Target Stack**: {job.target_stack}

## Your Task
Create a migration plan from {detected_stack} to {job.target_stack}.

## IMPORTANT: Research First
Before creating the plan, you MUST search for:
1. "migrate {detected_stack} to {job.target_stack} best practices"
2. "{job.target_stack} official documentation setup guide"
3. "{job.target_stack} project structure conventions"
4. "{job.target_stack} package manager" (to discover npm/pnpm/pip/poetry/etc.)
5. "{job.target_stack} testing framework" (to discover jest/pytest/vitest/etc.)
6. "{job.target_stack} build tool" (to discover vite/webpack/rollup/etc.)

Use the information from these searches to create an accurate, up-to-date migration plan.

## Project Structure (Legacy)
```
{file_tree}
```

## Guidelines
1. **Reference REAL Files**: Use the actual file names from the project structure above
2. **Logic Parity**: Ensure every legacy file has a corresponding migration task
3. **No Placeholders**: Create a 100% functional rewrite plan, not placeholders
4. **Use Discovered Tools**: Use the package manager, test framework, and build tool you discovered from your searches

Generate a structured JSON migration plan using REAL commands from your research.
Output ONLY valid JSON. Start with {{ and end with }}"""
    
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
