import os
from typing import Any, Dict, List
from app.tools.base import BaseTool, ToolResult

class ListDirTool(BaseTool):
    name = "list_dir"
    description = "List files and directories in the workspace (recursive up to depth)"
    
    def __init__(self, workspace_path: str):
        self.workspace_path = workspace_path
        
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Relative path to list (default: .)"},
                "max_depth": {"type": "integer", "description": "Max recursion depth (default: 2)"}
            }
        }
        
    async def execute(self, path: str = ".", max_depth: int = 2) -> ToolResult:
        try:
            full_path = os.path.join(self.workspace_path, path)
            if not os.path.exists(full_path):
                return ToolResult(output="", error=f"Path not found: {path}")
                
            tasks = []
            
            # Simple tree-like walker
            output = []
            
            for root, dirs, files in os.walk(full_path):
                # Calculate depth
                rel_root = os.path.relpath(root, full_path)
                depth = rel_root.count(os.sep)
                if rel_root == ".": depth = 0
                
                if depth > max_depth:
                    # Don't recurse deeper (os.walk doesn't support this natively easily without manual prune)
                    dirs[:] = [] 
                    continue
                    
                indent = "  " * depth
                folder_name = os.path.basename(root) if rel_root != "." else path
                output.append(f"{indent}{folder_name}/")
                
                for f in files:
                    if f.startswith('.'): continue # Skip hidden files
                    output.append(f"{indent}  {f}")
                    
            return ToolResult(output="\n".join(output))
            
        except Exception as e:
            return ToolResult(output="", error=str(e))


class ReadFileTool(BaseTool):
    name = "read_file"
    description = "Read the contents of a file"
    
    def __init__(self, workspace_path: str):
        self.workspace_path = workspace_path
        
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Relative path to file"}
            },
            "required": ["path"]
        }
        
    async def execute(self, path: str) -> ToolResult:
        try:
            full_path = os.path.join(self.workspace_path, path)
            if not os.path.exists(full_path):
                return ToolResult(output="", error=f"File not found: {path}")
                
            # Limit read size
            MAX_SIZE = 50_000 # 50KB limit
            if os.path.getsize(full_path) > MAX_SIZE:
                return ToolResult(output="", error=f"File too large to read ({os.path.getsize(full_path)} bytes)")
                
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            return ToolResult(output=content)
            
        except UnicodeDecodeError:
             return ToolResult(output="", error="File is not text (binary)")
        except Exception as e:
            return ToolResult(output="", error=str(e))


class WriteFileTool(BaseTool):
    name = "write_file"
    description = "Write content to a file (overwrites existing)"
    
    def __init__(self, workspace_path: str, allowed_extensions: list[str] = None):
        self.workspace_path = workspace_path
        self.allowed_extensions = allowed_extensions
        
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Relative path to file"},
                "content": {"type": "string", "description": "New file content"}
            },
            "required": ["path", "content"]
        }
        
    async def execute(self, path: str, content: str) -> ToolResult:
        try:
            # 1. Extension Check (Language Lock - RELAXED)
            if self.allowed_extensions:
                ext = os.path.splitext(path)[1].lower()
                common_langs = [
                    ".js", ".jsx", ".ts", ".tsx", ".py", ".go", ".rs", ".c", ".cpp", ".java", 
                    ".kt", ".rb", ".php", ".cs", ".swift", ".m", ".h", ".sh", ".sql"
                ]
                meta_allow = [
                    ".json", ".md", ".yml", ".yaml", ".txt", ".gitignore", ".env", 
                    ".lock", "license", ".editorconfig", "tsconfig.json", "package.json", "pom.xml", "web.xml"
                ]

                # If it's a known language but not in the strict 'target' stack, we allow it but log a warning
                if ext in common_langs and ext not in self.allowed_extensions:
                    print(f"⚠️ [Language Lock] Information: Writing legacy or auxiliary '{ext}' file. Target stack expects '{self.allowed_extensions}'.")
                
                # Only block truly weird/potentially dangerous files if you want, 
                # but for this engine, we should be permissive.
                # Just keeping the isolation check below but removing the 'CRITICAL' return here.

            # 2. Reference Check (Source Isolation)
            if "../source" in content:
                return ToolResult(
                    output="",
                    error="⚠️ PERMISSION DENIED: Source Leak! You are attempting to include a reference to '../source/' in your code or config. The target must be 100% isolated and self-contained. Rewrite the logic locally in the target directory."
                )

            full_path = os.path.abspath(os.path.join(self.workspace_path, path))
            
            # Security: Prevent writing outside of workspace or into ../source
            # Note: self.workspace_path is .../target/
            if not full_path.startswith(os.path.abspath(self.workspace_path)):
                return ToolResult(output="", error="Permission Denied: Can only write into the target directory.")
            
            # Ensure dirs exist
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
            return ToolResult(output=f"Successfully wrote {len(content)} bytes to {path}")
            
        except Exception as e:
            return ToolResult(output="", error=str(e))
