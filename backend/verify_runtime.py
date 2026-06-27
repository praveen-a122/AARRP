import asyncio
import httpx
import subprocess
import time
import os

async def run_verification():
    errors = []
    print("1. Verifying imports...")
    try:
        import app.main
        print("Imports resolved successfully.")
    except Exception as e:
        errors.append(f"Import Error: {e}")

    print("\n2. Executing database migrations...")
    result = subprocess.run(["alembic", "revision", "--autogenerate", "-m", "verify"], capture_output=True, text=True)
    if result.returncode != 0:
        errors.append(f"Migration Error: {result.stderr.strip()}")
    else:
        print("Migrations generated successfully.")

    print("\n3. Starting backend for API verification...")
    process = subprocess.Popen(["uvicorn", "app.main:app", "--port", "8001"])
    time.sleep(3) # Wait for startup

    print("\n4. Verifying Health Endpoint...")
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get("http://127.0.0.1:8001/health")
            if resp.status_code == 200:
                print("Health endpoint responded correctly.")
            else:
                errors.append(f"Health Endpoint Error: Status {resp.status_code}")
        except Exception as e:
            errors.append(f"Health Endpoint Request Failed: {e}")

        print("\n5. Verifying Core API Routes...")
        # Test CMS create experiment
        try:
            resp = await client.post("http://127.0.0.1:8001/api/cms/experiment", json={"title": "Test Exp", "config": {}})
            if resp.status_code == 200:
                print("CMS API responded correctly.")
            else:
                errors.append(f"CMS API Error: Status {resp.status_code} - {resp.text}")
        except Exception as e:
            errors.append(f"CMS API Request Failed: {e}")

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
