const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

const AUTH_COOKIE_NAME = "logged_in";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const USER_ID_KEY = "user_id";

export function setUserId(id) {
  if (typeof window === "undefined") return;
  if (id != null) localStorage.setItem(USER_ID_KEY, String(id));
  else localStorage.removeItem(USER_ID_KEY);
}

export function getUserId() {
  if (typeof window === "undefined") return null;
  const id = localStorage.getItem(USER_ID_KEY);
  return id ? Number(id) : null;
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem(USER_ID_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

export async function api(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.errors = data.errors || null;
    throw err;
  }
  return data;
}

export async function login(email, password) {
  const data = await api("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.token) setToken(data.token);
  if (data.user?.id != null) setUserId(data.user.id);
  return data;
}

export async function register(name, email, password, password_confirmation) {
  const data = await api("/api/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
  if (data.token) setToken(data.token);
  if (data.user?.id != null) setUserId(data.user.id);
  return data;
}

/** Fetch current user from API and store user id (e.g. when login response has no user). */
export async function getCurrentUser() {
  const data = await api("/api/user");
  const user = data.data ?? data;
  if (user?.id != null) setUserId(user.id);
  return user;
}

// Properties
export async function getProperties() {
  const data = await api("/api/properties");
  return Array.isArray(data) ? data : data.data || [];
}

export async function getProperty(id) {
  const data = await api(`/api/properties/${id}`);
  return data.data || data;
}

export async function createProperty(property) {
  const userId = getUserId();
  const payload = userId != null ? { ...property, user_id: userId } : property;
  const data = await api("/api/properties", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.data || data;
}

export async function updateProperty(id, property) {
  const userId = getUserId();
  const payload = userId != null ? { ...property, user_id: userId } : property;
  const data = await api(`/api/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.data || data;
}

export async function deleteProperty(id) {
  await api(`/api/properties/${id}`, { method: "DELETE" });
}
