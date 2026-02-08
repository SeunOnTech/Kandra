import asyncio
import os
import subprocess
import signal
from typing import Any, Dict

from app.tools.base import BaseTool, ToolResult

class ShellTool(BaseTool):
    name = "run_command"
    description = "Execute a shell command with Scenario-Aware Intelligence"
    
    def __init__(self, workspace_path: str, allowed_extensions: list[str] = None):
        self.workspace_path = workspace_path
        self.allowed_extensions = allowed_extensions
        
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "command": {
                    "type": "string",
                    "description": "The shell command to execute"
                },
                "timeout": {
                    "type": "number",
                    "description": "Optional custom timeout in seconds (default: 60)"
                }
            },
            "required": ["command"]
        }
        
    async def execute(self, command: str, timeout: float = None) -> ToolResult:
        """
        Execute a shell command with 'Scenario Intelligence'.
        - Auto-bumps timeout for installation/build tasks.
        - Detects interactive prompts and kills them.
        - Detects server startup and returns 'Ready' IMMEDIATELY.
        """
        try:
            # 1. Security check
            if "../" in command:
                return ToolResult(output="", error="Permission Denied: Shell commands must stay within the target directory.")

            # 2. Dynamic Timeout Selection
            final_timeout = timeout or 60.0
            heavy_keywords = ["install", "build", "compile", "setup", "update", "migration", "pytest", "npm test"]
            if any(k in command.lower() for k in heavy_keywords):
                final_timeout = max(final_timeout, 300.0) 
                print(f"🏗️ [Shell Intelligence] 'Heavy' command: {final_timeout}s")

            # 3. Command Execution with Process Group
            # We use start_new_session=True so the shell and all its children
            # belong to the same process group, allowing us to kill the entire tree.
            process = await asyncio.create_subprocess_shell(
                command,
                cwd=self.workspace_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                start_new_session=True
            )

            stdout_chunks = []
            stderr_chunks = []
            is_ready = asyncio.Event()
            hang_reason = None

            # 4. Scenario Monitoring Loop
            async def read_stream(stream, chunks, name):
                nonlocal hang_reason
                try:
                    while True:
                        line_bytes = await stream.readline()
                        if not line_bytes:
                            break
                        line = line_bytes.decode(errors='replace').strip()
                        chunks.append(line)
                        
                        # Server Ready Detection
                        ready_patterns = [
                            "listening on port", "started successfully", "ready in", 
                            "server started", "compiled successfully", "database connected",
                            "connected to", "application started", "http://localhost"
                        ]
                        if any(p in line.lower() for p in ready_patterns):
                            print(f"✨ [Shell Intelligence] Signal detected in {name}: {line}")
                            is_ready.set()
                        
                        # Interactive Prompt Detection
                        prompt_patterns = ["(y/n)?", "[y/n]", "continue?", "password:", "enter name:", "confirm?"]
                        if any(p in line.lower() for p in prompt_patterns):
                            hang_reason = f"Command is stuck waiting for user input: '{line}'"
                            print(f"🛑 [Shell Intelligence] Interactive prompt detected.")
                            try: 
                                os.killpg(os.getpgid(process.pid), signal.SIGKILL)
                            except: pass
                            break
                except Exception:
                    pass

            # Run stream readers in parallel
            readers = asyncio.gather(
                read_stream(process.stdout, stdout_chunks, "stdout"),
                read_stream(process.stderr, stderr_chunks, "stderr")
            )

            try:
                # Wait for EITHER completion OR 'Ready' signal OR timeout
                # We use wait with return_when=FIRST_COMPLETED
                wait_ready = asyncio.create_task(is_ready.wait())
                wait_process = asyncio.create_task(process.wait())
                
                done, pending = await asyncio.wait(
                    [wait_ready, wait_process],
                    timeout=final_timeout,
                    return_when=asyncio.FIRST_COMPLETED
                )

                # Cleanup pending tasks
                for task in pending:
                    task.cancel()

                # 5. Smart Exit Decision
                # We only kill the server automatically if it's a SIMPLE start command.
                # If command contains verification (curl, &, &&, ;), we let it finish naturally.
                is_complex = any(k in command for k in ["&", "&&", ";", "|", "curl", "wget"])
                
                if is_ready.is_set() and process.returncode is None:
                    if not is_complex:
                        print(f"✅ [Shell Intelligence] Simple server is Ready. Closing process group to return control.")
                        await asyncio.sleep(1) # Grace period
                        try: 
                            os.killpg(os.getpgid(process.pid), signal.SIGKILL)
                        except: pass
                    else:
                        print(f"⌛ [Shell Intelligence] Complex command ready, waiting for completion.")
                        await process.wait()

                if not done and not is_ready.is_set():
                    # Timeout reached
                    print(f"⏰ [Shell Intelligence] Timeout reached ({final_timeout}s)")
                    try: 
                        os.killpg(os.getpgid(process.pid), signal.SIGKILL)
                    except: pass
                    hang_reason = f"Command timed out after {final_timeout}s without completion or Ready signal."

            except Exception as e:
                print(f"Error in monitor loop: {e}")
                try: process.kill()
                except: pass

            # Ensure process is dead and readers finished
            await process.wait()
            readers.cancel()

            output = "\n".join(stdout_chunks).strip()
            error_out = "\n".join(stderr_chunks).strip()

            # 5. Result Synthesis
            if hang_reason:
                return ToolResult(
                    output=output,
                    error=f"INTELLIGENCE ALERT: {hang_reason}\nADVICE: Use non-interactive flags (e.g., -y, --yes).",
                    metadata={"intelligence_fail": True}
                )

            return await self._audit_and_respond(output, error_out, process.returncode)

        except Exception as e:
            return ToolResult(output="", error=f"Shell Execution Error: {str(e)}")

    async def _audit_and_respond(self, output: str, error_out: str, returncode: int) -> ToolResult:
        """Language Lock Audit Logic."""
        MAX_CHARS = 2000
        
        # 0. Source Leak Audit
        leak_found = "../source" in (output + error_out)
        
        # If it was a forced kill due to Ready signal, returncode might be negative or -9
        # We treat -9 (SIGKILL) as Success if we didn't have a hang_reason
        if returncode != 0 and returncode != -9:
            short_error = error_out if error_out else output
            leak_warning = "\n⚠️ CRITICAL: SOURCE LEAK DETECTED. Your implementation is referencing the legacy ../source/ directory. You must REWRITE the logic in the target directory, not link to the source." if leak_found else ""
            return ToolResult(
                output=output if len(output) < MAX_CHARS else output[:1000] + "... [Truncated] ..." + output[-1000:],
                error=f"Command failed with code {returncode}: {short_error[:MAX_CHARS]}{leak_warning}",
                metadata={"exit_code": returncode, "source_leak": leak_found}
            )
        
        if leak_found:
             return ToolResult(
                output=output,
                error="⚠️ CRITICAL: SOURCE LEAK DETECTED. Your target code is importing or referencing ../source/. You must achieve 100% isolation. Fix your imports and logic.",
                metadata={"source_leak": True}
             )

        if self.allowed_extensions:
            forbidden_files = []
            meta_allow = [
                ".json", ".md", ".yml", ".yaml", ".txt", ".gitignore", ".env", 
                ".lock", "license", ".editorconfig", "tsconfig.json", "package.json",
                "jest.config.js", "next.config.js", "tailwind.config.js", "postcss.config.js",
                "vite.config.js", "babel.config.js", "webpack.config.js",
                "pom.xml", "web.xml", "build.gradle", "settings.gradle", "mvnw", "gradlew",
                "composer.json", "composer.lock", "gemfile", "gemfile.lock", 
                "cargo.toml", "cargo.lock", "go.mod", "go.sum", "dockerfile", "docker-compose.yml"
            ]
            ignore_dirs = [
                "node_modules", ".git", "__pycache__", ".venv", "dist", "build", 
                "coverage", ".next", ".turbo", "out", ".jest_cache", ".pytest_cache",
                "target", "vendor", ".gradle"
            ]
            
            for root, dirs, files in os.walk(self.workspace_path):
                if any(id_dir in root.split(os.sep) for id_dir in ignore_dirs):
                    continue
                for f in files:
                    ext = os.path.splitext(f)[1].lower()
                    is_code = ext in [".js", ".jsx", ".ts", ".tsx", ".py", ".go", ".rs", ".c", ".cpp", ".java"]
                    is_config = f.endswith(".config.js") or f.endswith(".config.cjs") or f.endswith(".config.mjs")
                    if is_code and not is_config and ext not in self.allowed_extensions and ext not in meta_allow and f.lower() not in meta_allow:
                        forbidden_files.append(f)
            
            if forbidden_files:
                # Downgrade to non-blocking warning
                warning_msg = f"⚠️ [Language Lock] Found files outside target stack: {', '.join(forbidden_files)}. Expected: {', '.join(self.allowed_extensions)}."
                print(warning_msg)
                return ToolResult(
                    output=output,
                    metadata={"lock_warning": True, "files": forbidden_files, "exit_code": returncode if returncode else 0}
                )
            
        return ToolResult(output=output if output else "Success", metadata={"exit_code": returncode if returncode else 0})
