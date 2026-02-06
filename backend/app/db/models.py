"""SQLAlchemy models for jobs and events."""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Text, Integer
from sqlalchemy.orm import relationship

from app.db.database import Base


def generate_uuid() -> str:
    """Generate a short UUID."""
    return str(uuid.uuid4())[:8]


class Job(Base):
    """Migration job."""
    
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    status = Column(String, default="CREATED")  # CREATED, ANALYZING, PLANNING, AWAITING_APPROVAL, EXECUTING, VERIFYING, COMPLETED, FAILED
    
    # Repository info
    repo_url = Column(String, nullable=False)
    repo_name = Column(String)
    target_stack = Column(String)
    
    # Workspace
    workspace_path = Column(String)
    
    # Plan (stored after planning phase)
    plan = Column(Text)
    
    # Analysis result (JSON)
    analysis = Column(JSON)
    
    # Error info if failed
    error = Column(Text)
    
    # Execution tracking
    current_iteration = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    events = relationship("JobEvent", back_populates="job", cascade="all, delete-orphan")


class JobEvent(Base):
    """Immutable event log for a job (event sourcing)."""
    
    __tablename__ = "job_events"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    
    # Event type: job_created, file_found, file_created, plan_chunk, command_output, etc.
    event_type = Column(String, nullable=False)
    
    # Event payload (JSON)
    payload = Column(JSON, default=dict)
    
    # Is this a checkpoint we can resume from?
    is_checkpoint = Column(Integer, default=0)  # SQLite doesn't have boolean
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="events")
