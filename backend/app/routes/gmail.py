from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import User, Email
from app.services.gmail_service import GmailService

router = APIRouter()

def get_current_user(db: Session) -> User:
    """Get the most recently logged-in user"""
    user = db.query(User).order_by(User.id.desc()).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    return user

@router.get("/inbox")
def get_inbox(db: Session = Depends(get_db)):
    """
    Fetches the inbox for the most recently logged-in user.
    """
    user = get_current_user(db)
    gmail_service = GmailService(user)
    
    # Fetch and store new emails, then return all emails for the user
    gmail_service.fetch_and_store_inbox(db, user, max_results=25)
    
    # Return all emails from the database for this user, properly serialized
    emails = db.query(Email).filter(Email.user_id == user.id).order_by(Email.created_at.desc()).all()
    
    # Convert to dictionary format for JSON serialization
    email_list = []
    for email in emails:
        email_dict = {
            "id": email.id,
            "message_id": email.message_id,
            "user_id": email.user_id,
            "sender": email.sender,
            "subject": email.subject,
            "snippet": email.snippet,
            "labels": email.labels,
            "ai_summary_enc": email.ai_summary_enc,
            "ai_classification_enc": email.ai_classification_enc,
            "is_spam": email.is_spam,
            "is_read": email.is_read,
            "status": email.status,
            "created_at": email.created_at.isoformat() if email.created_at else None
        }
        email_list.append(email_dict)
    
    return {"emails": email_list}

@router.post("/archive")
def archive_emails(request: dict, db: Session = Depends(get_db)):
    """Archive multiple emails"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    message_ids = request.get("message_ids", [])
    if not message_ids:
        raise HTTPException(status_code=400, detail="No message IDs provided")
    
    # Update email status to archived for all provided message IDs
    emails = db.query(Email).filter(Email.message_id.in_(message_ids), Email.user_id == user.id).all()
    
    for email in emails:
        email.status = "archived"
    
    db.commit()
    
    return {"success": True, "message": f"{len(emails)} emails archived successfully"}

@router.post("/archive/{email_id}")
def archive_email(email_id: str, db: Session = Depends(get_db)):
    """Archive a single email by database ID"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    email = db.query(Email).filter(Email.id == int(email_id), Email.user_id == user.id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update email status to archived
    email.status = "archived"
    db.commit()
    
    return {"success": True, "message": "Email archived successfully"}

@router.post("/trash")
def trash_emails(request: dict, db: Session = Depends(get_db)):
    """Move multiple emails to trash"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    message_ids = request.get("message_ids", [])
    if not message_ids:
        raise HTTPException(status_code=400, detail="No message IDs provided")
    
    # Update email status to trashed for all provided message IDs
    emails = db.query(Email).filter(Email.message_id.in_(message_ids), Email.user_id == user.id).all()
    
    for email in emails:
        email.status = "trashed"
    
    db.commit()
    
    return {"success": True, "message": f"{len(emails)} emails moved to trash successfully"}

@router.post("/trash/{email_id}")
def trash_email(email_id: str, db: Session = Depends(get_db)):
    """Move an email to trash by database ID"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    email = db.query(Email).filter(Email.id == int(email_id), Email.user_id == user.id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update email status to trashed
    email.status = "trashed"
    db.commit()
    
    return {"success": True, "message": "Email moved to trash successfully"}

@router.post("/inbox/{email_id}")
def move_to_inbox(email_id: str, db: Session = Depends(get_db)):
    """Move an email back to inbox by database ID"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    email = db.query(Email).filter(Email.id == int(email_id), Email.user_id == user.id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update email status to inbox
    email.status = "inbox"
    db.commit()
    
    return {"success": True, "message": "Email moved to inbox successfully"}

@router.post("/unarchive/{email_id}")
def unarchive_email(email_id: str, db: Session = Depends(get_db)):
    """Unarchive an email (move back to inbox)"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    email = db.query(Email).filter(Email.id == int(email_id), Email.user_id == user.id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update email status to inbox
    email.status = "inbox"
    db.commit()
    
    return {"success": True, "message": "Email unarchived successfully"}

@router.post("/restore/{email_id}")
def restore_email(email_id: str, db: Session = Depends(get_db)):
    """Restore an email from trash (move back to inbox)"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    email = db.query(Email).filter(Email.id == int(email_id), Email.user_id == user.id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update email status to inbox
    email.status = "inbox"
    db.commit()
    
    return {"success": True, "message": "Email restored successfully"}

@router.post("/mark-read/{email_id}")
def mark_email_read(email_id: str, db: Session = Depends(get_db)):
    """Mark an email as read"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    email = db.query(Email).filter(Email.message_id == email_id, Email.user_id == user.id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Mark email as read
    email.is_read = True
    db.commit()
    
    return {"success": True, "message": "Email marked as read successfully"}

@router.post("/send")
def send_email(email_data: dict, db: Session = Depends(get_db)):
    """Send an email via Gmail API"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    try:
        gmail_service = GmailService(user)
        
        # Extract email data
        to = email_data.get("to", "")
        subject = email_data.get("subject", "")
        body = email_data.get("body", "")
        
        if not to or not subject or not body:
            raise HTTPException(status_code=400, detail="Missing required fields: to, subject, body")
        
        # Create email message
        import base64
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        message = MIMEMultipart()
        message['to'] = to
        message['subject'] = subject
        message.attach(MIMEText(body, 'plain'))
        
        # Encode the message
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
        
        # Send the email
        result = gmail_service.send_raw_message(raw_message)
        
        # Store sent email in database for reference
        sent_email = Email(
            message_id=result.get('id', ''),
            user_id=user.id,
            sender=user.email,
            subject=f"Sent: {subject}",
            snippet=f"To: {to}",
            labels="SENT",
            status="sent",
            is_read=True
        )
        db.add(sent_email)
        db.commit()
        
        return {
            "success": True, 
            "message": "Email sent successfully",
            "message_id": result.get('id', ''),
            "to": to,
            "subject": subject
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@router.post("/drafts/save")
def save_draft(draft_data: dict, db: Session = Depends(get_db)):
    """Save an email as a draft"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    try:
        # Extract draft data
        to = draft_data.get("to", "")
        subject = draft_data.get("subject", "")
        body = draft_data.get("body", "")
        
        if not subject and not body:
            raise HTTPException(status_code=400, detail="Draft must have either subject or body")
        
        # Create draft email
        draft_email = Email(
            message_id=f"draft_{user.id}_{datetime.utcnow().timestamp()}",
            user_id=user.id,
            sender=user.email,
            subject=subject or "Draft",
            snippet=body[:200] if body else "Draft",
            labels="DRAFT",
            status="draft",
            is_draft=True,
            is_read=True
        )
        db.add(draft_email)
        db.commit()
        
        return {
            "success": True,
            "message": "Draft saved successfully",
            "draft_id": draft_email.id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save draft: {str(e)}")

@router.get("/drafts")
def get_drafts(db: Session = Depends(get_db)):
    """Get all draft emails for the user"""
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    try:
        # Get all draft emails for the user
        drafts = db.query(Email).filter(Email.user_id == user.id, Email.is_draft == True).order_by(Email.created_at.desc()).all()
        
        # Convert to dictionary format for JSON serialization
        draft_list = []
        for draft in drafts:
            draft_dict = {
                "id": draft.id,
                "message_id": draft.message_id,
                "user_id": draft.user_id,
                "sender": draft.sender,
                "subject": draft.subject,
                "snippet": draft.snippet,
                "labels": draft.labels,
                "is_draft": draft.is_draft,
                "status": draft.status,
                "created_at": draft.created_at.isoformat() if draft.created_at else None
            }
            draft_list.append(draft_dict)
        
        return {"drafts": draft_list}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch drafts: {str(e)}")
