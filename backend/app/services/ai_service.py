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
        """Classify email into categories: URGENT, IMPORTANT, TASK, PROMOTION, SPAM, GRAY"""
        if _GEMINI_AVAILABLE and self.client:
            prompt = f"""Analyze the email content and classify it into one of these categories: URGENT, IMPORTANT, TASK, PROMOTION, SPAM, GRAY.

Categories:
- URGENT: Time-sensitive, requires immediate attention (deadlines, emergencies, urgent requests)
- IMPORTANT: Significant but not time-sensitive (meetings, important updates, business communications)
- TASK: Action items, assignments, work-related tasks, project updates
- PROMOTION: Marketing emails, sales, discounts, offers, newsletters
- SPAM: Suspicious, phishing, scam emails, unwanted promotional content
- GRAY: Unclear purpose, low priority, automated messages, notifications

Return ONLY a JSON object with 'label' and 'score' fields. Example: {{"label": "URGENT", "score": 0.95}}

Email:
Subject: {text.get('subject', 'No subject')}
Content: {text.get('content', text.get('snippet', ''))}
Sender: {text.get('sender', 'Unknown')}
"""
            try:
                response = self.client.generate_content(prompt)
                content = response.text.strip()
                
                # Clean up any markdown formatting
                if content.startswith('```json'):
                    content = content.replace('```json', '').replace('```', '').strip()
                elif content.startswith('```'):
                    content = content.replace('```', '').strip()
                
                try:
                    result = json.loads(content)
                    label = result.get("label", "GRAY")
                    score = result.get("score", 0.5)
                    
                    # Validate the label is one of our categories
                    valid_labels = ["URGENT", "IMPORTANT", "TASK", "PROMOTION", "SPAM", "GRAY"]
                    if label not in valid_labels:
                        label = "GRAY"
                    
                    return {"label": label, "score": score}
                except json.JSONDecodeError:
                    # Fallback parsing
                    content_upper = content.upper()
                    if "URGENT" in content_upper:
                        return {"label": "URGENT", "score": 0.8}
                    elif "IMPORTANT" in content_upper:
                        return {"label": "IMPORTANT", "score": 0.8}
                    elif "TASK" in content_upper:
                        return {"label": "TASK", "score": 0.8}
                    elif "PROMOTION" in content_upper:
                        return {"label": "PROMOTION", "score": 0.8}
                    elif "SPAM" in content_upper:
                        return {"label": "SPAM", "score": 0.8}
                    else:
                        return {"label": "GRAY", "score": 0.6}
            except Exception as e:
                logger.exception(f"Gemini classify failed: {e}; falling back to heuristic.")
        
        # Enhanced fallback heuristic classification
        text_str = str(text).lower()
        subject = str(text.get('subject', '')).lower()
        sender = str(text.get('sender', '')).lower()
        
        # Spam detection
        spam_indicators = ["congratulations", "winner", "free money", "click here", "verify account", "urgent action", "limited time", "act now", "no-reply", "noreply"]
        if any(word in text_str for word in spam_indicators) or any(word in subject for word in ["urgent", "winner", "congratulations"]):
            return {"label": "SPAM", "score": 0.95}
        
        # Urgent detection
        urgent_indicators = ["urgent", "asap", "deadline", "emergency", "immediate", "critical", "today", "now"]
        if any(word in text_str for word in urgent_indicators):
            return {"label": "URGENT", "score": 0.9}
        
        # Task detection
        task_indicators = ["task", "assignment", "project", "meeting", "schedule", "work", "complete", "finish", "due"]
        if any(word in text_str for word in task_indicators):
            return {"label": "TASK", "score": 0.8}
        
        # Promotion detection
        promo_indicators = ["unsubscribe", "sale", "promo", "discount", "offer", "deal", "special", "newsletter", "marketing"]
        if any(word in text_str for word in promo_indicators):
            return {"label": "PROMOTION", "score": 0.9}
        
        # Important detection
        important_indicators = ["important", "meeting", "update", "announcement", "business", "official"]
        if any(word in text_str for word in important_indicators):
            return {"label": "IMPORTANT", "score": 0.8}
        
        # Default to GRAY for unclear content
        return {"label": "GRAY", "score": 0.6}

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
                
                # Remove markdown formatting if present
                if content.startswith('```json'):
                    content = content.replace('```json', '').replace('```', '').strip()
                elif content.startswith('```'):
                    content = content.replace('```', '').strip()
                
                # Clean up any remaining JSON artifacts
                content = content.replace('json {', '').replace('json[', '').replace('json', '')
                content = content.strip()
                
                try:
                    replies = json.loads(content)
                    if isinstance(replies, list):
                        # Clean each reply of any remaining formatting
                        clean_replies = []
                        for reply in replies[:3]:
                            if isinstance(reply, str):
                                clean_reply = reply.strip().strip('"').strip("'")
                                if clean_reply and not clean_reply.startswith('[') and not clean_reply.startswith(']'):
                                    clean_replies.append(clean_reply)
                        return clean_replies if clean_replies else ["Thank you for your email.", "I'll get back to you soon.", "Got it, thanks!"]
                    else:
                        return [content]
                except json.JSONDecodeError:
                    # If JSON parsing fails, try to extract lines manually
                    lines = []
                    for line in content.split('\n'):
                        line = line.strip()
                        if line and not line.startswith('[') and not line.startswith(']') and not line.startswith('{') and not line.startswith('}'):
                            # Remove quotes and clean up
                            clean_line = line.strip('"').strip("'").strip(',')
                            if clean_line and len(clean_line) > 3:  # Only meaningful replies
                                lines.append(clean_line)
                    return lines[:3] if lines else ["Thank you for your email.", "I'll get back to you soon.", "Got it, thanks!"]
            except Exception as e:
                logger.exception(f"Gemini smart reply failed: {e}; falling back to generic options.")
        # Fallback: generic smart replies
        return [
            "Thank you for your email. I'll review this and get back to you soon.",
            "Got it! I'll take care of this and update you accordingly.",
            "Thanks for reaching out. I'll look into this and respond with more details."
        ]

    def suggest_replies(self, email_body: str) -> List[str]:
        """Generate smart reply suggestions based on email body"""
        if _GEMINI_AVAILABLE and self.client:
            prompt = f"""Based on the following email, generate 3 short, distinct, and context-appropriate reply suggestions. Examples: 'Got it, thanks!', 'I'll look into this.', 'Sounds good.'. Return the output as a JSON array of strings.\n\nEmail:\n{email_body}\n"""
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
                logger.exception(f"Gemini suggest replies failed: {e}; falling back to generic options.")
        # Fallback: generic smart replies
        return [
            "Got it, thanks!",
            "I'll look into this.",
            "Sounds good."
        ]

ai_service = AIService()
