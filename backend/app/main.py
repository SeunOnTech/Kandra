"""FastAPI application entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.database import init_db
from app.integrations.redis_client import close_redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Startup
    print(f"🚀 Kandra V2 starting in {settings.app_env} mode")
    await init_db()
    print("✅ Database initialized")
    yield
    # Shutdown
    await close_redis()
    print("👋 Kandra V2 shutting down")


app = FastAPI(
    title="Kandra V2",
    description="Autonomous Code Migration Orchestrator",
    version="2.0.0",
    debug=settings.debug,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and register routers
from app.api import health, github, analyze, jobs, ws
app.include_router(health.router)
app.include_router(github.router)
app.include_router(analyze.router)
app.include_router(jobs.router)
app.include_router(ws.router)
