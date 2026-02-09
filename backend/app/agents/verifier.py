import json
import os
from typing import Any, Dict, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import Job, JobEvent
from app.integrations.gemini import generate
from app.integrations.redis_client import publish_event
from app.integrations.event_bus import bus
from datetime import datetime

VERIFIER_SYSTEM_PROMPT = """
You are the Kandra Mastery Verifier. Your job is to perform a deep logical analysis comparing a legacy codebase with its migrated counterpart.

## OUTPUT REQUIREMENTS (STRICT JSON)
You MUST return a JSON object with the following structure:
{
    "overall_parity": number (0-100),
    "modules": [
        {
            "legacy_file": "string",
            "target_file": "string",
            "parity_score": number (0-100),
            "logic_analysis": "string (short comparison)",
            "status": "VERIFIED" | "PARTIAL" | "MISSING"
        }
    ],
    "metrics": {
        "purity_score": number (0-100),
        "type_coverage": number,
        "efficiency_gain": "string"
    },
    "verification_log": [
        { "event": "string", "scope": "string", "result": "VERIFIED" | "SECURE" }
    ]
}
"""

class VerifierAgent:
    def __init__(self, job: Job, session: AsyncSession):
        self.job = job
        self.session = session
        self.project_root = job.workspace_path
        self.source_dir = os.path.join(self.project_root, "source")
        self.target_dir = os.path.join(self.project_root, "target")
        self.report_path = os.path.join(self.project_root, "reports", "audit_dna.json")

    async def _emit(self, event_type: str, payload: Dict[str, Any]):
        """
        Dual-Write Emit:
        1. Persist to DB (Source of Truth)
        2. Publish to Memory Bus (Real-time speed)
        """
        try:
            # 1. DB Write (Persistence)
            db_event = JobEvent(
                job_id=self.job.id,
                event_type=event_type,
                payload=payload,
                # 'created_at' is auto-filled by DB default (datetime.utcnow)
            )
            self.session.add(db_event)
            await self.session.flush() # Ensure ID and created_at are generated
            
            # 2. Memory Bus (Real-time speed)
            await bus.publish(f"job:{self.job.id}", {
                "type": event_type,
                "job_id": self.job.id,
                "payload": payload,
                "timestamp": db_event.created_at.isoformat() if db_event.created_at else datetime.utcnow().isoformat()
            })
            
            await self.session.commit()
            
        except Exception as e:
            print(f"⚠️ [Verifier] Failed to emit event {event_type}: {e}")

    async def run_audit(self):
        """Run the logic DNA audit and generate a structured JSON report."""
        print(f"🧬 [Verifier] Starting structured DNA audit for job {self.job.id}...")
        
        # Emit Start Event
        await self._emit("audit_started", {"message": "Beginning detailed logic verification..."})
        
        # 1. Gather file structures
        source_files = self._get_file_list(self.source_dir)
        target_files = self._get_file_list(self.target_dir)
        
        # 2. Build the audit prompt
        prompt = f"""
AUDIT REQUEST:
- Legacy Files: {source_files}
- Migrated Files: {target_files}
- Target Stack: {self.job.target_stack}

Perform a deep logical parity check. Ensure all business logic from the source files is accounted for in the target files. 
Generate the structured DNA report.
"""

        try:
            # 3. Call LLM for Structured Audit
            response = await generate(
                prompt=prompt,
                system_instruction=VERIFIER_SYSTEM_PROMPT
            )
            
            # 4. Parse and Save the Report
            import re
            json_match = re.search(r"({.*})", str(response), re.DOTALL)
            
            if json_match:
                report_data = json.loads(json_match.group(1))
            else:
                print("⚠️ [Verifier] LLM output not strict JSON, using fallback.")
                report_data = {
                    "overall_parity": 0,
                    "modules": [],
                    "metrics": {"purity_score": 0, "type_coverage": 0, "efficiency_gain": "unknown"},
                    "verification_log": [],
                    "raw_output": str(response)
                }

            os.makedirs(os.path.dirname(self.report_path), exist_ok=True)
            with open(self.report_path, "w") as f:
                json.dump(report_data, f, indent=4)
                
            print(f"[Verifier] Logic DNA report generated at {self.report_path}")
            
            # 5. Emit detailed events
            await self._emit("audit_complete", report_data)
            
            return report_data

        except Exception as e:
            error_msg = f"[Verifier] DNA Audit failed: {e}"
            print(error_msg)
            # Emit error event so frontend can catch it
            await self._emit("audit_error", {"error": str(e), "details": error_msg})
            return {"error": str(e)}

    def _get_file_list(self, directory: str) -> List[str]:
        """Recursive list of files."""
        files = []
        if not os.path.exists(directory): return []
        for root, _, filenames in os.walk(directory):
            for f in filenames:
                if any(x in root for x in ["node_modules", ".git", "__pycache__"]): continue
                rel_path = os.path.relpath(os.path.join(root, f), directory)
                files.append(rel_path)
        return files
