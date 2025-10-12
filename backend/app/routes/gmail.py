from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
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
