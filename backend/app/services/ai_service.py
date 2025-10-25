# backend/app/services/ai_service.py
import os
import logging
import json
from typing import Dict, List
from app.config import GEMINI_API_KEY

logger = logging.getLogger("inboxgenie.ai")

try:
    import google.generativeai as genai
    _GEMINI_AVAILABLE = True
except Exception:
    _GEMINI_AVAILABLE = False

def get_gemini_client(api_key):
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-2.5-flash')

class AIService:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        if _GEMINI_AVAILABLE:
            self.client = get_gemini_client(self.api_key)
        else:
            self.client = None

    def classify(self, text: str) -> Dict:
        """Classify email into categories: IMPORTANT, PROMOTION, GENERAL, SPAM"""
        if _GEMINI_AVAILABLE and self.client:
            prompt = f"""Analyze the email content and classify it into one of these categories: IMPORTANT, PROMOTION, GENERAL, SPAM.\nReturn ONLY a JSON object with 'label' and 'score' fields. Example: {{\"label\": \"IMPORTANT\", \"score\": 0.95}}\n\nEmail:\nSubject: {text.get('subject', 'No subject')}\nContent: {text.get('content', text.get('snippet', ''))}\n"""
            try:
                response = self.client.generate_content(prompt)
                content = response.text.strip()
                try:
                    result = json.loads(content)
                    return {"label": result.get("label", "GENERAL"), "score": result.get("score", 0.5)}
                except json.JSONDecodeError:
                    if "IMPORTANT" in content.upper():
                        return {"label": "IMPORTANT", "score": 0.8}
                    elif "PROMOTION" in content.upper():
                        return {"label": "PROMOTION", "score": 0.8}
                    elif "SPAM" in content.upper():
                        return {"label": "SPAM", "score": 0.8}
                    else:
                        return {"label": "GENERAL", "score": 0.6}
            except Exception as e:
                logger.exception(f"Gemini classify failed: {e}; falling back to heuristic.")
        # Fallback heuristic classification
        text_str = str(text).lower()
        if any(word in text_str for word in ["unsubscribe", "sale", "promo", "discount", "offer", "deal"]):
            return {"label": "PROMOTION", "score": 0.9}
        if any(word in text_str for word in ["urgent", "deadline", "asap", "important", "meeting", "deadline"]):
            return {"label": "IMPORTANT", "score": 0.9}
        if any(word in text_str for word in ["congratulations", "winner", "free money", "click here", "verify account"]):
            return {"label": "SPAM", "score": 0.95}
        return {"label": "GENERAL", "score": 0.6}

    def summarize(self, text: str) -> str:
        """Generate a concise summary of the email content"""
        if _GEMINI_AVAILABLE and self.client:
            prompt = f"""You are an email summarizer. Provide a concise 1-2 sentence summary that captures the main points and action items. Be specific and actionable. Summarize this email:\n\n{text}\n"""
            try:
                response = self.client.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                logger.exception(f"Gemini summarize failed: {e}; falling back to truncation.")
        # Fallback: truncate to first 200 characters
        if not text:
            return ""
        return (text[:200] + "...") if len(text) > 200 else text

    def rewrite_tone(self, text: str, tone: str = "professional") -> str:
        """Rewrite email content in the specified tone"""
        if _GEMINI_AVAILABLE and self.client:
            tone_instructions = {
                "professional": "professional and business-appropriate",
                "casual": "casual and friendly",
                "formal": "formal and respectful",
                "friendly": "warm and approachable"
            }
            instruction = tone_instructions.get(tone.lower(), "professional")
            enhanced_prompt = f"""You are an expert email writer. Rewrite and expand the following email content in a {instruction} tone.\nOriginal content: {text}\nGenerate a complete, well-structured email:\n"""
            try:
                response = self.client.generate_content(enhanced_prompt)
                return response.text.strip()
            except Exception as e:
                logger.exception(f"Gemini rewrite failed: {e}; falling back to simple formatting.")
        # Fallback: simple tone adjustments
        if tone.lower() == "formal":
            return f"Dear Sir/Madam,\n\n{text}\n\nSincerely,\n[Your Name]"
        elif tone.lower() == "casual":
            return f"Hey!\n\n{text}\n\nThanks!"
        elif tone.lower() == "friendly":
            return f"Hi there!\n\n{text}\n\nBest regards!"
        return text

    def generate_auto_reply(self, original_email: str, context: str = "") -> str:
        """Generate an automatic reply based on the original email"""
        if _GEMINI_AVAILABLE and self.client:
            prompt = f"""You are an AI assistant that generates appropriate email replies. Create a professional, helpful response that acknowledges the original message and provides relevant information or next steps. Keep it concise (2-3 sentences).\n\nEmail:\n{original_email}\n\nContext:\n{context}\n"""
            try:
                response = self.client.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                logger.exception(f"Gemini auto-reply failed: {e}; falling back to generic response.")
        # Fallback: generic acknowledgment
        return "Thank you for your email. I have received your message and will get back to you as soon as possible."

    def generate_smart_reply(self, original_email: str) -> List[str]:
        """Generate multiple smart reply options"""
        if _GEMINI_AVAILABLE and self.client:
            prompt = f"""You are an AI assistant that generates smart reply options for emails. Provide 3 short, professional reply options (1-2 sentences each) that would be appropriate responses to the original email. Return them as a JSON array of strings.\n\nEmail:\n{original_email}\n"""
            try:
                response = self.client.generate_content(prompt)
                content = response.text.strip()
                try:
                    replies = json.loads(content)
                    if isinstance(replies, list):
                        return replies[:3]
                    else:
                        return [content]
                except json.JSONDecodeError:
                    lines = [line.strip() for line in content.split('\n') if line.strip()]
                    return lines[:3]
            except Exception as e:
                logger.exception(f"Gemini smart reply failed: {e}; falling back to generic options.")
        # Fallback: generic smart replies
        return [
            "Thank you for your email. I'll review this and get back to you soon.",
            "Got it! I'll take care of this and update you accordingly.",
            "Thanks for reaching out. I'll look into this and respond with more details."
        ]
ai_service = AIService()
