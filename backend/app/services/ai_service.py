# backend/app/services/ai_service.py
import os
import logging
from typing import Dict
from app.config import AI_PROVIDER, AI_API_KEY

logger = logging.getLogger("inboxgenie.ai")

try:
    import openai
    _OPENAI_AVAILABLE = True
    if AI_API_KEY:
        openai.api_key = AI_API_KEY
except Exception:
    _OPENAI_AVAILABLE = False

class AIService:
    def __init__(self):
        self.provider = (AI_PROVIDER or "mock").lower()
        self.api_key = AI_API_KEY

    def classify(self, text: str) -> Dict:
        if self.provider == "openai" and _OPENAI_AVAILABLE and self.api_key:
            try:
                resp = openai.ChatCompletion.create(
                    model="gpt-4o-mini" if False else "gpt-4o",  # example; adjust to available model
                    messages=[
                        {"role": "system", "content": "You are an email classifier. Return JSON like {\"label\":\"...\",\"score\":...}."},
                        {"role": "user", "content": f"Classify this email text: {text}"}
                    ],
                    max_tokens=150,
                    temperature=0.0
                )
                content = resp["choices"][0]["message"]["content"]
                import json
                try:
                    return json.loads(content)
                except Exception:
                    return {"label": content.strip(), "score": 0.5}
            except Exception:
                logger.exception("OpenAI classify failed; falling back to mock.")
        # fallback heuristic
        low = (text or "").lower()
        if "unsubscribe" in low or "sale" in low or "promo" in low:
            return {"label": "PROMOTION", "score": 0.9}
        if "urgent" in low or "deadline" in low or "asap" in low:
            return {"label": "IMPORTANT", "score": 0.95}
        return {"label": "GENERAL", "score": 0.6}

    def summarize(self, text: str) -> str:
        if self.provider == "openai" and _OPENAI_AVAILABLE and self.api_key:
            try:
                resp = openai.ChatCompletion.create(
                    model="gpt-4o-mini" if False else "gpt-4o",
                    messages=[
                        {"role": "system", "content": "You are a summarizer. Provide a short summary."},
                        {"role": "user", "content": f"Summarize: {text}"}
                    ],
                    max_tokens=200,
                    temperature=0.2
                )
                return resp["choices"][0]["message"]["content"].strip()
            except Exception:
                logger.exception("OpenAI summarize failed; falling back.")
        if not text:
            return ""
        return (text[:240] + "...") if len(text) > 240 else text

    def rewrite_tone(self, text: str, tone: str = "formal") -> str:
        if self.provider == "openai" and _OPENAI_AVAILABLE and self.api_key:
            try:
                prompt = f"Rewrite this email in a {tone} tone. Keep meaning and be concise:\n\n{text}"
                resp = openai.ChatCompletion.create(
                    model="gpt-4o-mini" if False else "gpt-4o",
                    messages=[
                        {"role": "system", "content": "You are an expert email editor."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=400,
                    temperature=0.3
                )
                return resp["choices"][0]["message"]["content"].strip()
            except Exception:
                logger.exception("OpenAI rewrite failed; falling back.")
        if tone == "formal":
            return "Dear Sir/Madam,\n\n" + text
        if tone == "casual":
            return "Hey — " + text
        return text

ai_service = AIService()
