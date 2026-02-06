import asyncio
import os
import subprocess
from typing import Any, Dict

from app.tools.base import BaseTool, ToolResult

class ShellTool(BaseTool):
    name = "run_command"
    description = "Execute a shell command in the workspace"
    
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
                }
            },
            "required": ["command"]
        }
        
    async def execute(self, command: str) -> ToolResult:
        try:
            # 1. Security check: prevent jumping out of target directory
            if "../" in command:
                return ToolResult(output="", error="Permission Denied: Shell commands must stay within the target directory. Do not use '../' in commands.")
            
            # 2. Command Execution
            process = await asyncio.create_subprocess_shell(
                command,
                cwd=self.workspace_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            try:
                stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=30.0)
            except asyncio.TimeoutError:
                try:
                    process.kill()
                    await process.wait()
                except:
                    pass
                return ToolResult(
                    output="",
                    error="Command timed out after 30 seconds. Do NOT run long-running servers or interactive commands.",
                    metadata={"timeout": True}
                )
            
            output = stdout.decode().strip()
            error_out = stderr.decode().strip()
            
            # 3. Output Truncation
            MAX_CHARS = 2000
            if len(output) > MAX_CHARS:
                output = output[:1000] + f"\n... [Truncated {len(output) - MAX_CHARS} chars] ...\n" + output[-1000:]
                
            if process.returncode != 0:
                short_error = error_out if error_out else output
                if len(short_error) > MAX_CHARS:
                    short_error = short_error[:1000] + "\n... [Truncated] ..\n" + short_error[-1000:]
                return ToolResult(
                    output=output,
                    error=f"Command failed with code {process.returncode}: {short_error}",
                    metadata={"exit_code": process.returncode}
                )

            # 4. Language Lock Audit (Post-Execution)
            if self.allowed_extensions:
                forbidden_files = []
                # Always allow configuration, meta, and documentation files
                meta_allow = [
                    ".json", ".md", ".yml", ".yaml", ".txt", ".gitignore", ".env", 
                    ".lock", "license", ".editorconfig", "tsconfig.json", "package.json"
                ]
                
                for root, dirs, files in os.walk(self.workspace_path):
                    if "node_modules" in root or ".git" in root or "__pycache__" in root:
                        continue
                    for f in files:
                        ext = os.path.splitext(f)[1].lower()
                        # If it's a code-like extension that isn't in our whitelist, it's pollution
                        is_code = ext in [".js", ".jsx", ".ts", ".tsx", ".py", ".go", ".rs", ".c", ".cpp", ".java"]
                        if is_code and ext not in self.allowed_extensions and ext not in meta_allow:
                            forbidden_files.append(f)
                
                if forbidden_files:
                    return ToolResult(
                        output=output,
                        error=f"CRITICAL: Language Lock Violation! Command created incompatible files: {', '.join(forbidden_files)}. Expected extensions: {', '.join(self.allowed_extensions)}. You MUST use flags or rename them immediately.",
                        metadata={"lock_violation": True, "files": forbidden_files}
                    )
                
            return ToolResult(
                output=output if output else "Command executed successfully (no output)",
                metadata={"exit_code": 0}
            )
            
        except Exception as e:
            return ToolResult(output="", error=str(e))
