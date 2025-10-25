# backend/celery_app.py
from celery import Celery
from app.config import CELERY_BROKER_URL, CELERY_RESULT_BACKEND

celery_app = Celery("inboxgenie", broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)

@celery_app.task
def fetch_all_users_inboxes():
    from app.database import SessionLocal
    from app.models import User
    from app.services.gmail_service import GmailService
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for u in users:
            GmailService(u).fetch_and_store_inbox(db, u, max_results=10)
    finally:
        db.close()

@celery_app.task
def classify_email_async(email_id: int):
    """Asynchronously classify an email using AI"""
    from app.database import SessionLocal
    from app.models import Email
    from app.services.ai_service import ai_service
    from app.utils.crypto import encrypt_data
    
    db = SessionLocal()
    try:
        email = db.query(Email).filter(Email.id == email_id).first()
        if not email:
            return {"success": False, "error": "Email not found"}
        
        # Prepare email data for classification
        email_data = {
            "subject": email.subject or "",
            "content": email.snippet or "",
            "snippet": email.snippet or ""
        }
        
        # Classify the email
        result = ai_service.classify(email_data)
        
        # Store the encrypted classification result
        if result and "label" in result:
            encrypted_classification = encrypt_data(str(result))
            email.ai_classification_enc = encrypted_classification
            
            # Update spam status based on classification
            if result["label"] == "SPAM":
                email.is_spam = True
            
            db.commit()
            
            return {
                "success": True, 
                "email_id": email_id,
                "classification": result["label"],
                "confidence": result["score"]
            }
        else:
            return {"success": False, "error": "Classification failed"}
            
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}
    finally:
        db.close()

@celery_app.task
def summarize_email_async(email_id: int):
    """Asynchronously summarize an email using AI"""
    from app.database import SessionLocal
    from app.models import Email
    from app.services.ai_service import ai_service
    from app.utils.crypto import encrypt_data
    
    db = SessionLocal()
    try:
        email = db.query(Email).filter(Email.id == email_id).first()
        if not email:
            return {"success": False, "error": "Email not found"}
        
        # Prepare email content for summarization
        email_content = f"Subject: {email.subject or ''}\nContent: {email.snippet or ''}"
        
        # Generate summary
        summary = ai_service.summarize(email_content)
        
        if summary:
            # Store the encrypted summary
            encrypted_summary = encrypt_data(summary)
            email.ai_summary_enc = encrypted_summary
            db.commit()
            
            return {
                "success": True,
                "email_id": email_id,
                "summary": summary
            }
        else:
            return {"success": False, "error": "Summarization failed"}
            
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}
    finally:
        db.close()

@celery_app.task
def process_new_emails_async():
    """Process all new emails with AI classification and summarization"""
    from app.database import SessionLocal
    from app.models import Email
    
    db = SessionLocal()
    try:
        # Find emails that haven't been processed yet
        unprocessed_emails = db.query(Email).filter(
            Email.ai_classification_enc.is_(None)
        ).limit(50).all()
        
        results = []
        for email in unprocessed_emails:
            # Queue classification task
            classify_task = classify_email_async.delay(email.id)
            
            # Queue summarization task
            summarize_task = summarize_email_async.delay(email.id)
            
            results.append({
                "email_id": email.id,
                "classify_task_id": classify_task.id,
                "summarize_task_id": summarize_task.id
            })
        
        return {
            "success": True,
            "processed_count": len(results),
            "results": results
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        db.close()