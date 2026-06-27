from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.schemas import ai as schemas
from app.services import ai as service
from app.database.database import get_db

router = APIRouter(prefix="/api/ai", tags=["AI Intervention Engine"])

@router.post("/evaluate", response_model=schemas.InterventionEligibilityResponse)
async def evaluate_intervention(req: schemas.InterventionEligibilityRequest, db: AsyncSession = Depends(get_db)):
    return await service.evaluate_eligibility(req, db)

@router.post("/respond", response_model=schemas.AIResponse)
async def generate_response(req: schemas.AIResponseRequest, db: AsyncSession = Depends(get_db)):
    return await service.generate_ai_response(req, db)

@router.post("/feedback", status_code=201)
async def store_feedback(req: schemas.HelpfulnessFeedback, db: AsyncSession = Depends(get_db)):
    await service.store_helpfulness_feedback(req, db)
    return {"message": "Feedback recorded successfully"}

@router.get("/history", response_model=List[schemas.InterventionHistoryItem])
async def get_history(participant_id: int, db: AsyncSession = Depends(get_db)):
    return await service.get_intervention_history(participant_id, db)
