// ─────────────────────── isTokenExpired ─────────────── START ──────────────────
// calls:     (none — pure computation)
// called by: L2/useAuth (on mount)
//
// Decodes a JWT payload (no signature check — just reads exp) and returns true
// if the token has expired.  Returns true for null/malformed tokens.
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const base64 = token.split('.')[1];
    const payload = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    return (payload.exp ?? 0) < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}
// ─────────────────────── isTokenExpired ─────────────── END ────────────────────

// ─────────────────────── userFromToken ─────────────── START ──────────────────
// calls:     (none — pure computation)
// called by: (utility — available for debugging / tests)
//
// Returns { id, email } from a JWT payload without verifying the signature.
export function userFromToken(token) {
  if (!token) return null;
  try {
    const base64  = token.split('.')[1];
    const payload = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
// ─────────────────────── userFromToken ─────────────── END ────────────────────

// ─────────────────────── parsePreferences ─────────────── START ──────────────────
// calls:     (none — pure transformation)
// called by: UI/OnboardingScreen (when loading saved prefs from API)
//
// API returns allergies/cuisines/equipment as JS arrays; this function is a
// passthrough normaliser that ensures the shape is always correct.
export function parsePreferences(raw) {
  if (!raw) return null;
  return {
    diet:       raw.diet        ?? 'Non-Veg',
    allergies:  Array.isArray(raw.allergies)  ? raw.allergies  : [],
    skill:      raw.skill       ?? 'Comfortable',
    targetKcal: raw.targetKcal  ?? 2100,
    spice:      raw.spice       ?? 5,
    cuisines:   Array.isArray(raw.cuisines)   ? raw.cuisines   : [],
    cookFreq:   raw.cookFreq    ?? 4,
    equipment:  Array.isArray(raw.equipment)  ? raw.equipment  : [],
  };
}
// ─────────────────────── parsePreferences ─────────────── END ────────────────────
