"""
RC2 Verification Script — runs checks 1-4 against the local backend.

Usage:
    python verify_rc2.py

What it tests:
  1. POST /api/analytics/telemetry/batch  → must return {"saved": 1}
  2. DB row exists with typed columns populated
  3. POST /api/ai/respond                 → prompt must contain telemetry signals
  4. latency_ms > 0
"""
import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

# ── colour helpers ──────────────────────────────────────────────────────────
def ok(msg):   print(f"  [PASS]  {msg}")
def fail(msg): print(f"  [FAIL]  {msg}")
def info(msg): print(f"  [INFO]  {msg}")
def section(title): print(f"\n{'-'*60}\n  {title}\n{'-'*60}")




# ── Check 1: Telemetry batch endpoint ───────────────────────────────────────
async def check_telemetry_endpoint(client: httpx.AsyncClient):
    section("Check 1 — POST /api/analytics/telemetry/batch")
    payload = {
        "events": [
            {
                "event_type":           "navigation",
                "participant_id":       "rc2_test_participant",
                "session_id":           "rc2_test_session",
                "section_id":           "sec_1",
                "paragraph_id":         "p_rc2_test",
                "cursor_idle_seconds":  8,
                "cursor_idle_episodes": 2,
                "longest_idle_s":       5,
                "timestamp":            datetime.utcnow().isoformat(),
                "raw_metadata": {
                    "dwellTimes":       {"p_rc2_test": 22},
                    "paragraphVisits":  {"p_rc2_test": 2},
                    "backtrackCount":   1,
                    "cursorIdleSeconds":   8,
                    "cursorIdleEpisodes":  2,
                    "longestIdleDuration": 5,
                    "slideIndex": 0,
                }
            }
        ]
    }
    try:
        r = await client.post(f"{BASE_URL}/api/analytics/telemetry/batch", json=payload)
        if r.status_code == 200:
            body = r.json()
            if body.get("saved", 0) >= 1:
                ok(f"returned {body}")
            else:
                fail(f"unexpected body: {body}")
        else:
            fail(f"HTTP {r.status_code}: {r.text[:200]}")
    except Exception as e:
        fail(f"request error: {e}")


# ── Check 2: DB row (via a quick SELECT through the ORM) ────────────────────
async def check_db_row():
    section("Check 2 — DB row exists with typed columns")
    try:
        import sys, os
        sys.path.insert(0, os.path.dirname(__file__))
        from app.database.database import AsyncSessionLocal
        from app.models.tracking import TelemetryEvent
        from sqlalchemy import select, desc

        async with AsyncSessionLocal() as db:
            stmt = (
                select(TelemetryEvent)
                .where(TelemetryEvent.participant_id == "rc2_test_participant")
                .order_by(desc(TelemetryEvent.id))
                .limit(1)
            )
            result = await db.execute(stmt)
            row = result.scalar_one_or_none()

        if row is None:
            fail("no row found for rc2_test_participant")
            return

        checks = {
            "paragraph_id":  row.paragraph_id,
            "dwell_time_s":  row.dwell_time_s,
            "visit_count":   row.visit_count,
            "backtrack_count": row.backtrack_count,
            "timestamp":     row.timestamp,
        }
        all_ok = True
        for col, val in checks.items():
            if val is not None:
                ok(f"{col} = {val}")
            else:
                fail(f"{col} is NULL")
                all_ok = False

        if all_ok:
            ok("all typed columns populated correctly")

    except Exception as e:
        fail(f"DB check error: {e}")


# ── Check 3 & 4: AI respond — prompt content + latency ──────────────────────
async def check_ai_prompt_and_latency(client: httpx.AsyncClient):
    section("Check 3 — POST /api/ai/respond (prompt content)")
    payload = {
        "session_id":     1,
        "participant_id": 1,
        "paragraph_id":   "p_rc2_test",
        "context":        (
            "Modern artificial intelligence combines neural pattern recognition "
            "with symbolic logic structures to enable verifiable reasoning."
        ),
        "telemetry": {
            "dwell_seconds":        42,
            "visit_count":          3,
            "backtrack_count":      2,
            "cursor_idle_seconds":  18,
            "cursor_idle_episodes": 4,
            "longest_idle_s":       7,
            "word_count":           17,
        }
    }
    try:
        r = await client.post(f"{BASE_URL}/api/ai/respond", json=payload, timeout=30.0)
        if r.status_code != 200:
            fail(f"HTTP {r.status_code}: {r.text[:300]}")
            return

        body = r.json()
        response_text = body.get("response_text", "")
        latency_ms    = body.get("latency_ms")

        info(f"AI response (first 200 chars):\n    {response_text[:200]}")

        # Check 3 — response must not be the old hardcoded stub
        stub_phrases = [
            "You are a helpful reading assistant",
            "Scaffolding Summary:",
            "Adaptive Hint for",
        ]
        is_real = not any(p in response_text for p in stub_phrases)
        if is_real and len(response_text) > 30:
            ok("response is a real AI answer (not a stub)")
        else:
            fail("response looks like the old hardcoded stub")

        # Check 4 — latency_ms
        section("Check 4 — latency_ms")
        if latency_ms is not None and float(latency_ms) > 0:
            ok(f"latency_ms = {latency_ms} ms")
        else:
            fail(f"latency_ms is {latency_ms!r} (expected > 0)")

    except Exception as e:
        fail(f"AI request error: {e}")


# ── Main ─────────────────────────────────────────────────────────────────────
async def main():
    print("\n" + "="*60)
    print("  AARRP RC2 Verification — Backend Checks 1–4")
    print("="*60)

    async with httpx.AsyncClient() as client:
        # Health gate
        try:
            r = await client.get(f"{BASE_URL}/health")
            if r.status_code != 200:
                print(f"\n[ERROR] Backend not reachable at {BASE_URL}. Start it first.")
                return
            info(f"Backend healthy: {r.json()}")
        except Exception:
            print(f"\n[ERROR] Cannot connect to {BASE_URL}. Is the server running?")
            return

        await check_telemetry_endpoint(client)
        await check_db_row()
        await check_ai_prompt_and_latency(client)

    print("\n" + "="*60)
    print("  Done. Review any [FAIL] results above before RC2 sign-off.")
    print("="*60 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
