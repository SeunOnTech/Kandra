"""Redis client for pub/sub and caching."""

import json
from typing import Optional, Any, Dict

import redis.asyncio as redis

from app.config import settings

# Global Redis client
_redis_client: Optional[redis.Redis] = None

class MockRedis:
    """Simple in-memory mock for Redis for local dev without Redis."""
    def __init__(self):
        self.data = {}
        
    async def get(self, key):
        return self.data.get(key)
        
    async def setex(self, key, time, value):
        self.data[key] = value
        # we ignore TTL for now as it's local dev
        
    async def delete(self, key):
        if key in self.data:
            del self.data[key]
            
    async def set(self, key, value):
        self.data[key] = value

    async def ping(self):
        return True

_mock_client = MockRedis()

from app.integrations.event_bus import bus

async def get_redis() -> Any:
    """Get or create Redis connection or return mock."""
    global _redis_client
    
    if not settings.use_redis:
        return _mock_client

    if _redis_client is None:
        _redis_client = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
    
    return _redis_client


async def close_redis():
    """Close Redis connection."""
    global _redis_client
    
    if _redis_client is not None:
        await _redis_client.close()
        _redis_client = None


async def publish_event(channel: str, event: dict):
    """Publish event to Redis channel or internal bus."""
    # Always publish to internal bus for local consistency
    await bus.publish(channel, event)
    
    # Optionally publish to Redis
    if settings.use_redis:
        try:
            client = await get_redis()
            if client:
                await client.publish(channel, json.dumps(event))
        except Exception as e:
            print(f"⚠️ Redis publish failure: {e}")


async def subscribe_channel(channel: str):
    """Subscribe to channel and yield messages (Redis or internal)."""
    if settings.use_redis:
        try:
            client = await get_redis()
            pubsub = client.pubsub()
            await pubsub.subscribe(channel)
            
            async for message in pubsub.listen():
                if message["type"] == "message":
                    yield json.loads(message["data"])
        except Exception as e:
            print(f"⚠️ Redis subscribe failure: {e}. Falling back to internal bus.")
            async for message in bus.subscribe(channel):
                yield message
    else:
        # Direct internal bus usage
        async for message in bus.subscribe(channel):
            yield message
