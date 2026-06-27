import asyncio
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from sqlalchemy.ext.asyncio import async_engine_from_config
from app.database.base import Base
import app.models.admin
import app.models.content
import app.models.experiments
import app.models.participant
import app.models.tracking

from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import AsyncConnection
from alembic import context
from app.config.settings import settings

config = context.config
db_url = settings.database_url.replace("postgresql://", "postgresql+asyncpg://")
db_url = db_url.replace("%", "%%")
config.set_main_option("sqlalchemy.url", db_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

def do_run_migrations(connection: AsyncConnection):
    context.configure(
        connection=connection, 
        target_metadata=Base.metadata,
        compare_type=True
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations():
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
        
    await connectable.dispose()

if context.is_offline_mode():
    pass
else:
    asyncio.run(run_async_migrations())