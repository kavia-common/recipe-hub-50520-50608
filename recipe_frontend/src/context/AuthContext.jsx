import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest, setAuthToken, getAuthToken } from '../api/client';

/**
 * AuthContext provides authentication state and actions across the app.
 * It stores JWT tokens in memory and localStorage, exposes login, register, and logout,
 * and automatically redirects to /login on 401 responses.
 */

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /** Current JWT token or null */
  token: null,
  /** Whether auth state is being restored or an auth action is in progress */
  loading: false,
  /** Current authenticated user profile, if available */
  user: null,
  /** Perform login with credentials */
  login: async (_email, _password) => {},
  /** Perform user registration */
  register: async (_name, _email, _password) => {},
  /** Log out and clear auth */
  logout: () => {},
});

// PUBLIC_INTERFACE
export function useAuth() {
  /**
   * Hook to access AuthContext safely.
   */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provider that manages JWT, persists it in localStorage, and exposes auth actions.
   * It also provides a fetch wrapper that watches for 401s to redirect to /login.
   */
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // optionally fill from /auth/me if backend supports
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const t = getAuthToken();
    if (t) {
      setToken(t);
    }
    setLoading(false);
  }, []);

  const handleUnauthorized = useCallback(() => {
    // Clear session and redirect to login; preserve returnTo path
    setToken(null);
    setUser(null);
    try {
      setAuthToken(null);
    } catch (e) {
      // ignore
    }
    const currentPath = location.pathname + location.search;
    if (location.pathname !== '/login') {
      navigate(`/login?returnTo=${encodeURIComponent(currentPath)}`, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  // Wrapper around apiRequest to catch 401s globally when used via context if needed
  const authedRequest = useCallback(
    async (path, options = {}) => {
      try {
        return await apiRequest(path, options);
      } catch (err) {
        if (err && err.status === 401) {
          handleUnauthorized();
        }
        throw err;
      }
    },
    [handleUnauthorized]
  );

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const data = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        const jwt = data?.token || data?.access_token || data?.jwt;
        if (!jwt) {
          throw new Error(data?.message || 'No token received from login');
        }
        setToken(jwt);
        setAuthToken(jwt);
        // Optionally fetch profile: const me = await authedRequest('/auth/me');
        // setUser(me);
        // Navigate to return path or home
        const params = new URLSearchParams(location.search);
        const returnTo = params.get('returnTo') || '/';
        navigate(returnTo, { replace: true });
        return data;
      } catch (e) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [location.search, navigate]
  );

  const register = useCallback(
    async (name, email, password) => {
      setLoading(true);
      try {
        const data = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });
        // Some backends auto-login and return token; handle both cases
        const jwt = data?.token || data?.access_token || data?.jwt;
        if (jwt) {
          setToken(jwt);
          setAuthToken(jwt);
          const params = new URLSearchParams(location.search);
          const returnTo = params.get('returnTo') || '/';
          navigate(returnTo, { replace: true });
        } else {
          // If no token is provided, navigate to login so user can sign in
          navigate('/login', { replace: true });
        }
        return data;
      } catch (e) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [location.search, navigate]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      request: authedRequest,
    }),
    [token, user, loading, login, register, logout, authedRequest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
