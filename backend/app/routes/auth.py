from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
from google_auth_oauthlib.flow import Flow
from app.services.gmail_service import exchange_code_and_store_tokens
from app.models import User, Email

router = APIRouter()

# CORRECTED: Using full, explicit scope URLs to prevent mismatch errors.
SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
]

@router.get("/google/login")
def google_login():
    # Use the configured redirect URI from environment
    print(f"Using redirect URI: {GOOGLE_REDIRECT_URI}")
    
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )
    auth_url, _ = flow.authorization_url(prompt="consent", access_type="offline", include_granted_scopes="true")
    return RedirectResponse(auth_url)

@router.get("/google/callback")
def google_callback(request: Request, db: Session = Depends(get_db)):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing code")
    
    # Exchange code and store encrypted tokens + user
    user_info = exchange_code_and_store_tokens(code, db=db)
    
    # CORRECTED: Redirect to the frontend address (port 8080)
    return RedirectResponse("http://localhost:8080/?auth=success")

@router.post("/logout")
def logout(db: Session = Depends(get_db)):
    """Clear all user data when logging out"""
    try:
        # Get the most recently logged-in user
        user = db.query(User).order_by(User.id.desc()).first()
        if user:
            # Delete all emails for this user
            db.query(Email).filter(Email.user_id == user.id).delete()
            
            # Delete the user
            db.delete(user)
            db.commit()
            
            return {"success": True, "message": "Logged out successfully"}
        else:
            return {"success": True, "message": "No user to logout"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")

