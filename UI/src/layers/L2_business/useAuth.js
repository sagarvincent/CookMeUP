import { useState, useEffect, useCallback } from 'react';
import {
  login    as svcLogin,
  register as svcRegister,
  logout   as svcLogout,
  refresh,
  getAccessToken,
  getStoredUser,
} from '../../services/authService.js';
import { isTokenExpired } from '../L3_composite/authOps.js';

// ─────────────────────── useAuth ─────────────── START ──────────────────
// calls:     authService: login, register, logout, refresh, getAccessToken, getStoredUser
//            L3/authOps: isTokenExpired
// called by: L1/App
//
// Manages user identity state for the whole app.
// On mount: restores the stored user if the token is still valid; silently
// refreshes the token if it is expired but a refresh token is present.
// ─────────────────────── useAuth ─────────────── END ────────────────────
export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      const stored = getStoredUser();
      if (!stored) { setLoading(false); return; }

      const token = getAccessToken();
      if (!isTokenExpired(token)) {
        setUser(stored);
        setLoading(false);
        return;
      }

      // Token expired — try silent refresh
      const refreshed = await refresh();
      setUser(refreshed);
      setLoading(false);
    })();
  }, []);

  // ─── login ─────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const u = await svcLogin(email, password);
      setUser(u);
      return u;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // ─── register ──────────────────────────────────────────────────────────
  const register = useCallback(async (email, password, name) => {
    setError(null);
    try {
      const u = await svcRegister(email, password, name);
      setUser(u);
      return u;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // ─── logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await svcLogout();
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isLoggedIn: !!user,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };
}
