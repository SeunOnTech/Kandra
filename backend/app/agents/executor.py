import json
import os
import re
import asyncio
from typing import Any, Dict, List, Optional
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from google.genai import types

from app.db.models import Job, JobEvent
from app.integrations.redis_client import publish_event
from app.integrations.gemini import get_client
from app.config import settings

# Import tools
from app.tools.base import BaseTool
from app.tools.shell import ShellTool
from app.tools.file_ops import ListDirTool, ReadFileTool, WriteFileTool

from pydantic import BaseModel, Field

class ToolArguments(BaseModel):
    command: Optional[str] = Field(None, description="The shell command to execute")
    path: Optional[str] = Field(None, description="File or directory path")
    content: Optional[str] = Field(None, description="Content to write to file")
    max_depth: Optional[int] = Field(None, description="Recursion depth for list_dir")

class ExecutorAction(BaseModel):
    thought: str = Field(description="Internal reasoning about the next step")
    tool: Optional[str] = Field(None, description="The tool to call (run_command, read_file, etc.)")
    args: Optional[ToolArguments] = Field(None, description="Arguments for the tool")
    status: Optional[str] = Field(None, description="Set to 'complete' when the phase is finished")

EXECUTOR_SYSTEM_PROMPT = """You are an expert autonomous software engineer.
Your task is to execute a specific phase of a migration plan.

## CAPABILITIES
You have access to a Linux shell and file system tools.
You can:
- Run commands (npm, pip, ls, etc.)
- Read/Write files
- Explore the codebase

## RULES
1. **Be Frugal**: Only read files you absolutely need. Use `ls -R` first to understand structure.
2. **Standardized Layout**: You are working in a structured environment:
    - Current Working Directory (CWD) is `./target/`. This is where the NEW migrated code lives.
    - Legacy Source Code is in `../source/`. This is READ-ONLY. Use it for reference.
    - Meta data is in `../.kandra/`.
3. **Relative Pathing**: To read legacy code, use `read_file(path="../source/filename.ts")`.
4. **All Changes into Target**: All `write_file` and `run_command` operations must stay within `./target/`.
5. **No Copying (Logic Purity)**: DO NOT copy files from `../source/` to `./`. You are forbidden from using `cp` or `mv` for code files. Your goal is to REWRITE the logic in clean, new files. Reading is allowed, but logic duplication is forbidden.
6. **Language Lock (Enforced)**: This environment has a HARD LOCK on file extensions. If you run a command (like `npm init`) that produces forbidden files (e.g. `.js` in a TS project), the shell will BLOCK you. You MUST use CLI flags (e.g. `--typescript`) or rename files immediately to stay pure.
7. **HelpFirst (JIT Research)**: Do NOT guess command flags. Before using a CLI tool for the first time (e.g. `fastify`, `npm init`), you MUST run `<tool> --help` to discover the latest, correct flags for your target stack.
8. **Verify**: After writing code, run a syntax check or find command (e.g. `ls`, `cat`) to confirm it exists and matches the stack rules.
9. **One Step at a Time**: Think, Act, Observe. Don't hallucinate outputs.
10. **Error Handling**: If a command fails or triggers a Lock Violation, read the error, think, and try a different approach.
11. **No Servers**: Do NOT start persistent servers or long-running background processes (e.g. `npm start`, `python app.py`). The shell will timeout if a process takes longer than 30 seconds.
12. **Efficiency and Batching**: If you need to install multiple packages or perform similar operations on multiple files, DO SO IN ONE COMMAND. (e.g., `npm install pkg1 pkg2 pkg3` instead of three separate calls).
13. **Progress Over Perfection**: Your goal is to complete the phase tasks. Do not get stuck in infinite loops of `npm audit` or minor dependency updates unless they are blocking core functionality.
14. **Step Awareness**: You have a limit of 50 steps per phase. Use them wisely. If you reach step 40, stop all minor polish and focus exclusively on finalizing the phase.
15. **Tool Schema Checklist**:
    - `read_file(path="..." )` - ONLY `path`. No `command`.
    - `write_file(path="...", content="...")` - BOTH `path` and `content`.
    - `run_command(command="...")` - ONLY `command`.

## OUTPUT FORMAT
You MUST output a JSON object matching the provided schema.
Example:
{
  "thought": "I will batch install the 3 missing dependencies to save steps.",
  "tool": "run_command",
  "args": {"command": "npm install pkg1 pkg2 pkg3"}
}

OR if the phase is complete:
{
  "thought": "I have completed all tasks for this phase.",
  "status": "complete"
}
"""

class ExecutorAgent:
    def __init__(self, job: Job, session: AsyncSession):
        self.job = job
        self.session = session
        
        # New Standardized Layout:
        # job.workspace_path points to the root project folder
        self.project_root = job.workspace_path
        self.source_dir = os.path.join(self.project_root, "source")
        self.target_dir = os.path.join(self.project_root, "target")
        self.metadata_dir = os.path.join(self.project_root, ".kandra")
        
        # Tools are SCOPED to the target directory for safety
        self.workspace = self.target_dir
        
        # 1. Determine stack-specific language lock whitelist
        self.allowed_extensions = self._get_allowed_extensions()
        
        # 2. Initialize tools with the Language Lock
        self.tools: Dict[str, BaseTool] = {
            "run_command": ShellTool(self.target_dir, allowed_extensions=self.allowed_extensions),
            "list_dir": ListDirTool(self.target_dir),
            "read_file": ReadFileTool(self.target_dir),
            "write_file": WriteFileTool(self.target_dir, allowed_extensions=self.allowed_extensions),
        }

    def _get_allowed_extensions(self) -> List[str]:
        """Derive the language lock whitelist from the target stack."""
        stack = self.job.target_stack.lower()
        if "typescript" in stack or "ts" in stack:
            return [".ts", ".tsx"]
        if "python" in stack:
            return [".py"]
        if "go" in stack:
            return [".go"]
        if "rust" in stack:
            return [".rs"]
        # Default for JS or unknown
        return [".js", ".jsx"]
        
    async def execute_plan(self, plan: Dict[str, Any]):
        """Execute the migration plan phase by phase."""
        print(f"⚡ [Executor] Starting execution for Job {self.job.id}")
        
        try:
            phases = plan.get("phases", [])
            print(f"⚡ [Executor] Found {len(phases)} phases in plan")
            
            if not phases:
                print("⚠️ [Executor] Plan has no phases!")
                await self._emit("execution_error", {"error": "Plan has no phases"})
                return

            for i, phase in enumerate(phases):
                print(f"⚡ [Executor] Executing phase {i+1}/{len(phases)}: {phase.get('title')}")
                await self._execute_phase(phase)
                print(f"⚡ [Executor] Phase {i+1} complete")
                
            # All done
            print("✅ [Executor] All phases completed successfully")
            await self._emit("execution_complete", {"status": "success"})
            
        except Exception as e:
            print(f"❌ [Executor] Transformation failed: {e}")
            import traceback
            traceback.print_exc()
            await self._emit("execution_error", {"error": str(e)})
            raise


    async def _execute_phase(self, phase: Dict[str, Any]):
        """Execute a single phase using ReAct loop with Resilience Mastery."""
        
        phase_id = phase.get("id")
        phase_title = phase.get("title")
        tasks = phase.get("tasks", [])
        
        await self._emit("phase_started", {
            "phase_id": phase_id, 
            "title": phase_title,
            "tasks": tasks
        })
        
        print(f"🚀 Starting Phase {phase_id}: {phase_title}")
        
        # 1. Autonomous Purge: Clean the floor before the agent starts
        purged_files = await self._purge_pollution()
        
        # 2. Context and Resilience State
        history = []
        max_steps = settings.agent_max_iterations if hasattr(settings, 'agent_max_iterations') else 50
        
        action_history = [] # To detect loops: list of (tool, args_hash)
        
        for step in range(max_steps):
            print(f"👉 [Executor] Step {step+1}/{max_steps}")

            # 1. Loop Detection logic
            loop_warning = ""
            if len(action_history) >= 3:
                # Compare last 3 actions
                last_3 = action_history[-3:]
                if all(a == last_3[0] for a in last_3):
                    loop_warning = f"\n⚠️ LOOP DETECTED: You have attempted {last_3[0][0]}({last_3[0][1]}) 3 times in a row with identical results. \nSTOP: You MUST change your strategy. Try reading a different file, or run `--help` for the tool you are using. Do NOT repeat the same action again.\n"
                    print(f"⚔️ [Executor] Loop Buster Triggered!")

            # 2. Build Prompt with Resilience context
            prompt = self._build_context(phase, history, purged_files, loop_warning)
            
            # 3. Call LLM
            try:
                from app.integrations.gemini import generate
                print("🧠 [Executor] Thinking...")
                
                action_raw = await generate(
                    prompt=prompt,
                    system_instruction=EXECUTOR_SYSTEM_PROMPT,
                    response_schema=ExecutorAction
                )
                
                # Robust parsing
                action_data = self._parse_action(action_raw)
                print(f"💡 [Executor] Agent Action: {json.dumps(action_data)}")
                
            except Exception as e:
                print(f"❌ [Executor] LLM generation failed: {e}")
                # Log error and retry once
                continue

            # 4. Check for signals
            status = action_data.get("status")
            if status == "complete":
                print(f"✅ Phase {phase_id} complete!")
                await self._emit("phase_completed", {"phase_id": phase_id})
                return
            
            if status in ["incomplete", "blocked"]:
                reason = action_data.get("thought", "Agent signaled failure")
                print(f"🛑 [Executor] Agent gave up: {status} - {reason}")
                await self._emit("phase_error", {"phase_id": phase_id, "error": f"Agent {status}: {reason}"})
                raise Exception(f"Phase {phase_id} terminated by agent ({status}): {reason}")

            # 5. Execute Tool
            tool_name = action_data.get("tool")
            tool_args = action_data.get("args", {})
            # Filter out None values to prevent "unexpected keyword argument" errors
            if isinstance(tool_args, dict):
                tool_args = {k: v for k, v in tool_args.items() if v is not None}
                
            thought = action_data.get("thought", "")
            
            await self._emit("agent_thought", {
                "phase_id": phase_id,
                "thought": thought,
                "tool": tool_name
            })
            
            result_output = ""
            if tool_name in self.tools:
                try:
                    tool = self.tools[tool_name]
                    result = await tool.execute(**tool_args)
                    result_output = result.output or result.error or "Success"
                    
                    # === Telemetry: Broadcast Code Actions ===
                    if tool_name == "run_command":
                        output_to_send = result_output
                        if not output_to_send or not output_to_send.strip():
                             output_to_send = "[Command finished with no output]"
                             
                        await self._emit("terminal_output", {
                            "command": tool_args.get("command"),
                            "output": output_to_send
                        })
                        
                    elif tool_name == "write_file":
                        # Determine if create or modify (simple heuristic)
                        # We just emit 'file_modified' for now as the UI handles it broadly
                        await self._emit("file_modified", {
                            "path": tool_args.get("path"),
                            "content": tool_args.get("content")
                        })
                        
                    elif tool_name == "read_file":
                        # useful to show what the agent is looking at, but maybe not strictly 'modified'
                        pass
                        
                except Exception as e:
                    result_output = f"Tool execution error: {str(e)}"
            else:
                result_output = f"Error: Tool '{tool_name}' not found."

            # 6. Update action history for Loop Buster
            # We hash the args to quickly compare
            args_str = json.dumps(tool_args, sort_keys=True)
            action_history.append((tool_name, args_str))

            # 7. Update ReAct History with Context Pruning
            # Prune if step count is high to keep context focused
            prune_threshold = 30
            truncated_result = result_output[:1500] + ("\n... [Truncated]" if len(result_output) > 1500 else "")
            
            history.append({
                "role": "user",
                "content": f"Thought: {thought}\nAction: {tool_name}({json.dumps(tool_args)})\nResult: {truncated_result}"
            })
            
            if step > prune_threshold:
                # Keep last 10 steps + first 5 steps (the initial plan)
                if len(history) > 15:
                    history = history[:5] + history[-10:]
            elif len(history) > 100:
                history = history[-100:]

        # If we reach here, max steps exceeded
        print(f"⚠️ Phase {phase_id} max steps exceeded")
        await self._emit("phase_error", {"phase_id": phase_id, "error": f"Max steps exceeded ({max_steps})"})
        raise Exception(f"Phase {phase_id} failed to complete in {max_steps} steps")

    def _parse_action(self, raw: Any) -> Dict:
        """Robustly parse the action JSON from LLM."""
        if isinstance(raw, dict): return raw
        if not isinstance(raw, str): return {"thought": "Parsing failure", "status": "incomplete"}
        
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            match = re.search(r'\{.*\}', raw, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except: pass
        return {"thought": f"Failed to parse LLM response: {raw[:100]}", "status": "incomplete"}


    def _build_context(self, phase: Dict[str, Any], history: List[Dict[str, str]], purged_files: List[str] = None, loop_warning: str = "") -> str:
        """Construct the prompt context with Resilience warnings."""
        
        # Tool schemas
        tools_json = json.dumps([
            {
                "name": name, 
                "description": tool.description, 
                "args": tool.get_schema()
            } 
            for name, tool in self.tools.items()
        ], indent=2)
        
        task_list = "\n".join([f"- {t}" for t in phase.get("tasks", [])])
        affected_files = ", ".join(phase.get("files_affected", []))
        
        purge_context = ""
        if purged_files:
            purge_context = f"\n⚠️ AUTONOMOUS PURGE: Kandra automatically cleaned up the following forbidden files at start: {', '.join(purged_files)}\n"

        prompt = f"""
WORKSPACE LAYOUT:
- SOURCE (Legacy): ../source/
- TARGET (New): ./target/ (Current Working Directory)

STACK DNA (HARD CONSTRAINTS):
- Target Stack: {self.job.target_stack}
- Allowed Extensions: {', '.join(self.allowed_extensions)}
- Lock Status: ACTIVE (Tool-level enforcement enabled)
- Research Rule: HelpFirst protocol applies. RUN `<tool> --help` before first use.
{purge_context}{loop_warning}
CURRENT PHASE: {phase.get("title")}
DESCRIPTION: {phase.get("description")}

TASKS TO COMPLETE:
{task_list}

AFFECTED FILES:
{affected_files}

AVAILABLE TOOLS:
{tools_json}

HISTORY:
"""
        # Append recent history
        for item in history:
            prompt += f"\n{item['content']}\n"
            
        prompt += "\nWhat is your next action? (Response MUST be JSON)"
        return prompt

    async def _purge_pollution(self) -> List[str]:
        """Automatically delete files that violate the Language Lock before starting a phase."""
        if not self.allowed_extensions:
            return []

        print("🧹 [Executor] Running Autonomous Workspace Purge...")
        purged_files = []
        meta_allow = [".json", ".md", ".yml", ".yaml", ".txt", ".gitignore", ".env", ".lock", "license"]
        
        for root, dirs, files in os.walk(self.target_dir):
            if "node_modules" in root or ".git" in root or "__pycache__" in root:
                continue
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                is_code = ext in [".js", ".jsx", ".ts", ".tsx", ".py", ".go", ".rs", ".c", ".cpp", ".java"]
                if is_code and ext not in self.allowed_extensions and ext not in meta_allow:
                    file_path = os.path.join(root, f)
                    try:
                        os.remove(file_path)
                        purged_files.append(f)
                        print(f"   🗑️ Purged pollution: {f}")
                    except Exception as e:
                        print(f"   ⚠️ Failed to purge {f}: {e}")
        
        if purged_files:
            print(f"✅ [Executor] Purged {len(purged_files)} polluting files. Workspace is now 100% pure.")
            await self._emit("cleanup_status", {"purged_count": len(purged_files)})
        
        return purged_files

    async def _emit(self, event_type: str, payload: Dict[str, Any]):
        """
        Dual-Write Emit:
        1. Persist to DB (Source of Truth)
        2. Publish to Memory Bus (Real-time speed)
        """
        try:
            # 1. DB Write (Persistence)
            event = JobEvent(
                job_id=self.job.id,
                event_type=event_type,
                payload=payload
            )
            self.session.add(event)
            await self.session.commit()
            
            # 2. RAM Broadcast (Speed)
            from app.integrations.event_bus import bus
            
            # Construct message with timestamp from DB (to match replay)
            msg = {
                "type": event_type,
                "job_id": self.job.id,
                "payload": payload,
                "timestamp": event.created_at.isoformat() if event.created_at else datetime.utcnow().isoformat()
            }
            
            print(f"📡 [Executor DEBUG] Emitting {event_type} (payload size: {len(str(payload))}) -> DB & BUS")
            await bus.publish(f"job:{self.job.id}", msg)
            
        except Exception as e:
            print(f"❌ Failed to emit event {event_type}: {e}")
            import traceback
            traceback.print_exc()
