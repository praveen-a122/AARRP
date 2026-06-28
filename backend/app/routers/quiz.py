from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.schemas import quiz as schemas
from app.services import quiz as service
from app.database.database import get_db

router = APIRouter(tags=["Quiz Engine"])

@router.get("/api/quiz/current", response_model=schemas.CurrentQuizResponse)
async def get_current_quiz(session_id: str, section_id: str, db: AsyncSession = Depends(get_db)):
    return await service.get_current_quiz(session_id, section_id, db)


@router.post("/api/quiz/submit", response_model=schemas.QuizSubmitResponse)
async def submit_quiz(req: schemas.QuizSubmitRequest, db: AsyncSession = Depends(get_db)):
    return await service.submit_quiz(req, db)

@router.get("/api/quiz/history", response_model=List[schemas.QuizHistoryItem])
async def get_quiz_history(participant_id: int, db: AsyncSession = Depends(get_db)):
    return await service.get_quiz_history(participant_id, db)

@router.post("/api/admin/quiz", status_code=201)
async def admin_create_quiz(req: schemas.AdminQuizCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_quiz(req, db)
