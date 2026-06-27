from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.schemas import analytics as schemas
from app.services import analytics as service
from app.database.database import get_db

router = APIRouter(tags=["Analytics & Reporting"])

@router.get("/api/analytics/dashboard", response_model=schemas.AnalyticsDashboard)
async def get_analytics_dashboard(db: AsyncSession = Depends(get_db)):
    return await service.get_dashboard_analytics(db)

@router.get("/api/analytics/participants", response_model=List[schemas.AnalyticsParticipant])
async def get_participant_analytics(db: AsyncSession = Depends(get_db)):
    return await service.get_participant_analytics(db)

@router.get("/api/analytics/experiments", response_model=List[schemas.AnalyticsExperiment])
async def get_experiment_analytics(db: AsyncSession = Depends(get_db)):
    return await service.get_experiment_analytics(db)

@router.get("/api/reports", response_model=schemas.ReportResponse)
async def generate_reports(db: AsyncSession = Depends(get_db)):
    return await service.generate_reports(db)
