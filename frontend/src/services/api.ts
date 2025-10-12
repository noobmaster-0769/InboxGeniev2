import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export async function listEmails() {
  const res = await api.get("/gmail/list");
  return res.data;
}

export async function fetchInbox() {
  const res = await api.get("/gmail/fetch");
  return res.data;
}

export async function classifyText(text: string) {
  const res = await api.post("/ai/classify", { text });
  return res.data;
}

export async function summarizeText(text: string) {
  const res = await api.post("/ai/summarize", { text });
  return res.data;
}

export async function rewriteText(text: string, tone: string) {
  const res = await api.post("/ai/rewrite", { text, tone });
  return res.data;
}

// auth endpoints
export function getGoogleLoginUrl() {
  return `${API_BASE}/auth/google/login`;
}
