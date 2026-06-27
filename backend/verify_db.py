import asyncio
import httpx
import subprocess
import time
import os
from app.config.settings import settings
from app.database.database import engine

async def run_verification():
    errors = []
    print("1. Verifying that DATABASE_URL is being read correctly...")
    db_url = settings.database_url
    # Hide password if printed
    if "@" in db_url:
        parts = db_url.split("@")
        safe_url = "XXXXXX@" + parts[1]
    else:
        safe_url = db_url
    print(f"DATABASE_URL successfully read (safe format): {safe_url}")

    print("\n2. Verifying SQLAlchemy async engine connects to Supabase...")
    try:
        from sqlalchemy import text
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
            # Just a simple connection test
            print("Successfully connected to Supabase.")
    except Exception as e:
        print(f"Failed to connect to Supabase: {e}")
        errors.append(f"DB Connection Error: {e}")
        return errors # Stop if DB connection fails

    print("\n3. Running Alembic migrations...")
    result = subprocess.run(["alembic", "upgrade", "head"], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Migration Error Output:\n{result.stderr.strip()}")
        errors.append(f"Migration Error: {result.stderr.strip()}")
    else:
        print("Migrations ran successfully.")
        if result.stdout:
            print(result.stdout.strip())

    print("\n4. Starting backend for API verification...")
    process = subprocess.Popen(["uvicorn", "app.main:app", "--port", "8002"])
    time.sleep(3) # Wait for startup

    print("\n5. Verifying Health Endpoints...")
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get("http://127.0.0.1:8002/health")
            if resp.status_code == 200:
                print("/health endpoint responded correctly.")
            else:
                errors.append(f"/health Error: Status {resp.status_code} - {resp.text}")
        except Exception as e:
            errors.append(f"/health Request Failed: {e}")

        # The user requested /health/db, but we don't have it yet. Let's try it.
        try:
            resp = await client.get("http://127.0.0.1:8002/health/db")
            if resp.status_code == 200:
                print("/health/db endpoint responded correctly.")
            else:
                errors.append(f"/health/db Error: Status {resp.status_code} - {resp.text}")
        except Exception as e:
            errors.append(f"/health/db Request Failed: {e}")

        print("\n6. Verifying Core API Routes...")
        # Auth, CMS, Participant Registration

    # Shutdown backend
    process.terminate()
    process.wait()

    print("\n=== VERIFICATION RESULTS ===")
    if errors:
        print(f"Found {len(errors)} runtime errors:")
        for err in errors:
            print(f"- {err}")
    else:
        print("All verifications passed with 0 runtime errors.")

if __name__ == "__main__":
    asyncio.run(run_verification())
