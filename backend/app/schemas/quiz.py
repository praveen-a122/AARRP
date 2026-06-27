from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuizOption(BaseModel):
    id: int
    text: str

class QuizQuestion(BaseModel):
    id: int
    type: str # MCQ, LIKERT, HELPFULNESS
    text: str
    options: Optional[List[QuizOption]] = None
    required: bool = True

class CurrentQuizResponse(BaseModel):
    section_id: int
    questions: List[QuizQuestion]

class Answer(BaseModel):
    question_id: int
    value: str

class QuizSubmitRequest(BaseModel):
    session_id: int
    section_id: int
    answers: List[Answer]

class QuizSubmitResponse(BaseModel):
    success: bool
    validation_errors: Optional[List[str]] = None

class QuizHistoryItem(BaseModel):
    session_id: int
    section_id: int
    answers: List[Answer]
    timestamp: datetime

class AdminQuizCreate(BaseModel):
    experiment_id: int
    section_id: int
    questions: List[QuizQuestion]
