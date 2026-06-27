from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import participant as schemas
from app.services import participant as service
from app.database.database import get_db

router = APIRouter(prefix="/api/participant", tags=["Participant"])


@router.post("/register", response_model=schemas.ParticipantRegisterResponse)
async def register_participant(req: schemas.ParticipantRegisterRequest, db: AsyncSession = Depends(get_db)):
    return await service.register_participant(req, db)


@router.get("/status/{participant_id}", response_model=schemas.ParticipantStatusResponse)
async def get_participant_status(participant_id: int, db: AsyncSession = Depends(get_db)):
    return await service.get_participant_status(participant_id, db)
