import axios from "axios";

// 1. CORRECTED: Read the base URL from Vite's environment variables (`import.meta.env`).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is important for handling sessions/cookies across domains.
});


// --- AUTHENTICATION ---

/**
 * Constructs the full URL for the Google OAuth login endpoint.
 * This is not an API call but a URL construction for the browser to redirect to.
 * @returns The full URL for Google login.
 */
export function getGoogleLoginUrl(): string {
  return `${API_BASE_URL}/auth/google/login`;
}


// --- GMAIL SERVICES ---

/**
 * 2. CORRECTED: Fetches emails by calling the correct backend endpoint (`/gmail/inbox`).
 * @returns A promise that resolves to the list of emails.
 */
export async function fetchEmails() {
  try {
    const response = await api.get("/gmail/inbox");
    // The backend returns a JSON object like {"emails": [...]}, so we access the 'emails' property.
    return response.data.emails || [];
  } catch (error) {
    console.error("Error fetching emails:", error);
    // Return an empty array on error to prevent the UI from crashing.
    return [];
  }
}


// --- AI SERVICES ---
// 3. CORRECTED: These functions are updated to match the actual backend AI routes.

export async function classifyText(text: string) {
  const response = await api.post("/ai/classify", { text });
  return response.data;
}

export async function summarizeText(text: string) {
  const response = await api.post("/ai/summarize", { text });
  return response.data;
}

export async function rewriteText(text: string, tone: string) {
  const response = await api.post("/ai/rewrite", { text, tone });
  return response.data;
}
