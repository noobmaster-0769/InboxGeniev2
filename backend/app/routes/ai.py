# backend/app/routes/ai.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.ai_service import ai_service

router = APIRouter()

class TextIn(BaseModel):
    text: str

class ToneIn(BaseModel):
    text: str
    tone: str

class EmailIn(BaseModel):
    subject: Optional[str] = None
    content: Optional[str] = None
    snippet: Optional[str] = None

class AutoReplyIn(BaseModel):
    original_email: str
    context: Optional[str] = ""

@router.post("/classify")
def classify_email(email_data: EmailIn):
    """Classify email into IMPORTANT, PROMOTION, GENERAL, or SPAM"""
    try:
        result = ai_service.classify(email_data.dict())
        return {
            "success": True,
            "classification": result["label"],
            "confidence": result["score"],
            "message": f"Email classified as {result['label']} with {result['score']:.2f} confidence"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

@router.post("/summarize")
def summarize_email(text_input: TextIn):
    """Generate a concise summary of email content"""
    try:
        summary = ai_service.summarize(text_input.text)
        return {
            "success": True,
            "summary": summary,
            "message": "Email summarized successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@router.post("/rewrite")
def rewrite_tone(tone_input: ToneIn):
    """Rewrite email content in specified tone"""
    try:
        rewritten = ai_service.rewrite_tone(tone_input.text, tone_input.tone)
        return {
            "success": True,
            "rewritten_text": rewritten,
            "tone": tone_input.tone,
            "message": f"Email rewritten in {tone_input.tone} tone"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tone rewriting failed: {str(e)}")

@router.post("/auto-reply")
def generate_auto_reply(auto_reply_input: AutoReplyIn):
    """Generate an automatic reply based on original email"""
    try:
        reply = ai_service.generate_auto_reply(auto_reply_input.original_email, auto_reply_input.context)
        return {
            "success": True,
            "reply": reply,
            "message": "Auto-reply generated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auto-reply generation failed: {str(e)}")

@router.post("/smart-reply")
def generate_smart_replies(text_input: TextIn):
    """Generate multiple smart reply options"""
    try:
        replies = ai_service.generate_smart_reply(text_input.text)
        return {
            "success": True,
            "replies": replies,
            "message": f"Generated {len(replies)} smart reply options"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Smart reply generation failed: {str(e)}")

@router.get("/health")
def ai_health_check():
    """Check if AI service is working"""
    return {
        "success": True,
        "provider": ai_service.provider,
        "openai_available": ai_service.client is not None,
        "message": "AI service is operational"
    }

@router.post("/process-emails")
def process_emails_async():
    """Trigger async processing of all unprocessed emails"""
    from celery_app import process_new_emails_async
    
    try:
        task = process_new_emails_async.delay()
        return {
            "success": True,
            "task_id": task.id,
            "message": "Email processing started in background"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start email processing: {str(e)}")

@router.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    """Get the status of a Celery task"""
    from celery_app import celery_app
    
    try:
        task_result = celery_app.AsyncResult(task_id)
        return {
            "task_id": task_id,
            "status": task_result.status,
            "result": task_result.result if task_result.ready() else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get task status: {str(e)}")
