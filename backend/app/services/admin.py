from app.schemas import admin as schemas
from app.models.admin import Administrator, AdministratorRole, AdministratorSession
from app.models.participant import Participant
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.config.security import hash_password, verify_password, create_access_token

async def get_dashboard_metrics(db: AsyncSession) -> schemas.AdminDashboardMetrics:
    # Rule: explicitly mark as blocked if complex cross-module query is not fully mapped
    raise HTTPException(status_code=501, detail="Dashboard metrics aggregation is blocked pending Analytics module completion.")

async def get_participants(db: AsyncSession) -> list[schemas.ParticipantSummary]:
    stmt = select(Participant)
    result = await db.execute(stmt)
    participants = result.scalars().all()
    
    return [
        schemas.ParticipantSummary(
            participant_id=p.id,
            experiment_id=p.version_id or 0,
            status=p.status,
            registration_timestamp=str(p.created_at)
        )
        for p in participants
    ]

async def get_participant_details(participant_id: int, db: AsyncSession):
    raise HTTPException(status_code=501, detail="Participant details view is blocked pending full tracking module mapping.")

async def get_admin_analytics(db: AsyncSession):
    raise HTTPException(status_code=501, detail="Admin analytics is blocked.")

async def get_admin_reports(db: AsyncSession):
    raise HTTPException(status_code=501, detail="Admin reports is blocked.")

async def export_all_datasets(db: AsyncSession):
    raise HTTPException(status_code=501, detail="Data export is blocked.")

async def create_admin(req: schemas.AdministratorCreate, db: AsyncSession) -> schemas.AdminResponse:
    # Check if role exists
    stmt = select(AdministratorRole).where(AdministratorRole.name == req.role)
    result = await db.execute(stmt)
    role = result.scalar_one_or_none()
    
    if not role:
        # Create a basic role if it doesn't exist to allow admin creation
        role = AdministratorRole(name=req.role, permissions={})
        db.add(role)
        await db.flush()
        
    role_name = role.name  # capture before commit — role may expire after flush

    hashed_password = hash_password(req.password)

    new_admin = Administrator(
        username=req.username,
        email=req.email,
        password_hash=hashed_password,
        role_id=role.id,
        is_active=True
    )
    db.add(new_admin)
    await db.commit()

    return schemas.AdminResponse(
        admin_id=new_admin.id,
        username=new_admin.username,
        role=role_name,
        active=new_admin.is_active
    )

async def update_admin(req: schemas.AdministratorUpdate, db: AsyncSession) -> schemas.AdminResponse:
    stmt = select(Administrator).where(Administrator.id == req.admin_id)
    result = await db.execute(stmt)
    admin = result.scalar_one_or_none()
    
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
        
    if req.active is not None:
        admin.is_active = req.active
        
    if req.role:
        stmt_role = select(AdministratorRole).where(AdministratorRole.name == req.role)
        role_result = await db.execute(stmt_role)
        role = role_result.scalar_one_or_none()
        if role:
            admin.role_id = role.id
            
    await db.commit()
    
    # fetch role name
    stmt_role = select(AdministratorRole).where(AdministratorRole.id == admin.role_id)
    role = (await db.execute(stmt_role)).scalar_one()
    
    return schemas.AdminResponse(
        admin_id=admin.id,
        username=admin.username,
        role=role.name,
        active=admin.is_active
    )

async def login_admin(req: schemas.AdministratorLogin, db: AsyncSession) -> schemas.AdminLoginResponse:
    stmt = select(Administrator).where(Administrator.username == req.username)
    result = await db.execute(stmt)
    admin = result.scalar_one_or_none()
    
    if not admin or not verify_password(req.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
        
    if not admin.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")
        
    stmt_role = select(AdministratorRole).where(AdministratorRole.id == admin.role_id)
    role = (await db.execute(stmt_role)).scalar_one()
    
    access_token = create_access_token(data={"sub": admin.username, "id": admin.id, "role": role.name})
    
    admin_resp = schemas.AdminResponse(
        admin_id=admin.id,
        username=admin.username,
        role=role.name,
        active=admin.is_active
    )
    
    from datetime import datetime, timedelta, timezone
    session = AdministratorSession(
        admin_id=admin.id,
        token_hash=access_token,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=60)
    )
    db.add(session)
    await db.commit()
    
    return schemas.AdminLoginResponse(
        access_token=access_token,
        token_type="bearer",
        admin=admin_resp
    )


async def reset_all_participant_data(db: AsyncSession):
    from sqlalchemy import text
    try:
        await db.execute(text("TRUNCATE TABLE telemetry_events, quiz_responses, reading_events, cursor_events, ai_interventions, ai_feedback, sessions, participants CASCADE;"))
    except Exception:
        await db.execute(text("DELETE FROM telemetry_events;"))
        await db.execute(text("DELETE FROM quiz_responses;"))
        await db.execute(text("DELETE FROM reading_events;"))
        await db.execute(text("DELETE FROM cursor_events;"))
        await db.execute(text("DELETE FROM ai_interventions;"))
        await db.execute(text("DELETE FROM ai_feedback;"))
        await db.execute(text("DELETE FROM sessions;"))
        await db.execute(text("DELETE FROM participants;"))
    try:
        await db.execute(text("ALTER SEQUENCE participant_id_seq RESTART WITH 1;"))
    except Exception:
        pass
    await db.commit()
    return {"status": "success", "message": "All participant data wiped and sequence reset to P01"}

