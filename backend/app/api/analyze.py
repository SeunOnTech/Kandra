"""Analysis endpoint - clones, scans, and analyzes repository."""

import traceback
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.services.clone import clone_service
from app.services.scanner import scanner
from app.agents.analyzer import analyze_codebase

router = APIRouter(prefix="/api", tags=["analysis"])


class AnalyzeRequest(BaseModel):
    """Request body for analyze endpoint."""
    clone_url: str
    repo_name: str


class MigrationPath(BaseModel):
    """Migration path option."""
    id: str
    title: str
    description: str
    recommended: bool


class AnalyzeResponse(BaseModel):
    """Response from analyze endpoint."""
    detected_stack: str
    complexity_score: int
    complexity_reason: str
    insight_title: str
    insight_detail: str
    migration_paths: list[MigrationPath]
    file_tree: Optional[str] = None
    workspace_path: str
    cloned: bool


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_repository(body: AnalyzeRequest):
    """
    Clone and analyze a repository.
    
    Returns migration recommendations based on codebase analysis.
    """
    print(f"Analyze request: clone_url={body.clone_url}, repo_name={body.repo_name}")
    
    try:
        # Step 1: Clone (or use cache)
        print("Step 1: Cloning...")
        clone_result = await clone_service.clone(
            clone_url=body.clone_url,
            repo_name=body.repo_name,
        )
        print(f"Cloned: {clone_result}")
        
        # Step 2: Scan files
        print("Step 2: Scanning files...")
        scan_result = scanner.scan(clone_result["source_path"])
        print(f"Scanned: {scan_result['stats']}")
        
        if not scan_result["files"]:
            raise HTTPException(
                status_code=400,
                detail="No analyzable files found in repository"
            )
        
        # Step 3: Analyze with Gemini
        print("Step 3: Analyzing with Gemini...")
        analysis = await analyze_codebase(
            tree=scan_result["tree"],
            files=scan_result["files"],
            repo_name=body.repo_name,
        )
        print(f"Analysis complete: {analysis.get('detected_stack')}")
        
        # Build response
        return AnalyzeResponse(
            detected_stack=analysis.get("detected_stack", "Unknown"),
            complexity_score=analysis.get("complexity_score", 50),
            complexity_reason=analysis.get("complexity_reason", ""),
            insight_title=analysis.get("insight_title", "Analysis Complete"),
            insight_detail=analysis.get("insight_detail", ""),
            migration_paths=[
                MigrationPath(**path) for path in analysis.get("migration_paths", [])
            ],
            file_tree=analysis.get("file_tree"),
            workspace_path=clone_result["workspace_path"],
            cloned=clone_result["cloned"],
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

