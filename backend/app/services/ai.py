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

async def evaluate_eligibility(req: schemas.InterventionEligibilityRequest, db: AsyncSession) -> schemas.InterventionEligibilityResponse:
    stmt = select(Paragraph).where(Paragraph.id == req.paragraph_id)
    result = await db.execute(stmt)
    paragraph = result.scalar_one_or_none()
    
    if not paragraph:
        raise HTTPException(status_code=404, detail="Paragraph not found")
        
    # Real logic: only trigger if paragraph is configured to
    return schemas.InterventionEligibilityResponse(
        eligible=paragraph.is_intervention_trigger, 
        struggle_score=1.0 if paragraph.is_intervention_trigger else 0.0
    )

async def generate_ai_response(req: schemas.AIResponseRequest, db: AsyncSession) -> schemas.AIResponse:
    stmt = select(Session).where(Session.id == req.session_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    client = groq.AsyncGroq(api_key=settings.groq_api_key)
    
    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful reading assistant."
                },
                {
                    "role": "user",
                    "content": req.context
                }
            ],
            model="llama-3.3-70b-versatile"
        )
        response_text = chat_completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
        
    new_intervention = AIIntervention(
        session_id=session.id,
        version_id=session.version_id,
        paragraph_id=req.paragraph_id,
        trigger_reason="participant_struggle",
        generated_text=response_text
    )
    db.add(new_intervention)
    await db.commit()
    
    return schemas.AIResponse(response_text=response_text)

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
