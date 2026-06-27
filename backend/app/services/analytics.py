from app.schemas import analytics as schemas
from app.models.participant import Participant
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException
from datetime import datetime

async def get_dashboard_analytics(db: AsyncSession) -> schemas.AnalyticsDashboard:
    stmt_total = select(func.count()).select_from(Participant)
    total_participants = (await db.execute(stmt_total)).scalar() or 0
    
    stmt_completed = select(func.count()).select_from(Participant).where(Participant.status == "completed")
    completed_participants = (await db.execute(stmt_completed)).scalar() or 0
    
    stmt_active = select(func.count()).select_from(Participant).where(Participant.status == "enrolled")
    active_participants = (await db.execute(stmt_active)).scalar() or 0
    
    return schemas.AnalyticsDashboard(
        total_participants=total_participants,
        completed_participants=completed_participants,
        active_participants=active_participants,
        interrupted_sessions=0, # Blocked pending full tracking mapping
        avg_experiment_duration=0.0 # Blocked pending full tracking mapping
    )

async def get_participant_analytics(db: AsyncSession) -> list[schemas.AnalyticsParticipant]:
    raise HTTPException(status_code=501, detail="Participant analytics blocked pending full tracking mapping.")

async def get_experiment_analytics(db: AsyncSession) -> list[schemas.AnalyticsExperiment]:
    raise HTTPException(status_code=501, detail="Experiment analytics blocked pending full tracking mapping.")

async def generate_reports(db: AsyncSession) -> schemas.ReportResponse:
    raise HTTPException(status_code=501, detail="Report generation blocked.")
