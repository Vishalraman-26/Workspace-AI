import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';

const ICONS = {
  gmail: FiMail,
  calendar: FiCalendar,
  default: FcGoogle,
};

export default function ConnectGoogleScreen({
  service = 'default',
  title,
  description,
  compact = false,
}) {
  const { connectGoogle } = useAuth();
  const { showError } = useToast();
  const [connecting, setConnecting] = useState(false);
  const Icon = ICONS[service] || ICONS.default;

  const defaultTitle = 'Google Workspace not connected';
  const defaultDescription =
    'Connect your Google account to use Gmail, Calendar and AI features.';

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await connectGoogle();
    } catch (err) {
      showError(err.message || 'Failed to start Google connection');
      setConnecting(false);
    }
  };

  if (compact) {
    return (
      <div className="wa-card p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="wa-stat-icon bg-primary bg-opacity-10 text-primary">
            <Icon size={20} />
          </div>
          <div>
            <h5 className="mb-1">{title || defaultTitle}</h5>
            <p className="text-muted mb-0 small">{description || defaultDescription}</p>
          </div>
        </div>
        <Button
          variant="primary"
          className="d-inline-flex align-items-center gap-2 flex-shrink-0"
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? <LoadingSpinner size="sm" message="" /> : <FcGoogle size={18} />}
          Connect Google
        </Button>
      </div>
    );
  }

  return (
    <div className="wa-card p-4 p-md-5 text-center mx-auto" style={{ maxWidth: 560 }}>
      <div className="wa-stat-icon bg-primary bg-opacity-10 text-primary mx-auto mb-4">
        <Icon size={24} />
      </div>
      <h4 className="mb-2">{title || defaultTitle}</h4>
      <p className="text-muted mb-4">{description || defaultDescription}</p>
      <Button
        variant="primary"
        size="lg"
        className="d-inline-flex align-items-center gap-2"
        onClick={handleConnect}
        disabled={connecting}
      >
        {connecting ? <LoadingSpinner size="sm" message="" /> : <FcGoogle size={20} />}
        Connect Google
      </Button>
      <p className="text-muted small mt-3 mb-0">
        Workspace AI securely stores Google tokens on the server. Your browser only keeps the app session token.
      </p>
    </div>
  );
}

export function ConnectGoogleCard() {
  return <ConnectGoogleScreen compact />;
}
