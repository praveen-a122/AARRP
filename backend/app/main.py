from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.config.logger import logger
import app.models

from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.routers.ai import router as ai_router
from app.routers.quiz import router as quiz_router
from app.routers.cms import router as cms_router
from app.routers.admin import router as admin_router
from app.routers.analytics import router as analytics_router
from app.routers.participant import router as participant_router

app = FastAPI(
    title="AARRP Backend API",
    version="2.0.0",
    description="Backend for the Adaptive AI Reading Research Platform"
)

# CORS Configuration 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)
app.include_router(quiz_router)
app.include_router(cms_router)
app.include_router(admin_router)
app.include_router(analytics_router)
app.include_router(participant_router)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting AARRP FastAPI Server...")
    # Pre-warm the connection pool — must use async_sessionmaker, not engine.begin()
    from app.database.database import AsyncSessionLocal
    from sqlalchemy import text
    async with AsyncSessionLocal() as session:
        await session.execute(text("SELECT 1"))
    logger.info("Connection pool pre-warmed.")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/health/db")
async def db_health_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
async def root_login(req: dict, db: AsyncSession = Depends(get_db)):
    from app.schemas.admin import AdministratorLogin
    from app.services import admin as admin_service
    login_req = AdministratorLogin(username=req.get("username", ""), password=req.get("password", ""))
    return await admin_service.login_admin(login_req, db)