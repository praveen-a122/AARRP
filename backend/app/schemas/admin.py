from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AdminDashboardMetrics(BaseModel):
    total_participants: int
    active_sessions: int
    completed_experiments: int
    ai_intervention_count: int
    completion_rate: float
    average_reading_time: float

class ParticipantSummary(BaseModel):
    participant_id: int
    experiment_id: int
    status: str
    registration_timestamp: str

class AdministratorCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str

class AdministratorUpdate(BaseModel):
    admin_id: int
    role: Optional[str] = None
    active: Optional[bool] = None

class AdminResponse(BaseModel):
    admin_id: int
    username: str
    role: str
    active: bool

class AdministratorLogin(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse
