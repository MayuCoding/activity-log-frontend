/**
 * Thin fetch wrapper around the StudySpark FastAPI backend.
 * Every call attaches the Firebase ID token as a Bearer header.
 */
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = data?.detail || res.statusText || "Request failed";
    const err = new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    err.status = res.status;
    throw err;
  }
  return data;
}

// --- auth ---
export const verifyToken = (token) =>
  request("/api/auth/verify", { method: "POST", token });

// --- study records ---
export const listStudy = (token) => request("/api/records/study", { token });
export const createStudy = (token, payload) =>
  request("/api/records/study", { method: "POST", body: payload, token });
export const updateStudy = (token, id, payload) =>
  request(`/api/records/study/${id}`, { method: "PUT", body: payload, token });
export const deleteStudy = (token, id) =>
  request(`/api/records/study/${id}`, { method: "DELETE", token });

// --- awards ---
export const listAwards = (token) => request("/api/records/awards", { token });
export const createAward = (token, payload) =>
  request("/api/records/awards", { method: "POST", body: payload, token });
export const updateAward = (token, id, payload) =>
  request(`/api/records/awards/${id}`, { method: "PUT", body: payload, token });
export const deleteAward = (token, id) =>
  request(`/api/records/awards/${id}`, { method: "DELETE", token });

// --- assessments ---
export const listAssessments = (token) => request("/api/records/assessments", { token });
export const createAssessment = (token, payload) =>
  request("/api/records/assessments", { method: "POST", body: payload, token });
export const updateAssessment = (token, id, payload) =>
  request(`/api/records/assessments/${id}`, { method: "PUT", body: payload, token });
export const deleteAssessment = (token, id) =>
  request(`/api/records/assessments/${id}`, { method: "DELETE", token });

// --- points / leaderboard ---
export const myPoints = (token) => request("/api/points/me", { token });
export const leaderboard = (token) => request("/api/leaderboard", { token });

// --- motivation coach ---
export const agentUsage = (token) => request("/api/agent/usage", { token });
export const motivate = (token, message) =>
  request("/api/agent/motivate", { method: "POST", body: { message }, token });
