"""Health check endpoint."""

from fastapi import APIRouter

from app.integrations.redis_client import get_redis

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """Basic health check."""
    # Test Redis connection
    redis_status = "unknown"
    try:
        redis_client = await get_redis()
        await redis_client.ping()
        redis_status = "connected"
    except Exception as e:
        redis_status = f"error: {str(e)}"
    
    return {
        "status": "ok",
        "service": "kandra-v2",
        "version": "2.0.0",
        "redis": redis_status,
    }

