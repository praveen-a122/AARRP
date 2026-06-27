from pydantic import BaseModel
from typing import List, Dict, Any

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
