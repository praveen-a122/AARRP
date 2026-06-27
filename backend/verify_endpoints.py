"""
Runtime verification: Participant, Admin, CMS endpoints.
Assumes the backend is already running on port 8000 (started separately).
"""
import asyncio
import httpx
import sys

BASE = "http://127.0.0.1:8000"

async def test_all():
    results = {}

    async with httpx.AsyncClient(timeout=30) as client:
        # ── /health ──────────────────────────────────────────────────
        try:
            r = await client.get(f"{BASE}/health")
            results["/health"] = (r.status_code, r.text)
        except Exception as e:
            results["/health"] = ("EXC", f"{type(e).__name__}: {e}")

        # ── /health/db ───────────────────────────────────────────────
        try:
            r = await client.get(f"{BASE}/health/db")
            results["/health/db"] = (r.status_code, r.text)
        except Exception as e:
            results["/health/db"] = ("EXC", f"{type(e).__name__}: {e}")

        # ── 1. Participant Registration ───────────────────────────────
        try:
            r = await client.post(f"{BASE}/api/participant/register", json={"demographics": {}})
            results["/api/participant/register"] = (r.status_code, r.text)
        except Exception as e:
            results["/api/participant/register"] = ("EXC", f"{type(e).__name__}: {e}")

        # ── 2. Admin Create ──────────────────────────────────────────
        try:
            r = await client.post(
                f"{BASE}/api/admin/create",
                json={"username": "verifytest2", "email": "v2@test.com", "password": "pass1234", "role": "admin"}
            )
            results["/api/admin/create"] = (r.status_code, r.text)
        except Exception as e:
            results["/api/admin/create"] = ("EXC", f"{type(e).__name__}: {e}")

        # ── 3. CMS Create Experiment ─────────────────────────────────
        try:
            r = await client.post(
                f"{BASE}/api/cms/experiment",
                json={"title": "Verification Run", "description": "test", "config": {}}
            )
            results["/api/cms/experiment"] = (r.status_code, r.text)
        except Exception as e:
            results["/api/cms/experiment"] = ("EXC", f"{type(e).__name__}: {e}")

    print("\n=== RESULTS ===")
    all_passed = True
    for endpoint, (status, body) in results.items():
        ok = str(status).startswith("2")
        flag = "PASS" if ok else "FAIL"
        print(f"[{flag}] {endpoint}: {status} -- {body[:300]}")
        if not ok:
            all_passed = False

    print("\n" + ("ALL PASSED" if all_passed else "FAILURES DETECTED"))
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    asyncio.run(test_all())
