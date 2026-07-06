import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getStoredToken } from '../utils/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';

function validateLoginForm(email, password) {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}

export default function Login() {
  const { login, loginWithGoogle, loading, isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [googleStarting, setGoogleStarting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const routeError = location.state?.error;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    const errors = validateLoginForm(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await login(email, password);
      showSuccess('Welcome back to Workspace AI.', 'Signed in');
      navigate('/');
    } catch (err) {
      showError(err.message, 'Sign in failed');
    }
  };

  const handleGoogleLogin = () => {
    const token = getStoredToken();
    if (!token) {
      showError('Sign in with email and password first, then use Connect Google on the Dashboard.');
      return;
    }
    setGoogleStarting(true);
    loginWithGoogle();
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    if (!forgotEmail.trim()) {
      showError('Enter your email address.');
      return;
    }
    setShowForgot(false);
    showInfo(
      'If an account exists for this email, password reset instructions will be sent.',
      'Password reset'
    );
  };

  return (
    <div className="wa-login-page d-flex align-items-center justify-content-center p-3">
      <div className="wa-card p-4 p-md-5 w-100" style={{ maxWidth: 480 }}>
        <div className="text-center mb-4">
          <div className="wa-logo-icon mx-auto mb-3">W</div>
          <h1 className="h3 fw-bold mb-1">Workspace AI</h1>
          <p className="text-muted mb-0">Sign in to your intelligent workspace</p>
        </div>

        {routeError && <Alert variant="danger">{routeError}</Alert>}

        <Form onSubmit={handleEmailLogin} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={Boolean(fieldErrors.email)}
              placeholder="you@company.com"
              autoComplete="email"
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label className="mb-0">Password</Form.Label>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgot(true);
                }}
              >
                Forgot password?
              </button>
            </div>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={Boolean(fieldErrors.password)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </Form>

        <div className="wa-login-divider my-4">
          <span>or</span>
        </div>

        <Button
          variant="outline-secondary"
          size="lg"
          className="w-100 wa-google-btn d-flex align-items-center justify-content-center gap-2"
          onClick={handleGoogleLogin}
          disabled={loading || googleStarting}
        >
          {googleStarting ? <LoadingSpinner size="sm" message="" /> : <FcGoogle size={22} />}
          Continue with Google
        </Button>

        <p className="text-center text-muted small mt-3 mb-0">
          Sign in with email first. Then use Connect Google to link Gmail &amp; Calendar.
        </p>
        <p className="text-center text-muted small mt-2 mb-0">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-decoration-none">
            Create one
          </Link>
        </p>
      </div>

      <Modal show={showForgot} onHide={() => setShowForgot(false)} centered>
        <Form onSubmit={handleForgotPassword}>
          <Modal.Header closeButton>
            <Modal.Title>Forgot password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted">
              Enter your email and we&apos;ll send reset instructions if an account exists.
            </p>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowForgot(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send reset link
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
