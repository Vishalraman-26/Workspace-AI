import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { authApi, persistAuthSession, clearAuthSession, extractAuthPayload } from '../services/api';
import {
  getStoredToken,
  getStoredUser,
  getStoredSession,
  isGoogleConnected,
  markGoogleConnected,
  clearGoogleConnected,
} from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [session, setSession] = useState(getStoredSession);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(isGoogleConnected);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setSession(null);
    }
  }, [token]);

  const applySession = useCallback((nextToken, nextUser, nextSession) => {
    persistAuthSession({ token: nextToken, user: nextUser, session: nextSession });
    setToken(nextToken);
    setUser(nextUser);
    setSession(nextSession);
    setError(null);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.login(email, password);

      if (data?.success === false) {
        throw new Error(data.message || 'Login failed');
      }

      const { token: jwt, user: authUser, session: authSession } = extractAuthPayload(data);

      if (!jwt) {
        throw new Error('Login failed. No token received from server.');
      }

      applySession(jwt, authUser, authSession);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.register(name, email, password);
      if (data?.success === false) {
        throw new Error(data.message || 'Registration failed');
      }
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    setError(null);
    authApi.loginWithGoogle();
  }, []);

  const completeAuthCallback = useCallback((responseData) => {
    const { token: jwt, user: authUser, session: authSession } = extractAuthPayload(responseData);

    if (!jwt) {
      throw new Error('Sign in failed. No token received.');
    }

    applySession(jwt, authUser, authSession);
  }, [applySession]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } finally {
      clearAuthSession();
      setToken(null);
      setUser(null);
      setSession(null);
      setGoogleConnected(false);
      setError(null);
      setLoading(false);
    }
  }, []);

  const connectGoogle = useCallback(async () => {
    setError(null);
    await authApi.connectGoogle();
  }, []);

  const setGoogleConnectionStatus = useCallback((connected) => {
    if (connected) {
      markGoogleConnected();
    } else {
      clearGoogleConnected();
    }
    setGoogleConnected(connected);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      token,
      loading,
      error,
      isAuthenticated,
      googleConnected,
      login,
      register,
      loginWithGoogle,
      completeAuthCallback,
      logout,
      connectGoogle,
      setGoogleConnectionStatus,
      setError,
    }),
    [
      user,
      session,
      token,
      loading,
      error,
      isAuthenticated,
      googleConnected,
      login,
      register,
      loginWithGoogle,
      completeAuthCallback,
      logout,
      connectGoogle,
      setGoogleConnectionStatus,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
