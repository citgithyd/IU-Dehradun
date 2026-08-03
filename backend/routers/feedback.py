from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas import FeedbackCreate

router = APIRouter(tags=["Feedback"])


@router.post("/feedback")
def submit_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    try:
        fb = models.Feedback(
            session_id=payload.session_id,
            message_id=payload.message_id,
            rating=payload.rating,
            comment=payload.comment,
        )
        db.add(fb)
        db.commit()
        return {"status": "ok"}
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save feedback") from exc
