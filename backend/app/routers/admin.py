from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.schemas import admin as schemas
from app.services import admin as service
from app.database.database import get_db

router = APIRouter(prefix="/api/admin", tags=["Administrative Dashboard"])

@router.get("/dashboard", response_model=schemas.AdminDashboardMetrics)
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    return await service.get_dashboard_metrics(db)

@router.get("/participants", response_model=List[schemas.ParticipantSummary])
async def list_participants(db: AsyncSession = Depends(get_db)):
    return await service.get_participants(db)

@router.get("/participant/{id}")
async def get_participant_details(id: int, db: AsyncSession = Depends(get_db)):
    return await service.get_participant_details(id, db)

@router.get("/analytics")
async def get_admin_analytics(db: AsyncSession = Depends(get_db)):
    return await service.get_admin_analytics(db)

@router.get("/reports")
async def get_admin_reports(db: AsyncSession = Depends(get_db)):
    return await service.get_admin_reports(db)

@router.get("/export")
async def export_data(db: AsyncSession = Depends(get_db)):
    return await service.export_all_datasets(db)

@router.post("/create", response_model=schemas.AdminResponse)
async def create_administrator(req: schemas.AdministratorCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_admin(req, db)

@router.put("/update", response_model=schemas.AdminResponse)
async def update_administrator(req: schemas.AdministratorUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update_admin(req, db)

@router.post("/login", response_model=schemas.AdminLoginResponse)
async def login_administrator(req: schemas.AdministratorLogin, db: AsyncSession = Depends(get_db)):
    return await service.login_admin(req, db)

@router.post("/reset-data")
async def reset_data(db: AsyncSession = Depends(get_db)):
    return await service.reset_all_participant_data(db)

