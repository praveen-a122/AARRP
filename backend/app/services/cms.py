from app.schemas import cms as schemas
from app.models.experiments import Experiment, ExperimentVersion
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
import datetime

def format_exp(exp: Experiment, latest_version: ExperimentVersion = None) -> schemas.ExperimentResponse:
    v_num = latest_version.version_number if latest_version else 1
    status = latest_version.status if latest_version else "draft"
    v_id = latest_version.id if latest_version else 1
    
    v_detail = schemas.VersionDetail(
        id=str(v_id),
        experiment_id=str(exp.id),
        version_number=v_num,
        status=status,
        config={},
        created_at=exp.created_at.isoformat() if exp.created_at else datetime.datetime.now(datetime.timezone.utc).isoformat()
    )
    
    return schemas.ExperimentResponse(
        id=str(exp.id),
        experiment_id=exp.id,
        version_id=v_id,
        title=exp.title,
        description=exp.description,
        status=status,
        author_id="usr_admin",
        current_version=v_detail,
        created_at=exp.created_at.isoformat() if exp.created_at else datetime.datetime.now(datetime.timezone.utc).isoformat(),
        updated_at=exp.created_at.isoformat() if exp.created_at else datetime.datetime.now(datetime.timezone.utc).isoformat()
    )

async def list_experiments(db: AsyncSession):
    stmt = select(Experiment).where(Experiment.deleted_at == None).order_by(Experiment.id.desc())
    result = await db.execute(stmt)
    exps = result.scalars().all()
    res = []
    for exp in exps:
        stmt_v = select(ExperimentVersion).where(ExperimentVersion.experiment_id == exp.id).order_by(ExperimentVersion.version_number.desc()).limit(1)
        v_res = await db.execute(stmt_v)
        latest_v = v_res.scalar_one_or_none()
        res.append(format_exp(exp, latest_v))
    return res

async def get_experiment(exp_id: int, db: AsyncSession):
    stmt = select(Experiment).where(Experiment.id == exp_id, Experiment.deleted_at == None)
    result = await db.execute(stmt)
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    stmt_v = select(ExperimentVersion).where(ExperimentVersion.experiment_id == exp.id).order_by(ExperimentVersion.version_number.desc()).limit(1)
    v_res = await db.execute(stmt_v)
    latest_v = v_res.scalar_one_or_none()
    return format_exp(exp, latest_v)

async def delete_experiment(exp_id: int, db: AsyncSession):
    stmt = select(Experiment).where(Experiment.id == exp_id)
    result = await db.execute(stmt)
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    exp.deleted_at = datetime.datetime.now(datetime.timezone.utc)
    await db.commit()
    return {"message": "Deleted successfully"}

async def create_experiment(req: schemas.ExperimentCreateRequest, db: AsyncSession) -> schemas.ExperimentResponse:
    new_exp = Experiment(title=req.title, description=req.description)
    db.add(new_exp)
    await db.flush()
    
    new_version = ExperimentVersion(experiment_id=new_exp.id, version_number=1, status="draft")
    db.add(new_version)
    await db.flush()
    
    resp = format_exp(new_exp, new_version)
    await db.commit()
    return resp

async def update_experiment(req: schemas.ExperimentUpdateRequest, db: AsyncSession, exp_id_param: int = None) -> schemas.ExperimentResponse:
    target_id = exp_id_param or req.experiment_id
    if not target_id:
        raise HTTPException(status_code=400, detail="Experiment ID required")
    stmt = select(Experiment).where(Experiment.id == target_id)
    result = await db.execute(stmt)
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
        
    if req.title is not None:
        exp.title = req.title
    if req.description is not None:
        exp.description = req.description
        
    stmt_v = select(ExperimentVersion).where(ExperimentVersion.experiment_id == exp.id).order_by(ExperimentVersion.version_number.desc()).limit(1)
    v_result = await db.execute(stmt_v)
    latest_version = v_result.scalar_one_or_none()
    
    if not latest_version:
        raise HTTPException(status_code=404, detail="Experiment version not found")
        
    resp = format_exp(exp, latest_version)
    await db.commit()
    return resp

async def publish_experiment(experiment_id: int, db: AsyncSession):
    stmt = select(ExperimentVersion).where(ExperimentVersion.experiment_id == experiment_id, ExperimentVersion.status == "draft")
    result = await db.execute(stmt)
    draft_version = result.scalar_one_or_none()
    
    if not draft_version:
        # Check if already published
        stmt_pub = select(ExperimentVersion).where(ExperimentVersion.experiment_id == experiment_id, ExperimentVersion.status == "published")
        pub_res = await db.execute(stmt_pub)
        if pub_res.scalar_one_or_none():
            return {"message": "Experiment already published"}
        raise HTTPException(status_code=404, detail="No draft version found for this experiment")
        
    draft_version.status = "published"
    draft_version.published_at = datetime.datetime.now(datetime.timezone.utc)
    await db.commit()
    return {"message": "Experiment published successfully"}

async def preview_experiment(experiment_id: int, db: AsyncSession):
    stmt = select(Experiment).where(Experiment.id == experiment_id)
    result = await db.execute(stmt)
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return {"experiment_id": experiment_id, "preview": True}

async def create_version(experiment_id: int, db: AsyncSession) -> schemas.ExperimentResponse:
    stmt = select(Experiment).where(Experiment.id == experiment_id)
    result = await db.execute(stmt)
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
        
    stmt_v = select(ExperimentVersion).where(ExperimentVersion.experiment_id == exp.id).order_by(ExperimentVersion.version_number.desc()).limit(1)
    v_result = await db.execute(stmt_v)
    latest_version = v_result.scalar_one_or_none()
    
    new_version_num = latest_version.version_number + 1 if latest_version else 1
    
    new_version = ExperimentVersion(experiment_id=exp.id, version_number=new_version_num, status="draft")
    db.add(new_version)
    await db.flush()
    
    resp = format_exp(exp, new_version)
    await db.commit()
    return resp
