from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class QuizOption(BaseModel):
    id: Any
    text: str

class QuizQuestion(BaseModel):
    id: Any
    type: str # MCQ, LIKERT, HELPFULNESS, etc.
    text: str
    options: Optional[List[QuizOption]] = None
    required: bool = True

class CurrentQuizResponse(BaseModel):
    section_id: Any
    questions: List[QuizQuestion]

class Answer(BaseModel):
    question_id: Any
    value: Any

class QuizSubmitRequest(BaseModel):
    session_id: Any
    section_id: Optional[Any] = None
    quiz_id: Optional[Any] = None
    answers: Any # Can be Dict[str, Any] or List[Answer]
    time_spent_seconds: Optional[int] = 0

class QuizSubmitResponse(BaseModel):
    success: bool = True
    score: Optional[int] = 100
    max_score: Optional[int] = 100
    passed: Optional[bool] = True
    feedback: Optional[Dict[str, str]] = None
    validation_errors: Optional[List[str]] = None

class QuizHistoryItem(BaseModel):
    session_id: Any
    section_id: Any
    answers: Any
    timestamp: datetime

class AdminQuizCreate(BaseModel):
    experiment_id: Any
    section_id: Any
    questions: List[QuizQuestion]
