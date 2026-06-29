from app.schemas import participant as schemas
from app.models.participant import Participant, Session
from app.models.experiments import ExperimentVersion
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from datetime import datetime, timezone


async def register_participant(req: schemas.ParticipantRegisterRequest, db: AsyncSession) -> schemas.ParticipantRegisterResponse:
    custom_code = None
    demographics_json = None
    if req.demographics and isinstance(req.demographics, dict):
        custom_code = req.demographics.get("participant_code")
        import json
        demographics_json = json.dumps(req.demographics)

    new_participant = Participant(
        version_id=req.version_id,
        condition_id=req.condition_id,
        demographics=demographics_json,
        status="enrolled"
    )
    if custom_code:
        new_participant.participant_code = str(custom_code)

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


async def get_participant_status(participant_id: str, db: AsyncSession) -> schemas.ParticipantStatusResponse:
    stmt = select(Participant).where(Participant.participant_code == participant_id)
    result = await db.execute(stmt)
    participant = result.scalar_one_or_none()

    if not participant and participant_id.isdigit():
        stmt = select(Participant).where(Participant.id == int(participant_id))
        result = await db.execute(stmt)
        participant = result.scalar_one_or_none()

    if not participant:
        participant = Participant(participant_code=participant_id, status="enrolled")
        db.add(participant)
        await db.flush()
        session = Session(participant_id=participant.id, status="in_progress")
        db.add(session)
        await db.commit()
    else:
        stmt_s = select(Session).where(Session.participant_id == participant.id).order_by(Session.id.desc()).limit(1)
        res_s = await db.execute(stmt_s)
        session = res_s.scalar_one_or_none()
        if not session:
            session = Session(participant_id=participant.id, status="in_progress")
            db.add(session)
            await db.commit()

    exp_id = "1"
    if session.version_id:
        stmt_v = select(ExperimentVersion).where(ExperimentVersion.id == session.version_id)
        res_v = await db.execute(stmt_v)
        ver = res_v.scalar_one_or_none()
        if ver:
            exp_id = str(ver.experiment_id)

    return schemas.ParticipantStatusResponse(
        participant_id=participant.id,
        participant_code=participant.participant_code or participant_id,
        status=participant.status,
        created_at=str(participant.created_at or datetime.now(timezone.utc)),
        experiment_id=exp_id,
        session_id=f"sess_{participant.participant_code or participant.id}",
        last_section_id="sec_1",
        elapsed_seconds=session.duration_ms // 1000 if session.duration_ms else 0
    )


async def complete_participant_session(participant_id: str, db: AsyncSession):
    stmt = select(Participant).where(Participant.participant_code == participant_id)
    result = await db.execute(stmt)
    participant = result.scalar_one_or_none()
    if not participant and participant_id.isdigit():
        stmt = select(Participant).where(Participant.id == int(participant_id))
        result = await db.execute(stmt)
        participant = result.scalar_one_or_none()

    now = datetime.now(timezone.utc)
    if participant:
        participant.status = "completed"
        stmt_s = select(Session).where(Session.participant_id == participant.id).order_by(Session.id.desc()).limit(1)
        res_s = await db.execute(stmt_s)
        session = res_s.scalar_one_or_none()
        if session:
            session.status = "completed"
            session.is_completed = True
            session.completed_at = now
        await db.commit()
    return {"status": "completed", "timestamp": str(now)}
