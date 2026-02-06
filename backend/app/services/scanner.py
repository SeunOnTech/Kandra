"""File scanner - scans workspace and builds file context for analysis."""

import os
from pathlib import Path
from typing import Optional

from app.config import settings


# File extensions to include in analysis
CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx", ".vue", ".svelte",
    ".go", ".rs", ".java", ".kt", ".scala", ".rb", ".php",
    ".c", ".cpp", ".h", ".hpp", ".cs", ".swift", ".m",
    ".sh", ".bash", ".zsh", ".fish",
}

CONFIG_FILES = {
    "package.json", "tsconfig.json", "pyproject.toml", "Cargo.toml",
    "go.mod", "requirements.txt", "Gemfile", "pom.xml", "build.gradle",
    ".env.example", "docker-compose.yml", "Dockerfile", "Makefile",
    "next.config.js", "next.config.ts", "vite.config.ts", "webpack.config.js",
}

SKIP_DIRS = {
    "node_modules", ".git", "__pycache__", ".next", "dist", "build",
    "target", "vendor", ".venv", "venv", ".tox", ".mypy_cache",
    ".pytest_cache", "coverage", ".nyc_output", ".cache",
}


class Scanner:
    """Scans workspace and extracts file content for analysis."""
    
    def __init__(self, max_files: int = None, max_chars_per_file: int = None):
        self.max_files = max_files or settings.context_max_files
        self.max_chars_per_file = max_chars_per_file or settings.context_max_chars_per_file
    
    def scan(self, workspace_path: str) -> dict:
        """
        Scan workspace and return structured data for analysis.
        
        Returns:
            {
                "tree": str,  # Directory tree structure
                "files": [
                    {"path": str, "content": str, "language": str}
                ],
                "stats": {
                    "total_files": int,
                    "included_files": int,
                    "languages": {lang: count}
                }
            }
        """
        workspace = Path(workspace_path)
        if not workspace.exists():
            raise FileNotFoundError(f"Workspace not found: {workspace_path}")
        
        # Build tree structure
        tree_lines = []
        files = []
        language_counts = {}
        total_files = 0
        
        for root, dirs, filenames in os.walk(workspace):
            # Skip excluded directories
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            
            rel_root = Path(root).relative_to(workspace)
            depth = len(rel_root.parts)
            indent = "  " * depth
            
            if depth > 0:
                tree_lines.append(f"{indent}{rel_root.name}/")
            
            for filename in sorted(filenames):
                total_files += 1
                file_path = Path(root) / filename
                rel_path = file_path.relative_to(workspace)
                ext = file_path.suffix.lower()
                
                tree_lines.append(f"{indent}  {filename}")
                
                # Check if we should include content
                is_config = filename in CONFIG_FILES
                is_code = ext in CODE_EXTENSIONS
                
                if (is_config or is_code) and len(files) < self.max_files:
                    try:
                        content = file_path.read_text(errors="ignore")
                        # Truncate if too long
                        if len(content) > self.max_chars_per_file:
                            content = content[:self.max_chars_per_file] + "\n... (truncated)"
                        
                        # Detect language
                        language = self._detect_language(filename, ext)
                        language_counts[language] = language_counts.get(language, 0) + 1
                        
                        files.append({
                            "path": str(rel_path),
                            "content": content,
                            "language": language,
                        })
                    except Exception:
                        pass  # Skip unreadable files
        
        return {
            "tree": "\n".join(tree_lines[:100]),  # Limit tree size
            "files": files,
            "stats": {
                "total_files": total_files,
                "included_files": len(files),
                "languages": language_counts,
            },
        }
    
    def _detect_language(self, filename: str, ext: str) -> str:
        """Detect programming language from filename/extension."""
        lang_map = {
            ".py": "Python",
            ".js": "JavaScript",
            ".ts": "TypeScript",
            ".jsx": "React",
            ".tsx": "React TypeScript",
            ".vue": "Vue",
            ".go": "Go",
            ".rs": "Rust",
            ".java": "Java",
            ".kt": "Kotlin",
            ".rb": "Ruby",
            ".php": "PHP",
            ".swift": "Swift",
            ".c": "C",
            ".cpp": "C++",
            ".cs": "C#",
        }
        
        # Check special files first
        if filename == "package.json":
            return "JavaScript/Node.js"
        if filename == "pyproject.toml" or filename == "requirements.txt":
            return "Python"
        if filename == "Cargo.toml":
            return "Rust"
        if filename == "go.mod":
            return "Go"
        
        return lang_map.get(ext, "Unknown")


# Singleton instance
scanner = Scanner()
