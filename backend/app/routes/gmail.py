from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Email
from app.services.gmail_service import GmailService

router = APIRouter()

@router.get("/inbox")
def get_inbox(db: Session = Depends(get_db)):
    """
    Fetches the inbox for the first user found in the database.
    NOTE: In a real application, you would get the user from an
          authentication dependency (e.g., a JWT token).
    """
    # For now, just get the first user to demonstrate functionality
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")

    gmail_service = GmailService(user)
    
    # Fetch and store new emails, then return all emails for the user
    gmail_service.fetch_and_store_inbox(db, user, max_results=25)
    
    # Return all emails from the database for this user
    emails = user.emails
    return {"emails": emails}

@router.post("/archive/{email_id}")
def archive_email(email_id: str, db: Session = Depends(get_db)):
    """Archive an email"""
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    email = db.query(Email).filter(Email.message_id == email_id, Email.user_id == user.id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update email status to archived
    email.status = "archived"
    db.commit()
    
    return {"success": True, "message": "Email archived successfully"}

@router.post("/trash/{email_id}")
def trash_email(email_id: str, db: Session = Depends(get_db)):
    """Move an email to trash"""
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    email = db.query(Email).filter(Email.message_id == email_id, Email.user_id == user.id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update email status to trashed
    email.status = "trashed"
    db.commit()
    
    return {"success": True, "message": "Email moved to trash successfully"}

@router.post("/inbox/{email_id}")
def move_to_inbox(email_id: str, db: Session = Depends(get_db)):
    """Move an email back to inbox"""
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found in the database. Please login first.")
    
    email = db.query(Email).filter(Email.message_id == email_id, Email.user_id == user.id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Update email status to inbox
    email.status = "inbox"
    db.commit()
    
    return {"success": True, "message": "Email moved to inbox successfully"}

@router.post("/mark-read/{email_id}")
def mark_email_read(email_id: str, db: Session = Depends(get_db)):
    """Mark an email as read"""
    user = db.query(User).first()
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
    user = db.query(User).first()
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
