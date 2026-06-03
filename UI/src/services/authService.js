// ─────────────────────── authService ─────────────── START ──────────────────
// calls:     native fetch (direct — auth routes are not behind @data-loader)
// called by: L2/useAuth
//
// All tokens are stored in localStorage.  In dev_local mode the service returns
// a fake demo user immediately so UI development needs no running API.
// ─────────────────────── authService ─────────────── END ────────────────────

const BASE     = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';
const IS_LOCAL = import.meta.env.VITE_APP_ENV === 'dev_local';

const DEMO_USER = { id: 'usr_demo', email: 'demo@mise-and-plate.com', name: 'Demo User' };

// ─────────────────────── _post ─────────────────────── START ─────────────────
// calls:     fetch
// called by: login, register, refresh, logout
async function _post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}
// ─────────────────────── _post ─────────────────────── END ───────────────────

// ─────────────────────── login ─────────────────────── START ─────────────────
// calls:     _post
// called by: useAuth.login
//
// Posts credentials; stores access token, refresh token, and user in localStorage.
export async function login(email, password) {
  if (IS_LOCAL) { _storeSession(null, null, DEMO_USER); return DEMO_USER; }
  const data = await _post('/auth/login', { email, password });
  _storeSession(data.accessToken, data.refreshToken, data.user);
  return data.user;
}
// ─────────────────────── login ─────────────────────── END ───────────────────

// ─────────────────────── register ─────────────────────── START ──────────────
// calls:     _post
// called by: useAuth.register
export async function register(email, password, name) {
  if (IS_LOCAL) { _storeSession(null, null, DEMO_USER); return DEMO_USER; }
  const data = await _post('/auth/register', { email, password, name });
  _storeSession(data.accessToken, data.refreshToken, data.user);
  return data.user;
}
// ─────────────────────── register ─────────────────────── END ────────────────

// ─────────────────────── logout ─────────────────────── START ────────────────
// calls:     _post, _clearSession
// called by: useAuth.logout
export async function logout() {
  if (IS_LOCAL) { _clearSession(); return; }
  const token = getAccessToken();
  const rft   = localStorage.getItem('mp_refresh_token');
  _clearSession();
  if (token) await _post('/auth/logout', { refreshToken: rft }, token).catch(() => {});
}
// ─────────────────────── logout ─────────────────────── END ──────────────────

// ─────────────────────── refresh ─────────────────────── START ───────────────
// calls:     _post
// called by: useAuth (on mount if access token is expired)
export async function refresh() {
  if (IS_LOCAL) return DEMO_USER;
  const rft = localStorage.getItem('mp_refresh_token');
  if (!rft) return null;
  try {
    const data = await _post('/auth/refresh', { refreshToken: rft });
    localStorage.setItem('mp_access_token', data.accessToken);
    localStorage.setItem('mp_refresh_token', data.refreshToken);
    return getStoredUser();
  } catch {
    _clearSession();
    return null;
  }
}
// ─────────────────────── refresh ─────────────────────── END ─────────────────

// ─────────────────────── getAccessToken ─────────────── START ────────────────
export function getAccessToken() {
  if (IS_LOCAL) return null;
  return localStorage.getItem('mp_access_token');
}
// ─────────────────────── getAccessToken ─────────────── END ──────────────────

// ─────────────────────── getStoredUser ─────────────── START ─────────────────
export function getStoredUser() {
  if (IS_LOCAL) return DEMO_USER;
  const raw = localStorage.getItem('mp_user');
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}
// ─────────────────────── getStoredUser ─────────────── END ───────────────────

function _storeSession(accessToken, refreshToken, user) {
  if (accessToken)  localStorage.setItem('mp_access_token',  accessToken);
  if (refreshToken) localStorage.setItem('mp_refresh_token', refreshToken);
  localStorage.setItem('mp_user', JSON.stringify(user));
}

function _clearSession() {
  localStorage.removeItem('mp_access_token');
  localStorage.removeItem('mp_refresh_token');
  localStorage.removeItem('mp_user');
}
