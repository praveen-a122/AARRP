from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func, Sequence, text, Text
from sqlalchemy.orm import relationship
from app.database.base import Base

participant_seq = Sequence('participant_id_seq', start=1, increment=1)

class Participant(Base):
    __tablename__ = "participants"
    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(String(64), unique=True, index=True, nullable=True) # e.g. P000024
    name = Column(String(128), nullable=True)
    participant_code = Column(String(10), unique=True, index=True, server_default=text("'P' || lpad(nextval('participant_id_seq')::text, 6, '0')"))
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="RESTRICT"))
    condition_id = Column(Integer, ForeignKey("conditions.id", ondelete="RESTRICT"))
    demographics = Column(Text, nullable=True)  # JSON string: {name, age, gender, branch, region, language}
    status = Column(String, nullable=False, default="enrolled")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    sessions = relationship("Session", back_populates="participant")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(Integer, ForeignKey("participants.id", ondelete="CASCADE"))
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="RESTRICT"), index=True)
    ip_address = Column(String, nullable=True)
    browser = Column(String, nullable=True)
    device_type = Column(String, nullable=True)
    status = Column(String, nullable=False, default="in_progress")
    is_completed = Column(Boolean, default=False)
    duration_ms = Column(Integer, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    last_activity_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    participant = relationship("Participant", back_populates="sessions")