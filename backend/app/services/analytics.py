from app.schemas import analytics as schemas
from app.models.participant import Participant
from app.models.tracking import TelemetryEvent
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException
from datetime import datetime
import json

async def get_dashboard_analytics(db: AsyncSession) -> schemas.AnalyticsDashboard:
    stmt_total = select(func.count()).select_from(Participant)
    total_participants = (await db.execute(stmt_total)).scalar() or 0
    
    stmt_completed = select(func.count()).select_from(Participant).where(Participant.status == "completed")
    completed_participants = (await db.execute(stmt_completed)).scalar() or 0
    
    stmt_active = select(func.count()).select_from(Participant).where(Participant.status == "enrolled")
    active_participants = (await db.execute(stmt_active)).scalar() or 0
    
    return schemas.AnalyticsDashboard(
        total_participants=total_participants,
        completed_participants=completed_participants,
        active_participants=active_participants,
        interrupted_sessions=0, # Blocked pending full tracking mapping
        avg_experiment_duration=0.0 # Blocked pending full tracking mapping
    )

async def get_participant_analytics(db: AsyncSession) -> list[schemas.AnalyticsParticipant]:
    raise HTTPException(status_code=501, detail="Participant analytics blocked pending full tracking mapping.")

async def get_experiment_analytics(db: AsyncSession) -> list[schemas.AnalyticsExperiment]:
    raise HTTPException(status_code=501, detail="Experiment analytics blocked pending full tracking mapping.")

async def generate_reports(db: AsyncSession) -> schemas.ReportResponse:
    raise HTTPException(status_code=501, detail="Report generation blocked.")


async def save_telemetry_batch(
    batch: schemas.TelemetryBatch,
    db: AsyncSession,
) -> dict:
    """Persist a batch of telemetry events from the frontend.

    For each event, the typed columns capture the metrics for that specific
    paragraph only. The dwellTimes map in raw_metadata may cover all paragraphs,
    but dwell_time_s is extracted for this paragraph's ID alone.
    """
    rows_saved = 0
    for ev in batch.events:
        # Extract per-paragraph dwell from the cumulative map if present
        meta = ev.raw_metadata or {}
        dwell_map: dict = meta.get("dwellTimes", {})
        visits_map: dict = meta.get("paragraphVisits", {})
        pid = ev.paragraph_id or ""

        dwell_time_s    = ev.dwell_time_s    if ev.dwell_time_s    is not None else dwell_map.get(pid)
        visit_count     = ev.visit_count     if ev.visit_count     is not None else visits_map.get(pid)
        backtrack_count = ev.backtrack_count if ev.backtrack_count is not None else meta.get("backtrackCount")

        row = TelemetryEvent(
            event_type           = ev.event_type,
            participant_id       = ev.participant_id,
            session_id           = ev.session_id,
            section_id           = ev.section_id,
            paragraph_id         = ev.paragraph_id,
            dwell_time_s         = int(dwell_time_s)     if dwell_time_s     is not None else None,
            visit_count          = int(visit_count)      if visit_count      is not None else None,
            backtrack_count      = int(backtrack_count)  if backtrack_count  is not None else None,
            cursor_idle_seconds  = ev.cursor_idle_seconds  if ev.cursor_idle_seconds  is not None else meta.get("cursorIdleSeconds"),
            cursor_idle_episodes = ev.cursor_idle_episodes if ev.cursor_idle_episodes is not None else meta.get("cursorIdleEpisodes"),
            longest_idle_s       = ev.longest_idle_s       if ev.longest_idle_s       is not None else meta.get("longestIdleDuration"),
            raw_metadata         = json.dumps(meta) if meta else None,
        )
        db.add(row)
        rows_saved += 1

    await db.commit()
    return {"saved": rows_saved}
