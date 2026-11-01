import axios from "axios";

// Local development uses your own server; the deployed site uses the Render backend.
const FALLBACK_API_URL = import.meta.env.PROD
  ? "https://ai-mystery-room-api-kppi.onrender.com/api"
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || FALLBACK_API_URL,
  timeout: 240000 // mystery generation can take a while
});

export function errorMessage(err) {
  return (
    err?.response?.data?.error ||
    (err?.code === "ERR_NETWORK" ? "Cannot reach the server. Is the backend running?" : null) ||
    "Something went wrong. Please try again."
  );
}

export const createCase = (premise, difficulty) =>
  api.post("/cases", { premise, difficulty }).then((r) => r.data);
export const getCase = (id) => api.get(`/cases/${id}`).then((r) => r.data);
export const discoverClue = (id, clueId) =>
  api.post(`/cases/${id}/clues/${clueId}/discover`).then((r) => r.data);
export const requestHint = (id) => api.post(`/cases/${id}/hints`).then((r) => r.data);
export const accuse = (id, suspectId) =>
  api.post(`/cases/${id}/accuse`, { suspectId }).then((r) => r.data);
export const getResult = (id) => api.get(`/cases/${id}/result`).then((r) => r.data);