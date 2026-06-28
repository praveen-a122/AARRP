from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class InterventionEligibilityRequest(BaseModel):
    session_id: int
    participant_id: int
    paragraph_id: int

class InterventionEligibilityResponse(BaseModel):
    eligible: bool
    struggle_score: float


# ─── Telemetry snapshot sent alongside an AI request ───────────────────────

class ParticipantTelemetry(BaseModel):
    """Analytics snapshot for the current paragraph at the moment help is requested.

    All fields are optional so the endpoint degrades gracefully when
    telemetry is unavailable (e.g. during development or API testing).
    """
    dwell_seconds:        Optional[int]   = None  # time spent on this paragraph
    visit_count:          Optional[int]   = None  # total visits (rereads = visits - 1)
    backtrack_count:      Optional[int]   = None  # total session backtracks
    cursor_idle_seconds:  Optional[int]   = None  # cumulative cursor idle time
    cursor_idle_episodes: Optional[int]   = None
    longest_idle_s:       Optional[int]   = None
    word_count:           Optional[int]   = None  # paragraph word count (for WPM)
    quiz_accuracy:        Optional[float] = None  # 0.0–1.0, if quiz data is available


class AIResponseRequest(BaseModel):
    session_id:     int
    participant_id: int
    paragraph_id:   str   # str to match frontend 'p_1' style IDs
    context:        str   # paragraph text
    telemetry:      Optional[ParticipantTelemetry] = None


class AIResponse(BaseModel):
    response_text: str
    latency_ms:    Optional[float] = None   # Groq round-trip time


class HelpfulnessFeedback(BaseModel):
    session_id:      int
    intervention_id: int
    is_helpful:      bool

class InterventionHistoryItem(BaseModel):
    intervention_id: int
    session_id:      int
    timestamp:       datetime
    prompt_version:  str
    ai_model:        str
    response_status: str
