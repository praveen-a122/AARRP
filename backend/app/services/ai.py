from app.schemas import ai as schemas
from app.models.tracking import AIIntervention, AIFeedback
from app.models.participant import Session
from app.models.content import Paragraph
from app.models.experiments import PromptTemplate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.config.settings import settings
import groq
from datetime import datetime
import time


# ─── Struggle inference helper ──────────────────────────────────────────────

def _infer_struggle_signals(t: schemas.ParticipantTelemetry) -> list[str]:
    """Return a list of plain-English struggle signals derived from telemetry.

    We avoid over-confident language: signals are *observations*, not diagnoses.
    """
    signals = []

    if t.dwell_seconds is not None and t.dwell_seconds > 30:
        signals.append(f"spent {t.dwell_seconds}s on this paragraph (longer than typical)")

    if t.visit_count is not None and t.visit_count > 1:
        rereads = t.visit_count - 1
        signals.append(f"returned to this paragraph {rereads} time(s)")

    if t.backtrack_count is not None and t.backtrack_count > 0:
        signals.append(f"navigated backwards {t.backtrack_count} time(s) this session")

    if t.cursor_idle_seconds is not None and t.cursor_idle_seconds > 10:
        signals.append(
            f"cursor was idle for {t.cursor_idle_seconds}s "
            f"across {t.cursor_idle_episodes or '?'} episode(s) "
            f"(longest: {t.longest_idle_s or '?'}s)"
        )

    if t.word_count and t.dwell_seconds and t.dwell_seconds > 0:
        wpm = round(t.word_count / (t.dwell_seconds / 60))
        if wpm < 80:
            signals.append(f"reading speed is ~{wpm} wpm (below average)")
        else:
            signals.append(f"reading speed is ~{wpm} wpm")

    if t.quiz_accuracy is not None:
        pct = round(t.quiz_accuracy * 100)
        signals.append(f"quiz accuracy so far: {pct}%")

    return signals


def _build_prompt(req: schemas.AIResponseRequest) -> str:
    """Build an adaptive system + user prompt pair.

    Returns a single string used as the user message; the system message
    sets the tutor persona and constraints.
    """
    t = req.telemetry
    lines = [
        f"Paragraph the participant is reading:",
        f'"""{req.context}"""',
    ]

    if t:
        signals = _infer_struggle_signals(t)
        if signals:
            lines += [
                "",
                "Participant analytics (observations only — do not over-interpret):",
            ]
            for s in signals:
                lines.append(f"  • {s}")

        lines += [
            "",
            "Use these signals as evidence, not proof.",
            "If the signals do not strongly indicate difficulty, give a brief conceptual "
            "reinforcement rather than assuming the participant is confused.",
            "If signals do indicate difficulty, identify the most likely cause from: "
            "vocabulary / conceptual misunderstanding / attention loss / memory overload / sentence complexity.",
        ]

    lines += [
        "",
        "Give ONE concise adaptive hint (2–3 sentences maximum).",
        "Do NOT reveal the answer. Do NOT summarise the paragraph.",
        "Do NOT begin with 'I notice' or 'It seems'. Write directly.",
    ]
    return "\n".join(lines)


_SYSTEM_PROMPT = (
    "You are an adaptive reading tutor in a research study on AI-assisted reading comprehension. "
    "Your role is to give targeted, non-revealing hints that help participants understand challenging content. "
    "You have access to behavioural analytics about how the participant is reading. "
    "Use this data carefully — it is observational evidence, not a diagnosis."
)


# ─── Service functions ───────────────────────────────────────────────────────

async def evaluate_eligibility(req: schemas.InterventionEligibilityRequest, db: AsyncSession) -> schemas.InterventionEligibilityResponse:
    stmt = select(Paragraph).where(Paragraph.id == req.paragraph_id)
    result = await db.execute(stmt)
    paragraph = result.scalar_one_or_none()

    if not paragraph:
        raise HTTPException(status_code=404, detail="Paragraph not found")

    return schemas.InterventionEligibilityResponse(
        eligible=paragraph.is_intervention_trigger,
        struggle_score=1.0 if paragraph.is_intervention_trigger else 0.0
    )


async def generate_ai_response(req: schemas.AIResponseRequest, db: AsyncSession) -> schemas.AIResponse:
    # paragraph_id is now str — look up the integer FK only if needed for the DB row
    # For now we store the string ID directly in AIIntervention via a best-effort int cast
    para_id_int: int | None = None
    try:
        para_id_int = int(req.paragraph_id)
    except (ValueError, TypeError):
        para_id_int = None  # mock/string IDs like 'p_1' — skip FK lookup

    stmt = select(Session).where(Session.id == req.session_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    client = groq.AsyncGroq(api_key=settings.groq_api_key)
    user_message = _build_prompt(req)

    t0 = time.monotonic()
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user",   "content": user_message},
            ],
            model="llama-3.3-70b-versatile",
        )
        response_text = chat_completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    latency_ms = round((time.monotonic() - t0) * 1000, 1)

    new_intervention = AIIntervention(
        session_id=session.id,
        version_id=session.version_id,
        paragraph_id=para_id_int,        # None for string IDs — FK is nullable
        trigger_reason="participant_struggle",
        generated_text=response_text,
        latency_ms=latency_ms,
    )
    db.add(new_intervention)
    await db.commit()

    return schemas.AIResponse(response_text=response_text, latency_ms=latency_ms)


async def store_helpfulness_feedback(req: schemas.HelpfulnessFeedback, db: AsyncSession):
    stmt = select(AIIntervention).where(AIIntervention.id == req.intervention_id)
    result = await db.execute(stmt)
    intervention = result.scalar_one_or_none()

    if not intervention:
        raise HTTPException(status_code=404, detail="Intervention not found")

    new_feedback = AIFeedback(
        intervention_id=intervention.id,
        session_id=req.session_id,
        version_id=intervention.version_id,
        is_helpful=req.is_helpful
    )
    db.add(new_feedback)
    await db.commit()


async def get_intervention_history(participant_id: int, db: AsyncSession) -> list[schemas.InterventionHistoryItem]:
    raise HTTPException(status_code=501, detail="History view is blocked pending full tracking module mapping.")
