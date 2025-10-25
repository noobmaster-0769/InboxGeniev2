# backend/app/models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    google_id = Column(String(255), unique=True, nullable=True)
    enc_refresh_token = Column(Text, nullable=True)
    enc_access_token = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    emails = relationship("Email", back_populates="owner", cascade="all, delete-orphan")

class Email(Base):
    __tablename__ = "emails"
    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(String(255), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    sender = Column(String(255))
    subject = Column(String(512))
    snippet = Column(Text)
    labels = Column(String(255))
    ai_summary_enc = Column(Text, nullable=True)        # encrypted summary
    ai_classification_enc = Column(Text, nullable=True) # encrypted classification
    is_spam = Column(Boolean, default=False)
    is_read = Column(Boolean, default=False)
    is_draft = Column(Boolean, default=False)
    status = Column(String(50), default="inbox")  # inbox, archived, trashed
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="emails")
