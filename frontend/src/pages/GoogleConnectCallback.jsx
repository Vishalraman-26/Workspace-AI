import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { markGoogleConnected } from '../utils/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function GoogleConnectCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setGoogleConnectionStatus } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const error = searchParams.get('error') || searchParams.get('message');
    const success =
      searchParams.get('connected') === 'true' ||
      searchParams.get('google_connected') === 'true' ||
      searchParams.get('status') === 'success' ||
      searchParams.get('success') === 'true' ||
      !error;

    if (error) {
      showError(error, 'Google connection failed');
      navigate('/', { replace: true });
      return;
    }

    if (success) {
      markGoogleConnected();
      setGoogleConnectionStatus(true);
      showSuccess('Google Workspace connected successfully.', 'Connected');
    }

    navigate('/', { replace: true });
  }, [searchParams, navigate, setGoogleConnectionStatus, showSuccess, showError]);

  return <LoadingSpinner centered message="Connecting Google account..." />;
}
