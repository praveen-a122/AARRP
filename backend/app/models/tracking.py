from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func, Float, Text
from sqlalchemy.orm import relationship
from app.database.base import Base
import json

class ReadingEvent(Base):
    __tablename__ = "reading_events"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id", ondelete="CASCADE"), index=True)
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="CASCADE"), index=True)
    paragraph_id = Column(Integer, ForeignKey("paragraphs.id", ondelete="CASCADE"), index=True)
    slide_number = Column(Integer, nullable=False)
    section_number = Column(Integer, nullable=False)
    reading_order = Column(Integer, nullable=False)
    event_type = Column(String, nullable=False) 
    time_spent_ms = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class CursorEvent(Base):
    __tablename__ = "cursor_events"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id", ondelete="CASCADE"), index=True)
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="CASCADE"))
    paragraph_id = Column(Integer, ForeignKey("paragraphs.id", ondelete="CASCADE"))
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    viewport_width = Column(Integer, nullable=False)
    viewport_height = Column(Integer, nullable=False)
    event_time_ms = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class QuizResponse(Base):
    __tablename__ = "quiz_responses"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id", ondelete="CASCADE"), index=True)
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="CASCADE"))
    question_id = Column(Integer, ForeignKey("quiz_questions.id", ondelete="CASCADE"))
    # Support for all types of quiz responses
    selected_option_id = Column(Integer, ForeignKey("quiz_options.id", ondelete="CASCADE"), nullable=True) # MCQ
    likert_value = Column(Integer, nullable=True) # Likert (1-5)
    text_response = Column(Text, nullable=True) # Open-ended / Boolean states
    response_time_ms = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class AIIntervention(Base):
    __tablename__ = "ai_interventions"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id", ondelete="CASCADE"), index=True)
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="CASCADE"))
    paragraph_id = Column(Integer, ForeignKey("paragraphs.id", ondelete="CASCADE"))
    prompt_template_id = Column(Integer, ForeignKey("prompt_templates.id", ondelete="SET NULL"), nullable=True)
    trigger_reason = Column(String, nullable=False)
    generated_text = Column(Text, nullable=False)
    latency_ms = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    feedback = relationship("AIFeedback", back_populates="intervention", uselist=False)

class AIFeedback(Base):
    __tablename__ = "ai_feedback"
    id = Column(Integer, primary_key=True, index=True)
    intervention_id = Column(Integer, ForeignKey("ai_interventions.id", ondelete="CASCADE"), unique=True)
    session_id = Column(Integer, ForeignKey("sessions.id", ondelete="CASCADE"))
    version_id = Column(Integer, ForeignKey("experiment_versions.id", ondelete="CASCADE"))
    is_helpful = Column(Boolean, nullable=False)
    optional_comment = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    intervention = relationship("AIIntervention", back_populates="feedback")


class TelemetryEvent(Base):
    """Persists one analytics snapshot per navigation event.

    Each row represents the moment a participant *leaves* a paragraph.
    Typed columns hold per-paragraph metrics only (not cumulative session
    history), making downstream SQL / pandas aggregation straightforward.
    """
    __tablename__ = "telemetry_events"

    id                   = Column(Integer, primary_key=True, index=True)
    event_type           = Column(String(64), nullable=False)           # 'navigation' | etc.
    participant_id       = Column(String(128), nullable=True, index=True)
    session_id           = Column(String(128), nullable=True, index=True)
    section_id           = Column(String(128), nullable=True)
    paragraph_id         = Column(String(128), nullable=True, index=True)  # str: 'p_1' style

    # Per-paragraph metrics for the paragraph being left
    dwell_time_s         = Column(Integer, nullable=True)    # seconds on this paragraph
    visit_count          = Column(Integer, nullable=True)    # total visits (rereads = visit_count - 1)
    backtrack_count      = Column(Integer, nullable=True)    # session total at flush time
    cursor_idle_seconds  = Column(Integer, nullable=True)    # cumulative idle on this paragraph
    cursor_idle_episodes = Column(Integer, nullable=True)
    longest_idle_s       = Column(Integer, nullable=True)

    raw_metadata         = Column(Text, nullable=True)       # full JSON for debugging
    timestamp            = Column(DateTime(timezone=True), server_default=func.now())