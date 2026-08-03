const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8081";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  saveUser: (payload) =>
    request("/save-user", { method: "POST", body: JSON.stringify(payload) }),

  sendMessage: (payload) =>
    request("/chat", { method: "POST", body: JSON.stringify(payload) }),

  navigate: (path) => request(`/navigate/${path}`),

  getProgram: (level, programId) => request(`/programs/${level}/${programId}`),

  submitLead: (payload) =>
    request("/lead", { method: "POST", body: JSON.stringify(payload) }),

  submitFeedback: (payload) =>
    request("/feedback", { method: "POST", body: JSON.stringify(payload) }),
};

export default api;
