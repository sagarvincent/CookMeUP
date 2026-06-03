import { getAccessToken } from './authService.js';

// ─────────────────────── _authHeaders ─────────────── START ──────────────────
// calls:     authService: getAccessToken
// called by: get, post
function _authHeaders() {
  const token   = getAccessToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}
// ─────────────────────── _authHeaders ─────────────── END ────────────────────

// ─────────────────────── get ─────────────── START ──────────────────
// calls:     _authHeaders
// called by: services/apiClient: fetchAll
export async function get(path) {
  const base = import.meta.env.VITE_API_BASE ?? '';
  const res  = await fetch(`${base}${path}`, { headers: _authHeaders() });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}
// ─────────────────────── get ─────────────── END ────────────────────

// ─────────────────────── post ─────────────── START ──────────────────
// calls:     _authHeaders
// called by: OnboardingScreen (save preferences)
export async function post(path, body) {
  const base = import.meta.env.VITE_API_BASE ?? '';
  const res  = await fetch(`${base}${path}`, { method: 'POST', headers: _authHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.status === 204 ? null : res.json();
}
// ─────────────────────── post ─────────────── END ────────────────────

// ─────────────────────── put ─────────────── START ──────────────────
// calls:     _authHeaders
// called by: OnboardingScreen (save preferences)
export async function put(path, body) {
  const base = import.meta.env.VITE_API_BASE ?? '';
  const res  = await fetch(`${base}${path}`, { method: 'PUT', headers: _authHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.status === 204 ? null : res.json();
}
// ─────────────────────── put ─────────────── END ────────────────────

// ─────────────────────── fetchAll ─────────────── START ──────────────────
// calls:     get
// called by: services/dataService: loadAllData (dev_cluster + production)
export async function fetchAll() {
  return get('/data/bootstrap');
}
// ─────────────────────── fetchAll ─────────────── END ────────────────────
