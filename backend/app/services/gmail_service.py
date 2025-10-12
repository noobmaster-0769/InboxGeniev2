# backend/app/services/gmail_service.py
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import Flow
from app.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
from app.utils.crypto import encrypt_text, decrypt_text
from app.models import User, Email
from sqlalchemy.orm import Session
from typing import List, Optional

def exchange_code_and_store_tokens(code: str, db: Session) -> dict:
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=[
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.send",
        ],
        redirect_uri=GOOGLE_REDIRECT_URI,
    )
    flow.fetch_token(code=code)
    creds = flow.credentials

    # fetch user profile using oauth2 v2
    oauth2 = build("oauth2", "v2", credentials=creds)
    profile = oauth2.userinfo().get().execute()
    email = profile.get("email")
    google_id = profile.get("id")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, google_id=google_id)

    # store encrypted tokens (refresh_token may be None if previously granted)
    if getattr(creds, "refresh_token", None):
        user.enc_refresh_token = encrypt_text(creds.refresh_token)
    if getattr(creds, "token", None):
        user.enc_access_token = encrypt_text(creds.token)

    db.add(user)
    db.commit()
    db.refresh(user)
    return {"email": user.email}

def build_credentials_from_user(user: User) -> Credentials:
    refresh_token = decrypt_text(user.enc_refresh_token) if user.enc_refresh_token else None
    access_token = decrypt_text(user.enc_access_token) if user.enc_access_token else None

    creds = Credentials(
        token=access_token,
        refresh_token=refresh_token,
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        token_uri="https://oauth2.googleapis.com/token",
    )
    return creds

class GmailService:
    def __init__(self, user: User):
        creds = build_credentials_from_user(user)
        self.service = build("gmail", "v1", credentials=creds)

    def fetch_messages_metadata(self, max_results: int = 20) -> List[dict]:
        resp = self.service.users().messages().list(userId="me", maxResults=max_results, labelIds=["INBOX"]).execute()
        return resp.get("messages", [])

    def get_message(self, msg_id: str, format: str = "full") -> dict:
        return self.service.users().messages().get(userId="me", id=msg_id, format=format).execute()

    def fetch_and_store_inbox(self, db: Session, user: User, max_results: int = 20):
        messages = self.fetch_messages_metadata(max_results=max_results)
        saved = []
        for m in messages:
            mid = m.get("id")
            exists = db.query(Email).filter(Email.message_id == mid).first()
            if exists:
                continue
            msg = self.get_message(mid, format="full")
            headers = {h["name"]: h["value"] for h in msg.get("payload", {}).get("headers", [])}
            subject = headers.get("Subject", "")
            sender = headers.get("From", "")
            snippet = msg.get("snippet", "")
            email_row = Email(
                message_id=mid,
                user_id=user.id,
                sender=sender,
                subject=subject,
                snippet=snippet,
                labels="INBOX",
            )
            db.add(email_row)
            saved.append(email_row)
        db.commit()
        return saved

    def send_raw_message(self, raw_b64: str):
        body = {"raw": raw_b64}
        return self.service.users().messages().send(userId="me", body=body).execute()
