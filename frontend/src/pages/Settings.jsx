import { useState } from 'react';
import { Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { FiLogOut, FiLink } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

export default function Settings() {
  const { user, logout, connectGoogle, loading, error, setError, googleConnected } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);

  const handleLogout = async () => {
    await logout();
    showSuccess('You have been signed out.');
    navigate('/login');
  };

  const handleConnectGoogle = async () => {
    setConnecting(true);
    setError(null);
    try {
      await connectGoogle();
    } catch (err) {
      const message = err.message || 'Failed to connect Google account';
      setError(message);
      showError(message);
      setConnecting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 fw-semibold mb-1">Settings</h2>
        <p className="text-muted mb-0">Manage your profile, integrations, and preferences</p>
      </div>

      {error && <ErrorAlert message={error} className="mb-4" onRetry={() => setError(null)} />}

      <Row className="g-4">
        <Col lg={6}>
          <div className="wa-card p-4 h-100">
            <h5 className="mb-4">Profile</h5>
            <div className="mb-3">
              <div className="small text-muted">Email</div>
              <div className="fw-medium">{user?.email || 'Not available'}</div>
            </div>
            <div className="mb-3">
              <div className="small text-muted">User ID</div>
              <div className="text-break small">{user?.id || 'Not available'}</div>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="wa-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="mb-0">Google Workspace</h5>
              <Badge bg={googleConnected ? 'success' : 'secondary'}>
                {googleConnected ? 'Connected' : 'Not connected'}
              </Badge>
            </div>
            <p className="text-muted">
              Connect Google to enable Gmail and Calendar. Google tokens are stored securely on the server.
            </p>
            <Button
              variant="outline-primary"
              className="d-flex align-items-center gap-2"
              onClick={handleConnectGoogle}
              disabled={connecting || loading}
            >
              {connecting ? <LoadingSpinner size="sm" message="" /> : <FiLink />}
              {googleConnected ? 'Reconnect Google' : 'Connect Google'}
            </Button>
          </div>
        </Col>

        <Col lg={6}>
          <div className="wa-card p-4 h-100">
            <h5 className="mb-4">Theme</h5>
            <Form.Select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Form.Select>
          </div>
        </Col>

        <Col lg={6}>
          <div className="wa-card p-4 h-100 d-flex flex-column">
            <h5 className="mb-4">Logout</h5>
            <p className="text-muted flex-grow-1">
              Sign out of Workspace AI on this device.
            </p>
            <Button variant="danger" className="d-flex align-items-center gap-2 align-self-start" onClick={handleLogout}>
              <FiLogOut />
              Logout
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
