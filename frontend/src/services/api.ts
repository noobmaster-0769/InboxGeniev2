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