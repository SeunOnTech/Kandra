"""WebSocket endpoint for real-time job streaming."""

import asyncio
import json
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.integrations.redis_client import get_redis

router = APIRouter(tags=["websocket"])


class ConnectionManager:
    """Manages WebSocket connections per job."""
    
    def __init__(self):
        # job_id -> list of websockets
        self.active_connections: dict[str, list[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, job_id: str):
        """Accept connection and add to job's connection list."""
        await websocket.accept()
        if job_id not in self.active_connections:
            self.active_connections[job_id] = []
        self.active_connections[job_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, job_id: str):
        """Remove connection from job's list."""
        if job_id in self.active_connections:
            if websocket in self.active_connections[job_id]:
                self.active_connections[job_id].remove(websocket)
            if not self.active_connections[job_id]:
                del self.active_connections[job_id]
    
    async def broadcast(self, job_id: str, message: dict):
        """Send message to all connections for a job."""
        if job_id in self.active_connections:
            dead_connections = []
            for connection in self.active_connections[job_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    dead_connections.append(connection)
            
            # Clean up dead connections
            for conn in dead_connections:
                self.disconnect(conn, job_id)


# Singleton connection manager
manager = ConnectionManager()


@router.websocket("/api/jobs/{job_id}/stream")
async def job_stream(websocket: WebSocket, job_id: str):
    """
    WebSocket endpoint for streaming job events.
    
    Client connects and receives real-time events for a specific job.
    Uses Redis pub/sub to receive events from anywhere in the system.
    """
    listener_task = None
    
    try:
        await manager.connect(websocket, job_id)
        print(f"🔌 WebSocket connected: job={job_id}")
        
        # Send connection confirmation
        await websocket.send_json({
            "type": "connected",
            "job_id": job_id,
            "message": "Connected to job stream",
        })
        
        # === 1. History Replay ( Fix for "Blank IDE" on reconnect ) ===
        try:
            from app.db.database import async_session_context
            from app.db.models import JobEvent
            from sqlalchemy import select
            
            print(f"[WS] Replaying history for job={job_id}...")
            
            async with async_session_context() as session:
                # Fetch all events ordered by time
                result = await session.execute(
                    select(JobEvent)
                    .where(JobEvent.job_id == job_id)
                    .order_by(JobEvent.created_at.asc())
                )
                history = result.scalars().all()
                
                print(f"[WS] Found {len(history)} past events.")
                
                for event in history:
                    # Construct message matching the Redis pub/sub format used by frontend
                    msg = {
                        "type": event.event_type,
                        "job_id": str(event.job_id),
                        "payload": event.payload,
                        "timestamp": event.created_at.isoformat() if event.created_at else None
                    }
                    await websocket.send_json(msg)
                    
            print(f"[WS] History replay complete.")
            
        except Exception as e:
             print(f"[WS] History replay failed: {e}")
        
        # Create Subscribe task
        async def event_listener():
            """Listen to events (Redis or In-Memory) and forward to WebSocket."""
            # Hybrid Architecture: Switch to MemoryEventBus
            from app.integrations.event_bus import bus
            
            try:
                print(f"Starting event listener for job={job_id}")
                async for data in bus.subscribe(f"job:{job_id}"):
                    print(f"event for {job_id}: {data.get('type', 'unknown')}")
                    await manager.broadcast(job_id, data)
            except asyncio.CancelledError:
                print(f"listener cancelled for job={job_id}")
            except Exception as e:
                print(f"listener error for {job_id}: {e}")
        
        # Start listener task
        listener_task = asyncio.create_task(event_listener())
        
        # Keep connection alive and handle client messages
        while True:
            try:
                # Wait for any client message (use receive_text to be more forgiving)
                raw_data = await asyncio.wait_for(
                    websocket.receive_text(),
                    timeout=45.0  # 45 second timeout
                )
                
                try:
                    data = json.loads(raw_data)
                    # Handle client commands
                    if data.get("type") == "ping":
                        await websocket.send_json({"type": "pong"})
                except json.JSONDecodeError:
                    # Ignore malformed messages
                    pass
                    
            except asyncio.TimeoutError:
                # Send heartbeat
                try:
                    await websocket.send_json({"type": "heartbeat"})
                except Exception as e:
                    print(f"Failed to send heartbeat: {e}")
                    break
                    
    except WebSocketDisconnect:
        print(f"🔌 WebSocket disconnected: job={job_id}")
    except Exception as e:
        # Log all exceptions for debugging
        print(f"WebSocket error for {job_id}: {type(e).__name__}: {e}")
    finally:
        if listener_task:
            listener_task.cancel()
            try:
                await listener_task
            except asyncio.CancelledError:
                pass
        manager.disconnect(websocket, job_id)
        print(f"Cleaned up WebSocket for job={job_id}")
