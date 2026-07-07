import { getErrorMessage } from './helpers';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
export const SESSION_KEY = 'session';
export const GOOGLE_CONNECTED_KEY = 'googleConnected';
export const TOKEN_COOKIE_KEY = 'wa_token';

const GOOGLE_NOT_CONNECTED_PATTERNS = [
  'google account',
  'google not connected',
  'google workspace',
  'connect google',
  'google tokens',
  'google_tokens',
  'no google',
  'not connected',
  'token not found',
  'tokens not found',
  'cannot read properties of null',
  'reading \'access_token\'',
  'reading "access_token"',
  'gmail not connected',
  'calendar not connected',
  'google connection',
  'authorize google',
];

export function isGoogleNotConnectedError(error) {
  if (!error) return false;

  const code = error?.response?.data?.code;
  if (code === 'GOOGLE_NOT_CONNECTED' || code === 'GOOGLE_NOT_LINKED') {
    return true;
  }

  const message = getErrorMessage(error, '').toLowerCase();
  const status = error?.response?.status;

  if (status === 403 && GOOGLE_NOT_CONNECTED_PATTERNS.some((p) => message.includes(p))) {
    return true;
  }

  return GOOGLE_NOT_CONNECTED_PATTERNS.some((p) => message.includes(p));
}

/**
 * Extract access_token from backend login response.
 * Supports: { token }, { access_token }, { data: { session: { access_token } } }, etc.
 */
export function extractAuthPayload(responseData) {
  const root = responseData || {};
  const payload = root.data ?? root;

  const session = payload.session || root.session || null;

  const token =
    session?.access_token ||
    root.token ||
    root.access_token ||
    payload.token ||
    payload.access_token ||
    payload.session?.access_token ||
    root.session?.access_token;

  const user =
    payload.user ||
    root.user ||
    payload.session?.user ||
    root.session?.user;

  return { token, user, session };
}

export function setTokenCookie(token) {
  if (!token) return;
  document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearTokenCookie() {
  document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function persistAuthSession({ token, user, session }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    setTokenCookie(token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function parseAuthCallbackParams(searchParams) {
  const error = searchParams.get('error') || searchParams.get('message');

  const token =
    searchParams.get('token') ||
    searchParams.get('jwt') ||
    searchParams.get('access_token');

  const user = {
    id: searchParams.get('userId') || searchParams.get('user_id') || undefined,
    email: searchParams.get('email') || undefined,
    name: searchParams.get('name') || undefined,
  };

  return { error, token, user };
}

export function clearAuthCallbackParams() {
  const url = new URL(window.location.href);
  const sensitiveParams = ['token', 'jwt', 'access_token', 'userId', 'user_id', 'email', 'name'];

  sensitiveParams.forEach((param) => url.searchParams.delete(param));
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(GOOGLE_CONNECTED_KEY);
  localStorage.removeItem('accessToken');
  clearTokenCookie();
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('accessToken');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function markGoogleConnected() {
  localStorage.setItem(GOOGLE_CONNECTED_KEY, 'true');
}

export function clearGoogleConnected() {
  localStorage.removeItem(GOOGLE_CONNECTED_KEY);
}

export function isGoogleConnected() {
  return localStorage.getItem(GOOGLE_CONNECTED_KEY) === 'true';
}
