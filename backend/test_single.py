import asyncio
import httpx
import subprocess
import sys
import time

async def test_cms_only():
    cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8003"]
    process = subprocess.Popen(cmd)
    time.sleep(6)
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            print("Sending POST /api/cms/experiment...")
            r = await client.post("http://127.0.0.1:8003/api/cms/experiment", json={"title": "Single Test", "description": "test", "config": {}})
            print("Response:", r.status_code, r.text)
    except Exception as e:
        print("Exception:", type(e).__name__, repr(e))
    finally:
        process.terminate()
        process.wait()

if __name__ == "__main__":
    asyncio.run(test_cms_only())
