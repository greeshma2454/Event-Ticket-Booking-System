// Simple helper around fetch so every page uses the same base URL.

export const API_BASE = "http://127.0.0.1:5000";

async function request(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText;
    throw new Error(msg);
  }
  return data;
}

export function apiGet(path) {
  return request("GET", path);
}
export function apiPost(path, body) {
  return request("POST", path, body);
}
export function apiPut(path, body) {
  return request("PUT", path, body);
}
export function apiDelete(path) {
  return request("DELETE", path);
}
