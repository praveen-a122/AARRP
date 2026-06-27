from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.schemas import cms as schemas
from app.services import cms as service
from app.database.database import get_db

router = APIRouter(prefix="/api/cms", tags=["CMS & Experiment Wizard"])

@router.get("/experiment", response_model=List[schemas.ExperimentResponse])
async def list_experiments(db: AsyncSession = Depends(get_db)):
    return await service.list_experiments(db)

@router.post("/experiment", response_model=schemas.ExperimentResponse)
async def create_experiment(req: schemas.ExperimentCreateRequest, db: AsyncSession = Depends(get_db)):
    return await service.create_experiment(req, db)

@router.get("/experiment/{id}", response_model=schemas.ExperimentResponse)
async def get_experiment(id: int, db: AsyncSession = Depends(get_db)):
    return await service.get_experiment(id, db)

@router.put("/experiment/{id}", response_model=schemas.ExperimentResponse)
async def update_experiment_by_id(id: int, req: schemas.ExperimentUpdateRequest, db: AsyncSession = Depends(get_db)):
    return await service.update_experiment(req, db, exp_id_param=id)

@router.put("/experiment", response_model=schemas.ExperimentResponse)
async def update_experiment(req: schemas.ExperimentUpdateRequest, db: AsyncSession = Depends(get_db)):
    return await service.update_experiment(req, db)

@router.delete("/experiment/{id}")
async def delete_experiment(id: int, db: AsyncSession = Depends(get_db)):
    return await service.delete_experiment(id, db)

@router.post("/experiment/{id}/publish")
async def publish_experiment_by_id(id: int, db: AsyncSession = Depends(get_db)):
    return await service.publish_experiment(id, db)

@router.post("/publish")
async def publish_experiment(req: schemas.PublishRequest, db: AsyncSession = Depends(get_db)):
    if not req.experiment_id:
        raise HTTPException(status_code=400, detail="experiment_id required")
    return await service.publish_experiment(req.experiment_id, db)

@router.get("/preview")
async def preview_experiment(experiment_id: int, db: AsyncSession = Depends(get_db)):
    return await service.preview_experiment(experiment_id, db)

@router.post("/version", response_model=schemas.ExperimentResponse)
async def create_version(req: schemas.VersionRequest, db: AsyncSession = Depends(get_db)):
    return await service.create_version(req.experiment_id, db)
