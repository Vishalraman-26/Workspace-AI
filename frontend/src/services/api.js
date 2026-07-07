import axios from 'axios';
import {
  TOKEN_KEY,
  USER_KEY,
  clearAuthSession,
  extractAuthPayload,
  getStoredToken,
  persistAuthSession,
} from '../utils/auth';
import { buildApiUrl, getApiBaseUrl, redirectToGoogleOAuth } from '../utils/googleOAuth';

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: buildApiUrl('/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/auth/')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),

  register: (name, email, password) => api.post('/auth/register', { name, email, password }),

  loginWithGoogle: () => {
    const token = getStoredToken();
    if (token) {
      redirectToGoogleOAuth({ endpoint: '/api/google/connect', requiresAuth: true });
      return;
    }
    window.location.assign(buildApiUrl('/api/auth/google'));
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Client-side logout still proceeds if backend logout is unavailable.
    } finally {
      clearAuthSession();
    }
  },

  connectGoogle: () =>
    redirectToGoogleOAuth({
      endpoint: '/api/google/connect',
      requiresAuth: true,
    }),
};

export { persistAuthSession, clearAuthSession, TOKEN_KEY, USER_KEY, extractAuthPayload, API_BASE_URL };
export default api;
