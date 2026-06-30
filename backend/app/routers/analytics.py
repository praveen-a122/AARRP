from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.schemas import analytics as schemas
from app.services import analytics as service
from app.database.database import get_db

router = APIRouter(tags=["Analytics & Reporting"])

@router.post("/api/analytics/telemetry/batch")
async def ingest_telemetry_batch(batch: schemas.TelemetryBatch, db: AsyncSession = Depends(get_db)):
    """Receive and persist a batch of reading telemetry events from the frontend."""
    return await service.save_telemetry_batch(batch, db)



@router.get("/api/analytics/dashboard", response_model=schemas.AnalyticsDashboard)
async def get_analytics_dashboard(db: AsyncSession = Depends(get_db)):
    return await service.get_dashboard_analytics(db)

@router.get("/api/analytics/participants")
async def get_participant_analytics(db: AsyncSession = Depends(get_db)):
    return await service.get_participant_analytics(db)

@router.get("/api/analytics/overview")
async def get_analytics_overview(db: AsyncSession = Depends(get_db)):
    return await service.get_analytics_overview(db)

@router.get("/api/analytics/interventions")
async def get_analytics_interventions(db: AsyncSession = Depends(get_db)):
    return [
        { "scaffoldingType": "Contextual Hint", "count": 12, "helpfulCount": 10, "avgLatencyMs": 610 },
        { "scaffoldingType": "Vocabulary Expansion", "count": 8, "helpfulCount": 7, "avgLatencyMs": 480 },
        { "scaffoldingType": "Causal Summary", "count": 6, "helpfulCount": 5, "avgLatencyMs": 740 }
    ]

@router.get("/api/analytics/completion-trends")
async def get_analytics_completion_trends():
    return [
        { "date": "Day 1", "enrolled": 5, "completed": 4, "droppedOut": 1 },
        { "date": "Day 2", "enrolled": 10, "completed": 9, "droppedOut": 1 }
    ]

@router.get("/api/admin/analytics/comprehension")
async def get_comprehension_chart_data():
    return [
        { "label": "80-100%", "value": 15 },
        { "label": "60-80%", "value": 8 },
        { "label": "40-60%", "value": 3 },
        { "label": "Below 40%", "value": 1 }
    ]

@router.get("/api/admin/analytics/interventions")
async def get_interventions_chart_data():
    return [
        { "label": "Mon", "value": 5 },
        { "label": "Tue", "value": 8 },
        { "label": "Wed", "value": 12 },
        { "label": "Thu", "value": 9 },
        { "label": "Fri", "value": 15 }
    ]

@router.get("/api/analytics/experiments", response_model=List[schemas.AnalyticsExperiment])
async def get_experiment_analytics(db: AsyncSession = Depends(get_db)):
    return await service.get_experiment_analytics(db)

@router.get("/api/reports", response_model=schemas.ReportResponse)
async def generate_reports(db: AsyncSession = Depends(get_db)):
    return await service.generate_reports(db)
