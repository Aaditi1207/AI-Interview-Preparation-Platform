import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/authApi.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'aiip_id_token';
const REFRESH_KEY = 'aiip_refresh_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      const claims = decodeJwt(token);
      if (claims && claims.exp * 1000 > Date.now()) {
        setUser({ email: claims.email, sub: claims.sub });
      } else {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    sessionStorage.setItem(TOKEN_KEY, result.idToken);
    sessionStorage.setItem(REFRESH_KEY, result.refreshToken);
    const claims = decodeJwt(result.idToken);
    setUser({ email: claims.email, sub: claims.sub });
    return result;
  }, []);

  const register = useCallback(async (email, password) => {
    return authApi.register(email, password);
  }, []);

  const confirmRegistration = useCallback(async (email, code) => {
    return authApi.confirmSignUp(email, code);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    setUser(null);
  }, []);

  const getToken = useCallback(() => sessionStorage.getItem(TOKEN_KEY), []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, confirmRegistration, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
