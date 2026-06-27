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

class AIResponseRequest(BaseModel):
    session_id: int
    participant_id: int
    paragraph_id: int
    context: str

class AIResponse(BaseModel):
    response_text: str

class HelpfulnessFeedback(BaseModel):
    session_id: int
    intervention_id: int
    is_helpful: bool

class InterventionHistoryItem(BaseModel):
    intervention_id: int
    session_id: int
    timestamp: datetime
    prompt_version: str
    ai_model: str
    response_status: str
