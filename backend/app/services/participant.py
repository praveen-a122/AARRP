from app.schemas import participant as schemas
from app.models.participant import Participant, Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException


async def register_participant(req: schemas.ParticipantRegisterRequest, db: AsyncSession) -> schemas.ParticipantRegisterResponse:
    new_participant = Participant(
        version_id=req.version_id,
        condition_id=req.condition_id,
        status="enrolled"
    )
    db.add(new_participant)
    await db.flush()  # get new_participant.id inside atomic transaction

    new_session = Session(
        participant_id=new_participant.id,
        version_id=req.version_id,
        status="in_progress"
    )
    db.add(new_session)
    await db.commit()  # single atomic commit

    return schemas.ParticipantRegisterResponse(
        participant_id=new_participant.id,
        participant_code=new_participant.participant_code or f"P0000{new_participant.id}",
        session_id=new_session.id,
        status=new_participant.status
    )


async def get_participant_status(participant_id: int, db: AsyncSession) -> schemas.ParticipantStatusResponse:
    stmt = select(Participant).where(Participant.id == participant_id)
    result = await db.execute(stmt)
    participant = result.scalar_one_or_none()

    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    return schemas.ParticipantStatusResponse(
        participant_id=participant.id,
        participant_code=participant.participant_code or "",
        status=participant.status,
        created_at=str(participant.created_at)
    )
