import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  TOKEN_KEY,
  clearAuthCallbackParams,
  parseAuthCallbackParams,
  persistAuthSession,
} from '../utils/auth';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeAuthCallback } = useAuth();
  const { showError } = useToast();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const { error, token, user } = parseAuthCallbackParams(searchParams);

    if (error) {
      clearAuthCallbackParams();
      showError(error, 'Sign in failed');
      navigate('/login', { replace: true, state: { error } });
      return;
    }

    if (!token) {
      const message = 'Sign in failed. No token received.';
      clearAuthCallbackParams();
      showError(message);
      navigate('/login', { replace: true, state: { error: message } });
      return;
    }

    try {
      localStorage.setItem(TOKEN_KEY, token);
      persistAuthSession({ token, user: user.id || user.email ? user : undefined });
      completeAuthCallback({ token, user });
      clearAuthCallbackParams();
      navigate('/', { replace: true });
    } catch (err) {
      clearAuthCallbackParams();
      showError(err.message, 'Sign in failed');
      navigate('/login', { replace: true, state: { error: err.message } });
    }
  }, [searchParams, navigate, completeAuthCallback, showError]);

  return <LoadingSpinner centered message="Completing sign in..." />;
}
