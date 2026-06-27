import asyncio
import httpx
import time
import subprocess
import time

async def run_tests():
    print("Starting backend...")
    process = subprocess.Popen(["uvicorn", "app.main:app", "--port", "8000"])
    time.sleep(3)
    
    errors = []
    print("\nVerifying Core API Routes...")
    async with httpx.AsyncClient() as client:
        # 1. CMS - Create Experiment
        try:
            resp = await client.post("http://127.0.0.1:8000/api/cms/experiment", json={"title": "Test", "config": {}})
            print(f"CMS Create Experiment: {resp.status_code} - {resp.text}")
            if resp.status_code >= 500: errors.append(f"CMS error: {resp.text}")
        except Exception as e: errors.append(f"CMS Exception: {e}")

        # 2. Auth/Admin - Create Admin
        try:
            resp = await client.post("http://127.0.0.1:8000/api/admin/create", json={"username": "test", "email": "test@test.com", "password": "pass", "role": "admin"})
            print(f"Admin Create: {resp.status_code} - {resp.text}")
            if resp.status_code >= 500: errors.append(f"Admin error: {resp.text}")
        except Exception as e: errors.append(f"Admin Exception: {e}")

        # 3. Participant - Register
        try:
            resp = await client.post("http://127.0.0.1:8000/api/participant/register", json={"demographics": {}})
            print(f"Participant Register: {resp.status_code} - {resp.text}")
            if resp.status_code >= 500: errors.append(f"Participant error: {resp.text}")
        except Exception as e: errors.append(f"Participant Exception: {e}")

    process.terminate()
    process.wait()
    if errors:
        print("Errors found:")
        for e in errors: print(e)
    else:
        print("All core endpoints tested without 500 Internal Server Errors.")

if __name__ == "__main__":
    asyncio.run(run_tests())
