const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const TOKEN_KEY = "pinkfoot_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = false, formData = false } = {}) {
  const headers = {};
  if (!formData && body) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: formData ? body : body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // PUBLIC
  destinations: () => request("/api/destinations"),
  destination: (slug) => request(`/api/destinations/${slug}`),
  packages: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/packages${q ? `?${q}` : ""}`);
  },
  package: (slug) => request(`/api/packages/${slug}`),
  reviews: (packageSlug) =>
    request(`/api/reviews${packageSlug ? `?packageSlug=${packageSlug}` : ""}`),
  createLead: (data) => request("/api/leads", { method: "POST", body: data }),

  // AUTH
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/api/auth/me", { auth: true }),

  // ADMIN
  adminListPackages: () => request("/api/packages?all=1", { auth: true }),
  adminListDestinations: () => request("/api/destinations?all=1", { auth: true }),
  adminCreatePackage: (formData) =>
    request("/api/packages", { method: "POST", body: formData, auth: true, formData: true }),
  adminUpdatePackage: (id, formData) =>
    request(`/api/packages/${id}`, { method: "PUT", body: formData, auth: true, formData: true }),
  adminDeletePackage: (id) =>
    request(`/api/packages/${id}`, { method: "DELETE", auth: true }),
  adminCreateDestination: (formData) =>
    request("/api/destinations", { method: "POST", body: formData, auth: true, formData: true }),
  adminUpdateDestination: (id, formData) =>
    request(`/api/destinations/${id}`, { method: "PUT", body: formData, auth: true, formData: true }),
  adminDeleteDestination: (id) =>
    request(`/api/destinations/${id}`, { method: "DELETE", auth: true }),
  adminLeads: () => request("/api/leads", { auth: true }),
  adminUpdateLead: (id, status) =>
    request(`/api/leads/${id}`, { method: "PATCH", body: { status }, auth: true }),
  adminDeleteLead: (id) => request(`/api/leads/${id}`, { method: "DELETE", auth: true }),

  // Generic single-image upload — returns { url, filename, size }
  adminUploadImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return request("/api/uploads/image", { method: "POST", body: fd, auth: true, formData: true });
  },
};

/** safe fetcher that falls back to a value when API is offline */
export async function safe(promise, fallback) {
  try {
    return await promise;
  } catch (e) {
    if (import.meta.env.DEV) console.warn("[api fallback]", e.message);
    return fallback;
  }
}
