"""Clone service - handles repository cloning with smart caching."""

import os
import shutil
import subprocess
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from app.config import settings


class CloneService:
    """Handles repository cloning to local workspace."""
    
    def __init__(self):
        self.base_path = Path(settings.workspace_base_path).resolve()
        self.base_path.mkdir(parents=True, exist_ok=True)
    
    def get_workspace_path(self, repo_name: str, session_id: str = None) -> Path:
        """Get a unique workspace path for a repository session."""
        # Sanitize repo name
        safe_name = repo_name.replace("/", "_").replace("\\", "_")
        # Always generate a unique ID for each session
        unique_id = session_id or uuid.uuid4().hex[:8]
        return self.base_path / f"{safe_name}_{unique_id}"
    
    def is_recently_cloned(self, workspace_path: Path, max_age_hours: int = 1) -> bool:
        """Check if workspace was cloned recently (within max_age_hours)."""
        if not workspace_path.exists():
            return False
        
        # Check modification time of .git folder
        git_path = workspace_path / ".git"
        if not git_path.exists():
            return False
        
        mtime = datetime.fromtimestamp(git_path.stat().st_mtime)
        age = datetime.now() - mtime
        return age < timedelta(hours=max_age_hours)
    
    async def clone(
        self,
        clone_url: str,
        repo_name: str,
        force: bool = False,
    ) -> dict:
        """
        Clone a repository to the workspace using the standardized layout.
        
        Returns:
            {
                "workspace_path": str,  # Root project path
                "source_path": str,     # path to legacy code
                "target_path": str,     # path for new code
                "cloned": bool,
                "message": str
            }
        """
        workspace_path = self.get_workspace_path(repo_name)
        source_path = workspace_path / "source"
        target_path = workspace_path / "target"
        metadata_path = workspace_path / ".kandra"
        reports_path = workspace_path / "reports"
        
        # Ensure all sub-folders exist
        for p in [source_path, target_path, metadata_path, reports_path]:
            p.mkdir(parents=True, exist_ok=True)
        
        # Clone the repository into source/
        try:
            # Use shallow clone for speed
            result = subprocess.run(
                [
                    "git", "clone",
                    "--depth", "1",
                    "--single-branch",
                    clone_url,
                    ".", # Clone into current dir (which is source_path)
                ],
                cwd=str(source_path),
                capture_output=True,
                text=True,
                timeout=120,
            )
            
            if result.returncode != 0:
                raise Exception(f"Git clone failed: {result.stderr}")
            
            return {
                "workspace_path": str(workspace_path),
                "source_path": str(source_path),
                "target_path": str(target_path),
                "cloned": True,
                "message": f"Cloned {clone_url} to {source_path}",
            }
            
        except subprocess.TimeoutExpired:
            raise Exception("Clone timeout - repository too large or network issue")
        except Exception as e:
            # Cleanup on failure
            if workspace_path.exists():
                shutil.rmtree(workspace_path)
            raise Exception(f"Clone failed: {str(e)}")
    
    def cleanup(self, repo_name: str) -> bool:
        """Remove a workspace."""
        workspace_path = self.get_workspace_path(repo_name)
        if workspace_path.exists():
            shutil.rmtree(workspace_path)
            return True
        return False


# Singleton instance
clone_service = CloneService()
