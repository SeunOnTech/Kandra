"""In-memory event bus for local development without Redis."""

import asyncio
import json
from typing import Dict, List, Set, Any
from collections import defaultdict

class EventBus:
    """Simple in-memory pub/sub bus."""
    
    def __init__(self):
        # channel_name -> set of queues
        self.subscribers: Dict[str, Set[asyncio.Queue]] = defaultdict(set)
        self._lock = asyncio.Lock()

    async def publish(self, channel: str, message: Any):
        """Publish a message to a channel."""
        async with self._lock:
            if channel in self.subscribers:
                # message can be dict or string, normalize to dict for consistent handling
                if isinstance(message, str):
                    try:
                        message = json.loads(message)
                    except:
                        pass
                
                # Push to all subscriber queues
                for queue in self.subscribers[channel]:
                    await queue.put(message)

    async def subscribe(self, channel: str):
        """Subscribe to a channel and return a queue."""
        queue = asyncio.Queue()
        async with self._lock:
            self.subscribers[channel].add(queue)
        
        try:
            while True:
                message = await queue.get()
                yield message
        finally:
            async with self._lock:
                if queue in self.subscribers[channel]:
                    self.subscribers[channel].remove(queue)
                if not self.subscribers[channel]:
                    del self.subscribers[channel]

# Global instance
bus = EventBus()
