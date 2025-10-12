# backend/app/routes/ai.py
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import ai_service

router = APIRouter()

class TextIn(BaseModel):
    text: str

class ToneIn(BaseModel):
    text: str
    tone: str

@router.post("/classify")
def classify_text(payload: TextIn):
    return ai_service.classify(payload.text)

@router.post("/summarize")
def summarize_text(payload: TextIn):
    return {"summary": ai_service.summarize(payload.text)}

@router.post("/rewrite")
def rewrite(payload: ToneIn):
    return {"rewritten": ai_service.rewrite_tone(payload.text, payload.tone)}
