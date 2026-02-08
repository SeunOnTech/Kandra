"""GitHub OAuth and repository endpoints.

Clean implementation with Redis session storage and proper error handling.
"""

import secrets
from typing import Optional
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel

from app.config import settings
from app.integrations.redis_client import get_redis

router = APIRouter(prefix="/api/github", tags=["github"])

# Constants
GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_API_URL = "https://api.github.com"
GITHUB_TIMEOUT = 30.0


# === Pydantic Models ===

class AuthUrlResponse(BaseModel):
    auth_url: str
    state: str


class CallbackRequest(BaseModel):
    code: str
    state: str


class UserInfo(BaseModel):
    login: str
    avatar_url: Optional[str] = None
    name: Optional[str] = None


class StatusResponse(BaseModel):
    connected: bool
    user: Optional[UserInfo] = None


class RepoInfo(BaseModel):
    id: int
    name: str
    full_name: str
    description: Optional[str] = None
    html_url: str
    clone_url: str
    language: Optional[str] = None
    stargazers_count: int = 0
    updated_at: str
    private: bool = False


class ReposResponse(BaseModel):
    repos: list[RepoInfo]
    total_count: int


# === Helper Functions ===

def _get_session_key(session_id: str) -> str:
    """Generate Redis key for session."""
    return f"session:{session_id}"


async def _get_session(request: Request) -> dict:
    """Get session data from Redis."""
    session_id = request.cookies.get("session_id")
    if not session_id:
        return {}
    
    redis = await get_redis()
    data = await redis.get(_get_session_key(session_id))
    
    if data:
        import json
        return json.loads(data)
    return {}


async def _set_session(response: Response, data: dict) -> str:
    """Store session data in Redis and set cookie."""
    import json
    
    # Generate or reuse session ID
    session_id = secrets.token_urlsafe(32)
    
    redis = await get_redis()
    await redis.setex(
        _get_session_key(session_id),
        3600 * 24,  # 24 hour TTL
        json.dumps(data)
    )
    
    # Dynamic cookie security
    is_https = str(settings.backend_url).startswith("https")
    
    # Set cookie
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=is_https,  # Only secure if using HTTPS
        samesite="none" if is_https else "lax", # None required for cross-domain HTTPS
        max_age=3600 * 24,
    )
    
    return session_id


async def _clear_session(request: Request, response: Response):
    """Clear session from Redis and cookie."""
    session_id = request.cookies.get("session_id")
    if session_id:
        redis = await get_redis()
        await redis.delete(_get_session_key(session_id))
    
    response.delete_cookie("session_id")


# === Endpoints ===

@router.get("/authorize", response_model=AuthUrlResponse)
async def get_auth_url(response: Response):
    """Generate GitHub OAuth authorization URL."""
    if not settings.github_client_id:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    
    # Store state in temporary Redis key (5 min TTL)
    redis = await get_redis()
    await redis.setex(f"oauth_state:{state}", 300, "valid")
    
    # Build authorization URL
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": f"{settings.frontend_url}/auth/github/callback",
        "scope": "repo read:user",
        "state": state,
    }
    
    auth_url = f"{GITHUB_AUTHORIZE_URL}?{urlencode(params)}"
    
    return AuthUrlResponse(auth_url=auth_url, state=state)


@router.post("/callback")
async def handle_callback(body: CallbackRequest, response: Response):
    """Exchange OAuth code for access token and create session."""
    # Verify state
    redis = await get_redis()
    state_valid = await redis.get(f"oauth_state:{body.state}")
    
    if not state_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired state")
    
    # Delete used state
    await redis.delete(f"oauth_state:{body.state}")
    
    # Exchange code for token
    async with httpx.AsyncClient(timeout=GITHUB_TIMEOUT) as client:
        token_response = await client.post(
            GITHUB_TOKEN_URL,
            data={
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code": body.code,
                "redirect_uri": f"{settings.frontend_url}/auth/github/callback",
            },
            headers={"Accept": "application/json"},
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange code")
        
        token_data = token_response.json()
        
        if "error" in token_data:
            raise HTTPException(status_code=400, detail=token_data.get("error_description", "OAuth error"))
        
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token received")
        
        # Fetch user info
        user_response = await client.get(
            f"{GITHUB_API_URL}/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
            },
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user info")
        
        user_data = user_response.json()
    
    # Store in session
    session_data = {
        "github_token": access_token,
        "user": {
            "login": user_data.get("login"),
            "avatar_url": user_data.get("avatar_url"),
            "name": user_data.get("name"),
        },
    }
    
    await _set_session(response, session_data)
    
    return {"success": True, "user": session_data["user"]}


@router.get("/status", response_model=StatusResponse)
async def get_status(request: Request):
    """Check GitHub connection status."""
    session = await _get_session(request)
    
    if not session.get("github_token"):
        return StatusResponse(connected=False)
    
    user_data = session.get("user", {})
    return StatusResponse(
        connected=True,
        user=UserInfo(
            login=user_data.get("login", ""),
            avatar_url=user_data.get("avatar_url"),
            name=user_data.get("name"),
        ),
    )


@router.get("/repos", response_model=ReposResponse)
async def get_repos(
    request: Request,
    page: int = 1,
    per_page: int = 30,
    sort: str = "updated",
    search: Optional[str] = None,
):
    """List user's GitHub repositories."""
    session = await _get_session(request)
    access_token = session.get("github_token")
    
    if not access_token:
        raise HTTPException(status_code=401, detail="Not connected to GitHub")
    
    async with httpx.AsyncClient(timeout=GITHUB_TIMEOUT) as client:
        repos_response = await client.get(
            f"{GITHUB_API_URL}/user/repos",
            params={
                "page": page,
                "per_page": per_page,
                "sort": sort,
                "direction": "desc",
                "affiliation": "owner,collaborator",
            },
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
            },
        )
        
        if repos_response.status_code != 200:
            print(f"❌ GitHub API Error: {repos_response.status_code} - {repos_response.text}")
            raise HTTPException(status_code=repos_response.status_code, detail="Failed to fetch repos")
        
        repos_data = repos_response.json()
        print(f"DEBUG: Found {len(repos_data)} repos for user")
    
    # Transform and optionally filter
    repos = []
    for repo in repos_data:
        # Apply search filter
        if search:
            search_lower = search.lower()
            name_match = search_lower in repo.get("name", "").lower()
            desc_match = search_lower in (repo.get("description") or "").lower()
            if not (name_match or desc_match):
                continue
        
        repos.append(RepoInfo(
            id=repo["id"],
            name=repo["name"],
            full_name=repo["full_name"],
            description=repo.get("description"),
            html_url=repo["html_url"],
            clone_url=repo["clone_url"],
            language=repo.get("language"),
            stargazers_count=repo.get("stargazers_count", 0),
            updated_at=repo["updated_at"],
            private=repo.get("private", False),
        ))
    
    return ReposResponse(repos=repos, total_count=len(repos))


@router.post("/disconnect")
async def disconnect(request: Request, response: Response):
    """Disconnect GitHub and clear session."""
    await _clear_session(request, response)
    return {"success": True}
