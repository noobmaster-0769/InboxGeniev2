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
