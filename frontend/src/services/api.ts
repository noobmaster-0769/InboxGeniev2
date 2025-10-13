import axios from "axios";

// Read the base URL from Vite's environment variables (`import.meta.env`).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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
export async function fetchEmails() {
  try {
    const response = await api.get("/gmail/inbox");
    // The backend returns an object like { emails: [...] }, so we extract the array.
    return response.data.emails || [];
  } catch (error) {
    console.error("Error fetching emails:", error);
    // On failure, return an empty array to prevent the UI from crashing.
    return [];
  }
}

