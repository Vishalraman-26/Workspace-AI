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
  isGoogleConnected,
  markGoogleConnected,
  clearGoogleConnected,
} from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(isGoogleConnected);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
    }
  }, [token]);

  const applySession = useCallback((nextToken, nextUser) => {
    persistAuthSession({ token: nextToken, user: nextUser });
    setToken(nextToken);
    setUser(nextUser);
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

      const { token: jwt, user: authUser } = extractAuthPayload(data);

      if (!jwt) {
        throw new Error('Login failed. No token received from server.');
      }

      applySession(jwt, authUser || { email });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  const register = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.register(email, password);
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
    const { token: jwt, user: authUser } = extractAuthPayload(responseData);

    if (!jwt) {
      throw new Error('Sign in failed. No token received.');
    }

    applySession(jwt, authUser);
  }, [applySession]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } finally {
      clearAuthSession();
      setToken(null);
      setUser(null);
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
