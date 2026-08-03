from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas import LeadCreate, LeadOut

router = APIRouter(tags=["Lead"])


@router.post("/lead", response_model=LeadOut)
def create_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    try:
        lead = models.Lead(
            user_id=payload.user_id,
            session_id=payload.session_id,
            interest_topic=payload.interest_topic,
            contact_method=payload.contact_method,
            status="new",
        )
        db.add(lead)

        if payload.session_id:
            session = db.query(models.ChatSession).filter_by(id=payload.session_id).first()
            if session:
                session.lead_prompted = True

        db.commit()
        db.refresh(lead)
        return lead
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save lead") from exc
