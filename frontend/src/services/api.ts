import axios from "axios";

// FIX: Hardcoded the backend URL to resolve the 'import.meta' build warning.
const API_BASE_URL = "http://localhost:8000";

// Create a reusable Axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Constructs the full URL for the Google login endpoint.
 * This is used to initiate the OAuth flow.
 */
export function getGoogleLoginUrl(): string {
  return `${API_BASE_URL}/auth/google/login`;
}

/**
 * Fetches the user's emails from the backend's /gmail/inbox endpoint.
 */
export async function fetchEmails(): Promise<any[]> {
  try {
    const response = await api.get("/gmail/inbox");
    // The backend returns an object like { emails: [...] }, so we extract the array.
    return response.data.emails || [];
  } catch (error) {
    console.error("Error fetching emails:", error);
    // Re-throw authentication errors so the app can handle them properly
    if (error.response?.status === 404 || error.response?.data?.detail?.includes("No user found")) {
      throw new Error("User not authenticated");
    }
    // For other errors, return empty array to prevent UI crashes
    return [];
  }
}

// --- TYPE DEFINITIONS ---
export interface Email {
  id: string; 
  sender: string;
  subject: string;
  snippet: string;
  content?: string; // Full content
  category: 'Urgent' | 'Task' | 'Important' | 'Promotion' | 'General';
  status: 'inbox' | 'archived' | 'trashed';
  isStarred: boolean;
  date: string;
  isRead: boolean;
  aiSummary?: string;
}

// AI Service Functions
export async function classifyEmail(emailData: { subject?: string; content?: string; snippet?: string }) {
  try {
    const response = await api.post("/ai/classify", emailData);
    return response.data;
  } catch (error) {
    console.error("Error classifying email:", error);
    throw error;
  }
}

export async function summarizeEmail(text: string) {
  try {
    const response = await api.post("/ai/summarize", { text });
    return response.data;
  } catch (error) {
    console.error("Error summarizing email:", error);
    throw error;
  }
}

export async function rewriteEmailTone(text: string, tone: string) {
  try {
    const response = await api.post("/ai/rewrite", { text, tone });
    return response.data;
  } catch (error) {
    console.error("Error rewriting email tone:", error);
    throw error;
  }
}

export async function generateAutoReply(originalEmail: string, context?: string) {
  try {
    const response = await api.post("/ai/auto-reply", { 
      original_email: originalEmail, 
      context: context || "" 
    });
    return response.data;
  } catch (error) {
    console.error("Error generating auto-reply:", error);
    throw error;
  }
}

export async function generateSmartReplies(text: string) {
  try {
    const response = await api.post("/ai/smart-reply", { text });
    return response.data;
  } catch (error) {
    console.error("Error generating smart replies:", error);
    throw error;
  }
}

export async function suggestReplies(emailBody: string) {
  try {
    const response = await api.post("/ai/suggest-replies", { text: emailBody });
    return response.data;
  } catch (error) {
    console.error("Error generating reply suggestions:", error);
    throw error;
  }
}

export async function summarizeEmailById(messageId: string) {
  try {
    const response = await api.post(`/ai/summarize-email/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Error summarizing email:", error);
    throw error;
  }
}

export async function checkAIHealth() {
  try {
    const response = await api.get("/ai/health");
    return response.data;
  } catch (error) {
    console.error("Error checking AI health:", error);
    throw error;
  }
}

// Email Action Functions
export async function archiveEmail(emailId: string) {
  try {
    const response = await api.post(`/gmail/archive/${emailId}`);
    return response.data;
  } catch (error) {
    console.error("Error archiving email:", error);
    throw error;
  }
}

export async function trashEmail(emailId: string) {
  try {
    const response = await api.post(`/gmail/trash/${emailId}`);
    return response.data;
  } catch (error) {
    console.error("Error trashing email:", error);
    throw error;
  }
}

export async function moveToInbox(emailId: string) {
  try {
    const response = await api.post(`/gmail/inbox/${emailId}`);
    return response.data;
  } catch (error) {
    console.error("Error moving email to inbox:", error);
    throw error;
  }
}

export async function markEmailRead(emailId: string) {
  try {
    const response = await api.post(`/gmail/mark-read/${emailId}`);
    return response.data;
  } catch (error) {
    console.error("Error marking email as read:", error);
    throw error;
  }
}

// Bulk action functions
export async function archiveEmails(messageIds: string[]) {
  try {
    const response = await api.post("/gmail/archive", { message_ids: messageIds });
    return response.data;
  } catch (error) {
    console.error("Error archiving emails:", error);
    throw error;
  }
}

export async function deleteEmails(messageIds: string[]) {
  try {
    const response = await api.post("/gmail/trash", { message_ids: messageIds });
    return response.data;
  } catch (error) {
    console.error("Error deleting emails:", error);
    throw error;
  }
}

// Email Sending Function
export async function sendEmail(emailData: { to: string; subject: string; body: string }) {
  try {
    const response = await api.post("/gmail/send", emailData);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Draft functions
export async function saveDraft(draftData: { to: string; subject: string; body: string }) {
  try {
    const response = await api.post("/gmail/drafts/save", draftData);
    return response.data;
  } catch (error) {
    console.error("Error saving draft:", error);
    throw error;
  }
}

export async function fetchDrafts(): Promise<any[]> {
  try {
    const response = await api.get("/gmail/drafts");
    return response.data.drafts || [];
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return [];
  }
}

// Reversible action functions
export async function unarchiveEmail(emailId: string) {
  try {
    const response = await api.post(`/gmail/unarchive/${emailId}`);
    return response.data;
  } catch (error) {
    console.error("Error unarchiving email:", error);
    throw error;
  }
}

export async function restoreEmail(emailId: string) {
  try {
    const response = await api.post(`/gmail/restore/${emailId}`);
    return response.data;
  } catch (error) {
    console.error("Error restoring email:", error);
    throw error;
  }
}

// Authentication functions
export async function logout() {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}