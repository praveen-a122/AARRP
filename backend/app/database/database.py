from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool
from app.config.settings import settings
import re

# Normalise URL to asyncpg driver scheme
db_url = settings.database_url
for prefix in ("postgres://", "postgresql://"):
    if db_url.startswith(prefix):
        db_url = "postgresql+asyncpg://" + db_url[len(prefix):]
        break

# NOTE on PgBouncer compatibility:
# - Local dev / Railway uses session-mode pooling (port 5432) — prepared statements work fine.
# - If you switch to transaction-mode PgBouncer (port 6543), you must also add
#   ?statement_cache_size=0 to the asyncpg URL or set it in Railway env vars.
engine = create_async_engine(
    db_url,
    poolclass=NullPool,
)

AsyncSessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    bind=engine,
    class_=AsyncSession,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()