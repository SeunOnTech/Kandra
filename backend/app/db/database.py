"""SQLite database setup with async support."""

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Async engine for SQLite
DATABASE_URL = "sqlite+aiosqlite:///./kandra.db"

async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set True for SQL logging
)

AsyncSessionLocal = sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()


async def get_session():
    """Dependency for getting async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


from contextlib import asynccontextmanager

@asynccontextmanager
async def async_session_context():
    """Async context manager for getting database session in background tasks."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


# Alias for backward compatibility
get_db = get_session


async def init_db():
    """Create all tables."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
