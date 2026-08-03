import json

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import ValidationError
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas import UserCreate, UserOut

router = APIRouter(tags=["User"])


@router.post("/save-user", response_model=UserOut)
async def save_user(request: Request, db: Session = Depends(get_db)):
    try:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            payload_data = await request.json()
        elif "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
            payload_data = dict(await request.form())
        else:
            raw_body = await request.body()
            try:
                payload_data = json.loads(raw_body.decode("utf-8"))
            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail="Unsupported request content type or invalid JSON payload.",
                )

        payload = UserCreate.model_validate(payload_data)
        user = models.User(
            name=payload.name.strip(),
            email=payload.email.lower().strip(),
            phone=payload.phone.strip(),
            city=payload.city.strip(),
            state=payload.state.strip(),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=exc.errors()) from exc
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save user details") from exc
