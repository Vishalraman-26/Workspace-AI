import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
  const { login, loading, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
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

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </Form>

        <p className="text-center text-muted small mt-4 mb-0">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-decoration-none">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
