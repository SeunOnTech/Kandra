"""Analyzer Agent - Analyzes codebase and generates stack migration recommendations."""

from typing import Optional, List, Dict
from pydantic import BaseModel

from app.integrations.gemini import generate


# === Response Schema ===

class MigrationPath(BaseModel):
    """A stack migration option."""
    id: str
    title: str
    description: str
    recommended: bool


class AnalysisResult(BaseModel):
    """Result of codebase analysis."""
    detected_stack: str
    complexity_score: int  # 0-100
    complexity_reason: str
    insight_title: str
    insight_detail: str
    file_tree: Optional[str] = None
    migration_paths: list[MigrationPath]


# === System Prompt ===

ANALYZER_SYSTEM_PROMPT = """You're an expert in legacy code modernization. Your job is to recommend STACK MIGRATIONS - full technology transformations, not small fixes.

IMPORTANT: Kandra is an autonomous migration agent. It will:
1. Analyze the entire codebase
2. Let the user pick a TARGET STACK
3. Autonomously rewrite all the code to that new stack

Your migration_paths should be FULL STACK TRANSFORMATIONS. Examples:

Same-language upgrades:
- "Node.js HTTP → Fastify + TypeScript"
- "Express.js → Hono"
- "CommonJS → ES Modules"
- "Django → FastAPI"

Cross-language migrations:
- "JavaScript/Node.js → Python FastAPI"
- "Python Flask → Go Fiber"
- "PHP → Node.js Express"
- "Ruby on Rails → Python Django"

NOT small fixes like "add caching" or "use Promise.all" - those are implementation details handled automatically.

Be creative based on what you see. Recommend what makes technical sense for their codebase.
Keep your tone conversational and direct."""


# === Analyzer Function ===

async def analyze_codebase(
    tree: str,
    files: list[dict],
    repo_name: str,
) -> dict:
    """
    Analyze a codebase and generate stack migration recommendations.
    
    Args:
        tree: Directory tree structure
        files: List of {path, content, language} dicts
        repo_name: Name of the repository
    
    Returns:
        AnalysisResult as dict
    """
    # Build file context
    file_context = "\n\n".join([
        f"=== {f['path']} ({f['language']}) ===\n{f['content']}"
        for f in files[:40]
    ])
    
    # Build prompt
    prompt = f"""Analyze this legacy codebase: {repo_name}

## Files
```
{tree}
```

## Code
{file_context}

## Your Task
Analyze the logic deeply. 
- Identify ALL core business logic files (models, controllers, math, utility logic).
- Do NOT just look at the server. 
- In your `insight_detail`, explain exactly which files hold the "brain" of the application and MUST be migrated with 100% logic parity.

Return JSON with:

- detected_stack: Current tech stack (e.g., "Node.js with raw HTTP server", "Express.js + MongoDB")
- complexity_score: 0-100 (how hard to migrate)
- complexity_reason: One sentence why
- insight_title: The biggest modernization opportunity (catchy, specific)
- insight_detail: 2-3 sentences. Identify specific files (e.g. portfolio.js) that contain critical logic.
- migration_paths: 2-4 STACK MIGRATION options (not micro-fixes). Each needs:
  - id: lowercase_snake_case (e.g., "fastify_typescript", "express_modern", "bun_runtime")
  - title: Target stack name (e.g., "Fastify + TypeScript", "Express Modernization", "Bun Runtime")
  - description: What this migration transforms and why it's worth it. ~2-3 sentences.
  - recommended: true for the best option only

Remember: These are FULL STACK MIGRATIONS that Kandra will execute autonomously. Not quick fixes."""
    
    # Generate analysis with structured output
    analysis = await generate(
        prompt=prompt,
        response_schema=AnalysisResult,
        system_instruction=ANALYZER_SYSTEM_PROMPT,
    )
    
    # Ensure tree is included for the planner
    if isinstance(analysis, dict):
        analysis["file_tree"] = tree
    
    return analysis

