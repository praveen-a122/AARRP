from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AnalyticsDashboard(BaseModel):
    total_participants: int
    completed_participants: int
    active_participants: int
    interrupted_sessions: int
    avg_experiment_duration: float

class AnalyticsParticipant(BaseModel):
    participant_id: str
    metrics: Dict[str, Any]

class AnalyticsExperiment(BaseModel):
    experiment_id: str
    metrics: Dict[str, Any]

class ReportResponse(BaseModel):
    report_url: str
    generated_at: str


# ─── Telemetry ingestion ────────────────────────────────────────────────────

class TelemetryEventIn(BaseModel):
    """One analytics event representing a single navigation moment.

    Only the metrics for the paragraph being *left* are expected
    (not a cumulative dict of all paragraphs).
    """
    event_type: str                           # 'navigation' | 'scroll' | etc.
    participant_id: Optional[str] = None
    participant_name: Optional[str] = None
    session_id: Optional[str] = None
    section_id: Optional[str] = None
    paragraph_id: Optional[str] = None       # str to match frontend 'p_1' style IDs
    dwell_time_s: Optional[int] = None       # seconds spent on this paragraph
    visit_count: Optional[int] = None        # how many times this paragraph was visited
    backtrack_count: Optional[int] = None    # total session backtracks at flush time
    cursor_idle_seconds: Optional[int] = None
    cursor_idle_episodes: Optional[int] = None
    longest_idle_s: Optional[int] = None
    raw_metadata: Optional[Dict[str, Any]] = None  # full payload kept for debugging
    timestamp: Optional[str] = None


class TelemetryBatch(BaseModel):
    events: List[TelemetryEventIn]
