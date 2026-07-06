import axios from 'axios';
import { getStoredToken } from './auth';

/**
 * Always use same-origin /api in dev so Vite proxy handles requests and OAuth redirects.
 */
export function getApiBaseUrl() {
  if (import.meta.env.DEV) {
    return '';
  }
  return import.meta.env.VITE_API_URL || '';
}

export function buildApiUrl(path) {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

/**
 * Redirect browser to Google OAuth.
 *
 * Uses full-page navigation to /api/google/connect so the browser follows the
 * backend 302 to accounts.google.com (fetch cannot read cross-origin Location headers).
 * A short-lived cookie (wa_token) is set on login so the Vite dev proxy can attach
 * Authorization: Bearer <token> to the connect request.
 */
export function redirectToGoogleOAuth({
  endpoint = '/api/google/connect',
  requiresAuth = true,
} = {}) {
  const token = getStoredToken();

  if (requiresAuth && !token) {
    throw new Error('You must be signed in before connecting Google.');
  }

  if (requiresAuth && token) {
    document.cookie = `wa_token=${encodeURIComponent(token)}; path=/; max-age=300; SameSite=Lax`;
  }

  window.location.assign(buildApiUrl(endpoint));
}

/**
 * Fallback: try to read redirect URL via axios (works when backend returns JSON or same-origin Location).
 */
export async function fetchGoogleOAuthUrl(endpoint, token) {
  const response = await axios.get(buildApiUrl(endpoint), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 400,
  });

  const location = response.headers?.location || response.headers?.Location;
  if (location) return location;

  return response.data?.url || response.data?.authUrl || response.data?.redirectUrl || null;
}

export async function redirectToGoogleOAuthWithFallback(options = {}) {
  const token = getStoredToken();
  const endpoint = options.endpoint || '/api/google/connect';
  const requiresAuth = options.requiresAuth !== false;

  if (requiresAuth && !token) {
    throw new Error('You must be signed in before connecting Google.');
  }

  try {
    const url = await fetchGoogleOAuthUrl(endpoint, requiresAuth ? token : null);
    if (url) {
      window.location.assign(url);
      return;
    }
  } catch (err) {
    const location = err.response?.headers?.location || err.response?.headers?.Location;
    if (location) {
      window.location.assign(location);
      return;
    }
  }

  redirectToGoogleOAuth({ endpoint, requiresAuth });
}
