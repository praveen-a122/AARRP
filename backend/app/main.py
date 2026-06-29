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

# CORS Configuration — allow all Vercel preview/production domains + local dev
cors_origins = [
    settings.frontend_url,                        # from FRONTEND_URL env var
    "https://aarrp.vercel.app",                    # primary Vercel domain
    "https://aarrp-git-main-pforveen.vercel.app",  # git-branch preview
    "http://localhost:3000",                        # local dev
]
# Also allow any *.vercel.app preview deployment URL
import re
_vercel_pattern = re.compile(r"https://aarrp[a-z0-9-]*\.vercel\.app")

from starlette.middleware.cors import CORSMiddleware as _CM
from starlette.types import ASGIApp, Receive, Scope, Send

class FlexibleCORSMiddleware(_CM):
    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] in ("http", "websocket"):
            headers = dict(scope.get("headers", []))
            origin = headers.get(b"origin", b"").decode()
            if origin and _vercel_pattern.match(origin) and origin not in self.allow_origins:
                self.allow_origins.append(origin)
        await super().__call__(scope, receive, send)

app.add_middleware(
    FlexibleCORSMiddleware,
    allow_origins=cors_origins,
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
    # Use engine.begin() directly — avoids the sync initialization path that
    # doesn't honour connect_args with NullPool + PgBouncer.
    from app.database.database import engine
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.execute(text("SELECT 1"))
        try:
            await conn.execute(text("ALTER TABLE participants ADD COLUMN IF NOT EXISTS demographics TEXT;"))
            await conn.execute(text("ALTER TABLE participants ADD COLUMN IF NOT EXISTS name VARCHAR(128);"))
            await conn.execute(text("ALTER TABLE participants ADD COLUMN IF NOT EXISTS participant_id VARCHAR(64);"))
            await conn.execute(text("ALTER TABLE telemetry_events ADD COLUMN IF NOT EXISTS participant_name VARCHAR(128);"))
            await conn.execute(text("UPDATE participants SET participant_id = participant_code WHERE participant_id IS NULL AND participant_code IS NOT NULL;"))
        except Exception as e:
            logger.warning(f"Could not auto-add columns: {e}")
    logger.info("DB connection verified. Server ready.")


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