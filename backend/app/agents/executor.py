import json
import os
import re
import asyncio
import difflib
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
    timeout: Optional[float] = Field(None, description="Optional custom timeout in seconds for run_command")

class ExecutorAction(BaseModel):
    thought: str = Field(description="Internal reasoning about the next step")
    tool: Optional[str] = Field(None, description="The tool to call (run_command, read_file, etc.)")
    args: Optional[ToolArguments] = Field(None, description="Arguments for the tool")
    status: Optional[str] = Field(None, description="Set to 'complete' when the phase is finished")

EXECUTOR_SYSTEM_PROMPT_TEMPLATE = """You are an expert autonomous software engineer.
Your task is to execute a specific phase of a migration plan.

## DISCOVERED TOOLS
The planner has researched and discovered the correct tools for this stack:
- **Package Manager**: {package_manager}
- **Test Framework**: {test_framework}
- **Build Tool**: {build_tool}

USE THESE TOOLS. Do not assume or guess. The package manager commands will work as-is.

## GROUNDING ASSISTANCE
If a command fails repeatedly (2+ times), the system will automatically search the web for solutions.
You will receive a "SOLUTION SUGGESTION" in your context. Consider it carefully and try the recommended fix.

## CAPABILITIES
You have access to a Linux shell and file system tools.
You can:
- Run commands using the discovered package manager above
- Read/Write files
- Explore the codebase

## RULES
1. **Be Frugal**: Only read files you absolutely need. Use `ls -R` first to understand structure.
2. **Environment Discovery (CRITICAL)**: Before running build or test commands in a new project, you MUST discover the environment. Run `<tool> --version` or check for wrappers (e.g. `./mvnw`, `./gradlew`).
3. **Standardized Layout**: You are working in a structured environment:
    - Current Working Directory (CWD) is `./target/`. This is where the NEW migrated code lives.
    - Legacy Source Code is in `../source/`. This is READ-ONLY. Use it for reference.
    - Meta data is in `../.kandra/`.
4. **Relative Pathing**: To read legacy code, use `read_file(path="../source/filename.ts")`.
5. **All Changes into Target**: All `write_file` and `run_command` operations must stay within `./target/`.
6. **No Copying (Logic Purity)**: DO NOT copy files from `../source/` to `./`. You are forbidden from using `cp` or `mv` for code files. Your goal is to REWRITE the logic in clean, new files. Reading is allowed, but logic duplication is forbidden.
7. **Language Lock (Relaxed Audit)**: This environment monitors file extensions. While legacy/auxiliary files are permitted, you should prioritize writing code that matches the target stack. If you generate files in the target stack (e.g. `.java`) even if the engine expected something else, it will warn but ALLOW it.
8. **HelpFirst (JIT Research)**: Do NOT guess command flags. Before using a CLI tool for the first time (e.g. `fastify`, `mvn`), you MUST run `<tool> --help` to discover the latest, correct flags.
9. **Verify**: After writing code, run a syntax check or find command (e.g. `ls`, `cat`) to confirm it exists.
10. **One Step at a Time**: Think, Act, Observe. Don't hallucinate outputs.
11. **Super-Intelligent Verification**: You MAY start dev servers for verification. The shell will return success and automatically CLEAN UP the entire process tree (including all child processes) once it detects a "Ready" signal.
    - **SERVER LIFECYCLE (CRITICAL)**: Because the shell kills the process group after "Ready", the server will NOT be running when the tool returns. If you need to perform a check (like `curl`) while the server is alive, you MUST use the **ONE-SHOT VERIFICATION STRATEGY** (see below).
    - **ONE-SHOT VERIFICATION STRATEGY**: To test a persistent service, use a single command that starts the server, waits, performs the check, and cleanup: `npm start & sleep 5 && curl http://localhost:9001 && kill %1`. 
    - **PHASE VERIFICATION**: If the plan includes verification, ensure your commands follow the one-shot strategy.
12. **Heavy Commands**: For long-running tasks like massive installs or complex builds, the system will automatically give you extra time (up to 5 mins). You don't need to ask.
13. **No Interactive Prompts**: ALWAYS use non-interactive flags (e.g., `-y`, `--yes`, `--force`). If a command asks a question (e.g., "Do you want to continue?"), the shell will kill it and report a failure.
14. **Efficiency**: Batch your operations. Install multiple packages in one command.
15. **Tool Schema**:
    - `run_command(command="...", timeout=...)` - Use `timeout` ONLY if you know a command takes longer than 60s.
16. **PYTHON PROJECTS**:
    - **VIRTUAL ENV MANDATORY**: You MUST use a virtual environment. If `.venv` exists, use it. If not, create it (`python3 -m venv .venv`).
    - **PIP USAGE**: ALWAYS use `./.venv/bin/pip` (or `source .venv/bin/activate && pip`). NEVER use global `pip`.
    - **PYTHON USAGE**: ALWAYS use `./.venv/bin/python`.
    - **DEPENDENCIES**: Install dependencies into the venv. Do NOT assume they are installed.
17. **PORT ENFORCEMENT & SAFETY**: You are FORBIDDEN from using standard ecosystem ports (e.g., 3000, 5000, 8000). ALWAYS use ports in the **9000-9999** range. If you get an "Address already in use" error, DO NOT REPEAT the same command. IMMEDIATELY increment the port (e.g., jump from 9001 to 9002) and try again. Repeating a command on a blocked port is a sign of agent failure.
18. **NO TERMINATION ON FAILURE**: If a file operation or command fails, analyze the error and try an alternative approach. 
19. **NO SOURCE LEAKS (MANDATORY)**: You are FORBIDDEN from referencing `../source/` in any file you write to `./target/`. This includes imports, requires, or file paths in configuration files (e.g., `package.json`, `jest.config.js`). The target MUST be 100% self-contained and isolated from the source. You are REWRITING the logic, not proxying or wrapping it. Any reference to `../source/` in your written code is a critical failure.
20. **DIAGNOSTIC LOOP (SUPER INTELLIGENCE)**: If a command fails or a test is red, you MUST NOT attempt a fix blindly. 
    - **Analyze First**: Use your `thought` block to diagnose the failure based on the error output.
    - **Prove Hypothesis**: Before writing code to fix an error, use `read_file`, `ls`, or `diagnose` (if available) to verify your understanding of why it failed. 
    - **No Loop**: Repeating the same failed action with the same logic is a mark of stupidity. You MUST change your approach if the previous step failed.
21. **REFLECTION**: Always look at the "FAILURE REFLECTION" block in your context. It contains a summarized history of what didn't work. Learn from it.

## OUTPUT FORMAT
You MUST output a JSON object matching the provided schema.
Example:
{{
  "thought": "I will batch install the 3 missing dependencies to save steps.",
  "tool": "run_command",
  "args": {{"command": "{package_manager} install pkg1 pkg2 pkg3"}}
}}

OR if the phase is complete:
{{
  "thought": "I have completed all tasks for this phase.",
  "status": "complete"
}}
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
        
        # NEW: Discovered tools from plan (set during execute_plan)
        self.package_manager = None
        self.test_framework = None
        self.build_tool = None
        self.discovered_extensions = []
        
        # Activity tracking for stuck detection
        self.current_activity = "idle"
        self.activity_start_time = None
        self.activity_details = {}
        self.last_successful_action = None
        self.current_phase_id = None
        self.current_step = 0
        self.is_executing = False
        
        # 1. Determine stack-specific language lock whitelist
        self.allowed_extensions = self._get_allowed_extensions()
        
        # 2. Initialize tools with the Language Lock
        self.tools: Dict[str, BaseTool] = {
            "run_command": ShellTool(self.target_dir, allowed_extensions=self.allowed_extensions),
            "list_dir": ListDirTool(self.target_dir),
            "read_file": ReadFileTool(self.target_dir),
            "write_file": WriteFileTool(self.target_dir, allowed_extensions=self.allowed_extensions),
        }


    def _setup_smart_wrappers(self):
        """Setup smart command wrappers based on discovered tools and target stack."""
        original_run_command = self.tools["run_command"].execute
        target_stack = self.job.target_stack.lower()
        
        async def smart_run_command(command: str, **kwargs):
            cmd_stripped = command.strip()
            
            # Python projects: wrap pip/python/pytest commands with venv
            if "python" in target_stack:
                wrapped = await self._wrap_python_command(cmd_stripped, original_run_command, **kwargs)
                if wrapped is not None:
                    return wrapped
            
            # Ruby projects: wrap gem/bundle/rake/rails commands with bundler
            elif "ruby" in target_stack:
                wrapped = await self._wrap_ruby_command(cmd_stripped, original_run_command, **kwargs)
                if wrapped is not None:
                    return wrapped
            
            # Rust projects: mostly pass-through (cargo handles environment)
            elif "rust" in target_stack:
                wrapped = await self._wrap_rust_command(cmd_stripped, original_run_command, **kwargs)
                if wrapped is not None:
                    return wrapped
            
            # Go projects: mostly pass-through (go modules handle environment)
            elif "go" in target_stack:
                wrapped = await self._wrap_go_command(cmd_stripped, original_run_command, **kwargs)
                if wrapped is not None:
                    return wrapped
            
            # Java/Spring projects: wrap mvn/gradle
            elif "java" in target_stack or "spring" in target_stack:
                wrapped = await self._wrap_java_command(cmd_stripped, original_run_command, **kwargs)
                if wrapped is not None:
                    return wrapped
            
            return await original_run_command(command, **kwargs)
            
        self.tools["run_command"].execute = smart_run_command

    async def _wrap_python_command(self, cmd: str, original_run, **kwargs):
        """Wrap Python commands with venv."""
        if cmd.startswith("pip "):
            new_cmd = f"./.venv/bin/{cmd}"
            print(f"🐍 [Smart Wrapper] Rewriting '{cmd}' -> '{new_cmd}'")
            return await original_run(new_cmd, **kwargs)
            
        if cmd.startswith("python "):
            new_cmd = f"./.venv/bin/{cmd}"
            print(f"🐍 [Smart Wrapper] Rewriting '{cmd}' -> '{new_cmd}'")
            return await original_run(new_cmd, **kwargs)
        
        # Handle test framework if it's pytest
        if self.test_framework == "pytest" and (cmd == "pytest" or cmd.startswith("pytest ")):
            new_cmd = f"./.venv/bin/{cmd}"
            print(f"🐍 [Smart Wrapper] Rewriting '{cmd}' -> '{new_cmd}'")
            return await original_run(new_cmd, **kwargs)
        
        return None  # Not a Python command, pass through

    async def _wrap_ruby_command(self, cmd: str, original_run, **kwargs):
        """Wrap Ruby commands with bundler."""
        if cmd.startswith(("gem ", "rake ", "rails ")):
            new_cmd = f"bundle exec {cmd}"
            print(f"💎 [Smart Wrapper] Rewriting '{cmd}' -> '{new_cmd}'")
            return await original_run(new_cmd, **kwargs)
        
        # bundle commands pass through as-is
        if cmd.startswith("bundle "):
            return await original_run(cmd, **kwargs)
        
        return None

    async def _wrap_rust_command(self, cmd: str, original_run, **kwargs):
        """Wrap Rust commands (mostly pass-through, cargo handles environment)."""
        # Cargo commands work as-is
        if cmd.startswith(("cargo ", "rustc ", "rustup ")):
            print(f"🦀 [Smart Wrapper] Running Rust command: {cmd}")
            return await original_run(cmd, **kwargs)
        
    async def _wrap_java_command(self, cmd: str, original_run, **kwargs):
        """Wrap Java commands with Maven/Gradle intelligence."""
        # Detect if we should use wrappers
        use_mvn_wrapper = os.path.exists(os.path.join(self.target_dir, "mvnw"))
        use_gradle_wrapper = os.path.exists(os.path.join(self.target_dir, "gradlew"))

        if cmd.startswith("mvn "):
            new_cmd = cmd.replace("mvn ", "./mvnw " if use_mvn_wrapper else "mvn ")
            print(f"☕ [Smart Wrapper] Rewriting '{cmd}' -> '{new_cmd}'")
            return await original_run(new_cmd, **kwargs)

        if cmd.startswith("gradle "):
            new_cmd = cmd.replace("gradle ", "./gradlew " if use_gradle_wrapper else "gradle ")
            print(f"☕ [Smart Wrapper] Rewriting '{cmd}' -> '{new_cmd}'")
            return await original_run(new_cmd, **kwargs)

        if cmd.startswith("java "):
             print(f"☕ [Smart Wrapper] Running Java command: {cmd}")
             return await original_run(cmd, **kwargs)
        
        return None

    async def _wrap_go_command(self, cmd: str, original_run, **kwargs):
        """Wrap Go commands (mostly pass-through, go modules handle environment)."""
        # Go commands work as-is
        if cmd.startswith(("go ", "gofmt ", "golint ")):
            print(f"🐹 [Smart Wrapper] Running Go command: {cmd}")
            return await original_run(cmd, **kwargs)
        
        return None



    def _get_allowed_extensions(self) -> List[str]:
        """Get allowed extensions from plan or fallback to smart detection."""
        # Use discovered extensions if available
        if hasattr(self, 'discovered_extensions') and self.discovered_extensions:
            return self.discovered_extensions
        
        # Fallback: smart detection (should rarely be used)
        stack = self.job.target_stack.lower()
        if "typescript" in stack or "ts" in stack:
            return [".ts", ".tsx"]
        if "python" in stack or "flask" in stack or "django" in stack or "fastapi" in stack:
            return [".py"]
        if "go" in stack:
            return [".go"]
        if "rust" in stack:
            return [".rs"]
        if "ruby" in stack or "rails" in stack:
            return [".rb"]
        if "elixir" in stack or "phoenix" in stack:
            return [".ex", ".exs"]
        if "java" in stack or "spring" in stack or "kotlin" in stack:
            return [".java", ".kt"]
        if "csharp" in stack or "dotnet" in stack or ".net" in stack:
            return [".cs"]
        if "php" in stack or "laravel" in stack:
            return [".php"]
        if "swift" in stack:
            return [".swift"]
        
        # Default for JS or unknown
        return [".js", ".jsx"]
        
    async def execute_plan(self, plan: Dict[str, Any]):
        """Execute the migration plan phase by phase."""
        print(f"⚡ [Executor] Starting execution for Job {self.job.id}")
        
        # Extract discovered tools from plan
        transformation = plan.get("transformation", {})
        self.package_manager = transformation.get("package_manager", "npm")  # fallback to npm
        self.test_framework = transformation.get("test_framework")
        self.build_tool = transformation.get("build_tool")
        self.discovered_extensions = transformation.get("file_extensions", [])
        
        print(f"🛠️  [Executor] Using discovered tools from plan:")
        print(f"   📦 Package Manager: {self.package_manager}")
        print(f"   🧪 Test Framework: {self.test_framework or 'Not specified'}")
        print(f"   🔨 Build Tool: {self.build_tool or 'Not specified'}")
        print(f"   📄 File Extensions: {self.discovered_extensions or 'Using fallback detection'}")
        
        # Update allowed extensions if discovered
        if self.discovered_extensions:
            self.allowed_extensions = self.discovered_extensions
            print(f"✅ [Executor] Language lock updated to: {self.allowed_extensions}")
        
        # Update smart wrappers with discovered tools
        self._setup_smart_wrappers()
        
        # Start watchdog for stuck detection
        self.is_executing = True
        watchdog_task = asyncio.create_task(self._watchdog_loop())
        
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
            traceback.print_exc()
            await self._emit("execution_error", {"error": str(e)})
        
        finally:
            # Stop watchdog
            self.is_executing = False
            watchdog_task.cancel()
            try:
                await watchdog_task
            except asyncio.CancelledError:
                pass
            raise


    async def _execute_phase(self, phase: Dict[str, Any]):
        """Execute a single phase using ReAct loop with Resilience Mastery."""
        
        phase_id = phase.get("id")
        phase_title = phase.get("title")
        tasks = phase.get("tasks", [])
        
        # Track phase info for diagnostics
        self.current_phase_id = phase_id
        
        await self._emit("phase_started", {
            "phase_id": phase_id, 
            "title": phase_title,
            "tasks": tasks
        })
        
        print(f"🚀 Starting Phase {phase_id}: {phase_title}")
        
        # Track activity: starting phase
        await self._set_activity("starting_phase", {
            "phase_title": phase_title,
            "phase_id": phase_id
        })
        
        # 0. Python Environment Setup (Auto-Venv)
        await self._ensure_python_venv()

        # 1. Autonomous Purge: Clean the floor before the agent starts
        purged_files = await self._purge_pollution()
        
        # 2. Context and Resilience State (Initialize BEFORE test gate)
        history = [] # Proper role-based history: [{"role": "user" or "model", "content": "..."}]
        failure_lessons = [] # List of unique failure summaries
        last_thought = ""
        max_steps = settings.agent_max_iterations if hasattr(settings, 'agent_max_iterations') else 50
        
        # Error tracking for grounding
        consecutive_failures = 0
        last_failed_command = None
        
        action_history = [] # To detect tool loops
        
        # 1.5 Pre-Execution Verification (Testing Phases Only)
        phase_lower = phase_title.lower()
        if "test" in phase_lower or "verif" in phase_lower or "qa" in phase_lower:
            print("🛡️ [Test Gate] Running pre-execution baseline...")
            success, output = await self._run_test_gate()
            if not success:
                 print("⚠️ [Test Gate] Initial baseline check FAILED.")
                 history.append({
                     "role": "user",
                     "content": f"PRE-CONDITION WARNING: The test suite is FAILING at the start of this phase. Your priority is to fix the environment or code before proceeding.\n\nERROR:\n{output[-1000:]}"
                 })
        
        for step in range(max_steps):
            self.current_step = step + 1
            print(f"👉 [Executor] Step {step+1}/{max_steps}")

            # 1. Loop Detection logic (Shell/Tool loops)
            loop_warning = ""
            if len(action_history) >= 3:
                last_3 = action_history[-3:]
                if all(a == last_3[0] for a in last_3):
                    loop_warning = f"\n⚠️ TOOL LOOP DETECTED: You have attempted {last_3[0][0]} 3 times with identical parameters. You MUST change your strategy.\n"
                    print(f"⚔️ [Executor] Tool Loop Buster Triggered!")

            # 2. Build Multi-Turn Context (Strict Alternation)
            reflection_str = "\n".join([f"- {l}" for l in failure_lessons[-3:]])
            current_prompt = self._build_context(phase, [], purged_files, loop_warning, reflection_str)
            
            # Gemini strictly alternates User -> Model -> User
            messages = []
            
            if not history:
                # Turn 1: Just the preamble
                messages.append({"role": "user", "parts": [{"text": current_prompt}]})
            else:
                # Turns 2+: Build from history but MERGE the current_prompt into the last turn 
                # to maintain strict alternation if history ends with user (observation)
                for h in history[:-1]:
                    messages.append({"role": h["role"], "parts": [{"text": h["content"]}]})
                
                last_turn = history[-1]
                if last_turn["role"] == "user":
                    # Merge current_prompt into the observation turn
                    merged_content = f"{last_turn['content']}\n\n--- CURRENT STATUS ---\n{current_prompt}"
                    messages.append({"role": "user", "parts": [{"text": merged_content}]})
                else:
                    # History ends with model? (Shouldn't happen with our cleanup, but safety first)
                    messages.append({"role": last_turn["role"], "parts": [{"text": last_turn["content"]}]})
                    messages.append({"role": "user", "parts": [{"text": current_prompt}]})

            # 3. Call LLM with formatted system prompt
            try:
                from app.integrations.gemini import generate
                print("🧠 [Executor] Thinking...")
                
                # Track activity: waiting for LLM
                await self._set_activity("waiting_for_llm", {
                    "step": step + 1,
                    "max_steps": max_steps,
                    "prompt_size_chars": len(current_prompt),
                    "history_length": len(history)
                })
                
                # Format system prompt with discovered tools
                formatted_prompt = EXECUTOR_SYSTEM_PROMPT_TEMPLATE.format(
                    package_manager=self.package_manager or "npm",
                    test_framework=self.test_framework or "Not specified",
                    build_tool=self.build_tool or "Not specified"
                )
                
                action_raw = await generate(
                    prompt=messages, # Pass the list of messages!
                    system_instruction=formatted_prompt,
                    response_schema=ExecutorAction
                )
                
                action_data = self._parse_action(action_raw)
                thought = action_data.get("thought", "")
                
                # 🧠 Thought Loop Buster (Similarity check)
                if last_thought:
                    similarity = difflib.SequenceMatcher(None, thought, last_thought).ratio()
                    if similarity > 0.85:
                        print(f"⚔️ [Executor] Thought Loop Detected ({similarity:.2f})!")
                        history.append({"role": "model", "content": json.dumps(action_data)})
                        history.append({
                            "role": "user", 
                            "content": "⚠️ LOOP WARNING: Your reasoning is almost identical to your last turn. You are stuck in a thought loop. STOP repeating yourself. Run a diagnostic command (ls -R, cat) to check the actual state of the file system and break your cycle."
                        })
                        continue # Re-run with the warning
                
                last_thought = thought
                print(f"💡 [Executor] Agent Action: {json.dumps(action_data)}")
                
            except Exception as e:
                print(f"❌ [Executor] LLM generation failed: {e}")
                await asyncio.sleep(2) # Prevent fast-failing infinite loops
                if step > 10 and "400" in str(e):
                    # If we keep getting 400 errors, stop the bleeding
                    raise Exception(f"Persistent LLM Error: {e}")
                continue

            # 4. Check for Hallucination (Thought but no action)
            tool_name = action_data.get("tool")
            status = action_data.get("status")
            
            if not tool_name and status != "complete" and status != "incomplete" and status != "blocked":
                print("⚠️ [Executor] Hallucination Nudge: Agent thought but didn't act.")
                history.append({"role": "model", "content": json.dumps(action_data)})
                history.append({
                    "role": "user",
                    "content": "Error: You provided a thought but no 'tool' or 'status'. You MUST provide a concrete action or signal that you are finished."
                })
                continue

            # 4. Check for signals
            status = action_data.get("status")
            if status == "complete":
                # === PLAN-DRIVEN TEST GATE ===
                verification = phase.get("verification", {})
                test_commands = verification.get("test_commands", [])
                
                if test_commands:
                    print(f"🛡️ [Test Gate] Running verification commands from plan...")
                    all_passed = True
                    fail_output = ""
                    for cmd in test_commands:
                        tool = self.tools["run_command"]
                        res = await tool.execute(cmd)
                        output = (res.output or "") + "\n" + (res.error or "")
                        failure_indicators = ["FAILURES", "FAILED (", "Tests failed", "Test failed", "✖", "✗", "Error:"]
                        if any(ind in output for ind in failure_indicators) and "0 failures" not in output:
                            all_passed = False
                            fail_output = output
                            break
                    if not all_passed:
                        print("❌ [Test Gate] Plan Verification Failed!")
                        error_msg = f"BLOCKING: Phase verification FAILED.\n\nERROR:\n{fail_output[-2000:]}"
                        history.append({"role": "user", "content": error_msg})
                        # Update Reflection
                        lesson = f"Attempted to finish phase but test commands {test_commands} failed with output: {fail_output[-200:]}"
                        if lesson not in failure_lessons: failure_lessons.append(lesson)
                        continue
                elif "test" in phase_title.lower() or "verif" in phase_title.lower():
                    success, output = await self._run_test_gate()
                    if not success:
                        error_msg = f"BLOCKING: Heuristic verification FAILED.\n\nERROR:\n{output[-2000:]}"
                        history.append({"role": "user", "content": error_msg})
                        lesson = f"Attempted to finish phase but automated test gate failed with output: {output[-200:]}"
                        if lesson not in failure_lessons: failure_lessons.append(lesson)
                        continue

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
            
            # Track activity: executing tool
            await self._set_activity("executing_tool", {
                "tool": tool_name,
                "args": tool_args,
                "step": step + 1
            })
            
            result_output = ""
            command_failed = False
            if tool_name in self.tools:
                try:
                    tool = self.tools[tool_name]
                    result = await tool.execute(**tool_args)
                    result_output = result.output or result.error or "Success"
                    
                    # Check if command failed (for grounding trigger)
                    if result.error and tool_name == "run_command":
                        command_failed = True
                    
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
                    command_failed = True
            else:
                result_output = f"Error: Tool '{tool_name}' not found."
            
            # Track successful action (if not failed)
            if not command_failed:
                self.last_successful_action = {
                    "tool": tool_name,
                    "timestamp": datetime.utcnow().isoformat(),
                    "step": step + 1,
                    "phase_id": phase_id
                }

            # 6. Error Tracking & Grounding Trigger
            if command_failed and tool_name == "run_command":
                cmd = tool_args.get("command", "")
                if cmd == last_failed_command:
                    consecutive_failures += 1
                else:
                    consecutive_failures = 1
                    last_failed_command = cmd
                
                # Trigger grounding after 2 consecutive failures
                if consecutive_failures >= 2:
                    print(f"🔍 [Executor] Command failed {consecutive_failures} times, searching for solution...")
                    solution = await self._search_for_solution(result_output, cmd)
                    
                    # Inject solution into history before observation
                    history.append({
                        "role": "model",
                        "content": json.dumps(action_data)
                    })
                    history.append({
                        "role": "user",
                        "content": f"Observation: {result_output[:2000]}\n\n🔍 SOLUTION SUGGESTION (from web search):\n{solution}\n\nTry this approach or an alternative based on the research above."
                    })
                    consecutive_failures = 0  # Reset after providing help
                    continue  # Skip normal history update, we already added it
            else:
                consecutive_failures = 0  # Reset on success

            # 7. Update action history for Loop Buster
            # We hash the args to quickly compare
            args_str = json.dumps(tool_args, sort_keys=True)
            action_history.append((tool_name, args_str))

            # 8. Update ReAct History with Correct Roles
            # Add Model turn
            history.append({
                "role": "model",
                "content": json.dumps(action_data)
            })
            
            # Add User turn (The observation)
            truncated_result = result_output[:2000] + ("\n... [Truncated]" if len(result_output) > 2000 else "")
            history.append({
                "role": "user",
                "content": f"Observation: {truncated_result}"
            })
            
            
            # 8. Context Pruning (Preserve context)
            prune_threshold = 40
            if step > prune_threshold:
                # Keep last 15 turns (model+user pairs) 
                if len(history) > 30:
                    history = history[-30:]

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

    async def _search_for_solution(self, error_output: str, failed_command: str) -> str:
        """Search the web for error solution using grounding."""
        from app.integrations.gemini import generate_with_grounding
        
        # Extract key error message (first 300 chars for context)
        error_snippet = error_output[:300]
        
        # Build search prompt
        search_prompt = f"""I encountered this error while running a migration command:

Command: {failed_command}
Target Stack: {self.job.target_stack}
Package Manager: {self.package_manager}

Error Output:
{error_snippet}

Search for a solution to this error and provide:
1. The likely cause of this error
2. The recommended fix or workaround
3. An alternative command if applicable
4. Any relevant documentation links

Be concise and actionable."""
        
        print(f"🔍 [Executor] Searching for solution to error...")
        
        try:
            result = await generate_with_grounding(
                prompt=search_prompt,
                system_instruction="You are a debugging assistant. Search for solutions to migration errors and provide concise, actionable fixes based on official documentation."
            )
            
            solution = result['text']
            sources = result['grounding_metadata'].get('sources', [])
            
            print(f"💡 [Executor] Found solution from {len(sources)} sources")
            
            # Add source citations
            if sources:
                solution += "\n\nSources consulted:\n"
                for src in sources[:3]:  # Top 3 sources
                    solution += f"- {src.get('title', 'Unknown')}: {src.get('uri', '')}\n"
            
            return solution
            
        except Exception as e:
            print(f"⚠️ [Executor] Grounding search failed: {e}")
            return f"Unable to search for solution (grounding error: {str(e)}). Try a different approach based on the error message."


    async def _set_activity(self, activity: str, details: dict = None):
        """Track current agent activity and emit to frontend."""
        self.current_activity = activity
        self.activity_start_time = datetime.utcnow()
        self.activity_details = details or {}
        
        await self._emit("activity_update", {
            "activity": activity,
            "details": self.activity_details,
            "started_at": self.activity_start_time.isoformat(),
            "phase_id": self.current_phase_id,
            "step": self.current_step
        })
    
    async def _watchdog_loop(self):
        """Monitor for stuck states and emit diagnostics."""
        import asyncio
        
        while self.is_executing:
            await asyncio.sleep(30)  # Check every 30 seconds
            
            if self.activity_start_time:
                duration = (datetime.utcnow() - self.activity_start_time).total_seconds()
                
                # Warn if stuck on same activity for >2 minutes
                if duration > 120:
                    diagnostics = self._get_stuck_diagnostics(duration)
                    
                    await self._emit("stuck_warning", {
                        "activity": self.current_activity,
                        "duration_seconds": int(duration),
                        "last_successful_action": self.last_successful_action,
                        "diagnostics": diagnostics,
                        "phase_id": self.current_phase_id,
                        "step": self.current_step
                    })
    
    def _get_stuck_diagnostics(self, duration: float) -> dict:
        """Generate detailed diagnostics about why agent is stuck."""
        diagnostics = {
            "activity": self.current_activity,
            "duration_seconds": int(duration),
            "details": self.activity_details
        }
        
        # Activity-specific diagnostics
        if self.current_activity == "waiting_for_llm":
            diagnostics["likely_cause"] = "LLM API not responding or taking too long"
            diagnostics["suggestion"] = "Check Gemini API status, network connection, or prompt size"
            diagnostics["context"] = {
                "prompt_size": self.activity_details.get("prompt_size_chars"),
                "history_length": self.activity_details.get("history_length")
            }
        
        elif self.current_activity == "executing_tool":
            tool = self.activity_details.get("tool")
            diagnostics["likely_cause"] = f"Tool '{tool}' is hanging or taking too long"
            
            if tool == "run_command":
                cmd = self.activity_details.get("args", {}).get("command", "unknown")
                diagnostics["suggestion"] = f"Command '{cmd}' may be waiting for input or running indefinitely"
            else:
                diagnostics["suggestion"] = f"Tool '{tool}' may have encountered an issue"
        
        elif self.current_activity == "starting_phase":
            diagnostics["likely_cause"] = "Phase initialization stuck"
            diagnostics["suggestion"] = "Check for environment setup issues (venv, dependencies)"
        
        else:
            diagnostics["likely_cause"] = "Unknown - agent in unexpected state"
            diagnostics["suggestion"] = "Consider cancelling and retrying the job"
        
        return diagnostics


    def _build_context(self, phase: Dict[str, Any], history: List[Dict[str, str]], purged_files: List[str] = None, loop_warning: str = "", failure_reflection: str = "") -> str:
        """Construct the prompt context with Resilience warnings and Failure Reflection."""
        
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
        instructions = "\n".join([f"- {i}" for i in phase.get("instructions", [])])
        
        # Handle new 'files_impacted' (list of dicts) or legacy 'files_affected' (string list)
        impacted_files_raw = phase.get("files_impacted", phase.get("files_affected", []))
        if isinstance(impacted_files_raw, list) and len(impacted_files_raw) > 0 and isinstance(impacted_files_raw[0], dict):
            affected_table = "| Source | Target | Reason |\n|---|---|---|\n"
            for f in impacted_files_raw:
                affected_table += f"| {f.get('source')} | {f.get('target')} | {f.get('reason')} |\n"
            affected_files = affected_table
        else:
            affected_files = ", ".join(impacted_files_raw) if isinstance(impacted_files_raw, list) else str(impacted_files_raw)
        
        verification = phase.get("verification", {})
        success_criteria = verification.get("success_criteria", "All tasks complete")
        test_commands = ", ".join(verification.get("test_commands", []))

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
FAILURE REFLECTION (LEARN FROM THIS):
{failure_reflection if failure_reflection else "No previous failures in this phase."}
CURRENT PHASE: {phase.get("title")}
DESCRIPTION: {phase.get("description")}

DETAILED INSTRUCTIONS (DO NOT DEVIATE):
{instructions}

TASKS TO COMPLETE:
{task_list}

FILES IMPACTED:
{affected_files}

PHASE VERIFICATION (MANDATORY SUCCESS):
- Success Criteria: {success_criteria}
- Verification Commands: {test_commands}

AVAILABLE TOOLS:
{tools_json}

What is your next action? (Response MUST be JSON)
"""
        return prompt

    async def _ensure_python_venv(self):
        """Standardize Python environment: Create/verify .venv."""
        stack = self.job.target_stack.lower()
        if "python" not in stack and "django" not in stack and "flask" not in stack and "fastapi" not in stack:
            # Not Python
            return

        venv_path = os.path.join(self.target_dir, ".venv")
        if not os.path.exists(venv_path):
            print("🐍 [Python Setup] Creating virtual environment (.venv)...")
            try:
                import sys
                import subprocess
                
                # Create venv using the same python binary as the backend
                subprocess.run([sys.executable, "-m", "venv", ".venv"], check=True, cwd=self.target_dir)
                
                # Upgrade pip inside venv
                pip_path = os.path.join(venv_path, "bin", "pip")
                if os.path.exists(pip_path):
                     subprocess.run([pip_path, "install", "--upgrade", "pip"], check=False, cwd=self.target_dir)

                print("✅ [Python Setup] Virtual environment created.")
                
            except Exception as e:
                print(f"⚠️ [Python Setup] Failed to create venv: {e}")

    async def _purge_pollution(self) -> List[str]:
        """Automatically delete files that violate the Language Lock before starting a phase."""
        if not self.allowed_extensions:
            return []

        print("🧹 [Executor] Running Autonomous Workspace Purge...")
        purged_files = []
        meta_allow = [
            ".json", ".md", ".yml", ".yaml", ".txt", ".gitignore", ".env", 
            ".lock", "license", ".editorconfig", "tsconfig.json", "package.json",
            "jest.config.js", "next.config.js", "tailwind.config.js", "postcss.config.js",
            "vite.config.js", "babel.config.js", "webpack.config.js"
        ]
        
        ignore_dirs = [
            "node_modules", ".git", "__pycache__", ".venv", "dist", "build", 
            "coverage", ".next", ".turbo", "out", ".jest_cache", ".pytest_cache",
            "target", "vendor", ".cache"
        ]
        
        for root, dirs, files in os.walk(self.target_dir):
            # Skip ignored directories
            if any(id_dir in root.split(os.sep) for id_dir in ignore_dirs):
                continue
                
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                is_code = ext in [".js", ".jsx", ".ts", ".tsx", ".py", ".go", ".rs", ".c", ".cpp", ".java"]
                
                # Special case: allow .config.js files
                is_config = f.endswith(".config.js") or f.endswith(".config.cjs") or f.endswith(".config.mjs")
                
                if is_code and not is_config and ext not in self.allowed_extensions and ext not in meta_allow and f.lower() not in meta_allow:
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

    async def _run_test_gate(self) -> tuple[bool, str]:
        """
        Intelligent Test Runner using discovered test framework from plan.
        Falls back to smart detection if test framework not specified.
        """
        print(f"🛡️ [Test Gate] Running validation...")
        
        command = ""
        
        # Use discovered test framework if available
        if self.test_framework:
            print(f"🛡️ [Test Gate] Using discovered test framework: {self.test_framework}")
            
            # Python test frameworks
            if self.test_framework == "pytest":
                command = "./.venv/bin/pytest"
            elif self.test_framework == "unittest":
                command = "./.venv/bin/python -m unittest discover tests"
            
            # Node test frameworks
            elif self.test_framework in ["jest", "vitest", "mocha", "tap"]:
                command = f"{self.package_manager} test"
            
            # Go
            elif self.test_framework == "go test":
                command = "go test ./..."
            
            # Rust
            elif self.test_framework == "cargo test":
                command = "cargo test"
        
        # Fallback: smart detection based on stack
        if not command:
            stack = self.job.target_stack.lower()
            print(f"🛡️ [Test Gate] No test framework specified, detecting from stack: {stack}")
            
            if "python" in stack or "django" in stack or "flask" in stack or "fastapi" in stack:
                # Check if pytest exists
                if os.path.exists(os.path.join(self.target_dir, ".venv", "bin", "pytest")):
                    command = "./.venv/bin/pytest"
                else:
                    command = "./.venv/bin/python -m unittest discover tests"
            
            elif "node" in stack or "ts" in stack or "react" in stack or "next" in stack:
                command = f"{self.package_manager or 'npm'} test"
            
            elif "go" in stack:
                command = "go test ./..."
            
            elif "rust" in stack:
                command = "cargo test"

        if not command:
            return True, "No test strategy found. Skipping."

        print(f"🛡️ [Test Gate] Executing: {command}")
        
        try:
            tool = self.tools["run_command"]
            result = await tool.execute(command)
            output = result.output + "\n" + (result.error or "")
            
            # Heuristic Success Check
            failure_indicators = [
                "FAILURES", "FAILED (", "Tests failed", "Test failed", 
                "✖", "✗", "Error:"
            ]
            
            # Filter out false positives
            if "0 failures" in output:
                pass  # Good
            
            for ind in failure_indicators:
                if ind in output and "0 failures" not in output:
                    return False, output

            return True, output

        except Exception as e:
            return False, f"Test execution failed: {e}"

