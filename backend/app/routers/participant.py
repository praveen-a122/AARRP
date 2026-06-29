from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import participant as schemas
from app.services import participant as service
from app.database.database import get_db

router = APIRouter(prefix="/api/participant", tags=["Participant"])


@router.post("/register", response_model=schemas.ParticipantRegisterResponse)
async def register_participant(req: schemas.ParticipantRegisterRequest, db: AsyncSession = Depends(get_db)):
    return await service.register_participant(req, db)


@router.get("/status/{participant_id}", response_model=schemas.ParticipantStatusResponse)
async def get_participant_status(participant_id: str, db: AsyncSession = Depends(get_db)):
    return await service.get_participant_status(participant_id, db)


@router.post("/complete/{participant_id}")
async def complete_participant_session(participant_id: str, payload: Optional[Dict[str, Any]] = Body(default=None), db: AsyncSession = Depends(get_db)):
    return await service.complete_participant_session(participant_id, db, payload)

