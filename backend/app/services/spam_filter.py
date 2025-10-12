# backend/app/services/spam_filter.py
import re

SPAM_KEYWORDS = [
    "lottery", "win money", "click here", "congratulations", "free gift",
    "unsubscribe", "buy now", "limited time", "act now"
]

def classify_email(subject: str | None, body: str | None) -> bool:
    text = ((subject or "") + " " + (body or "")).lower()
    for kw in SPAM_KEYWORDS:
        if re.search(rf"\b{re.escape(kw)}\b", text):
            return True
    return False
