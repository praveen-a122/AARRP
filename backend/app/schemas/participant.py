from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ParticipantRegisterRequest(BaseModel):
    demographics: Optional[Dict[str, Any]] = None
    version_id: Optional[int] = None
    condition_id: Optional[int] = None


class ParticipantRegisterResponse(BaseModel):
    participant_id: int
    participant_code: str
    session_id: int
    status: str


class ParticipantStatusResponse(BaseModel):
    participant_id: int
    participant_code: str
    status: str
    created_at: str
