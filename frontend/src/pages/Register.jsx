import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Alert, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function validateRegisterForm(email, password, confirmPassword) {
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

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

export default function Register() {
  const { register, loading, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [registered, setRegistered] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async (event) => {
    event.preventDefault();
    const errors = validateRegisterForm(email, password, confirmPassword);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await register(email, password);
      setRegistered(true);
      showSuccess('Account created. You can now sign in.', 'Registration complete');
    } catch (err) {
      showError(err.message, 'Registration failed');
    }
  };

  return (
    <div className="wa-login-page d-flex align-items-center justify-content-center p-3">
      <div className="wa-card p-4 p-md-5 w-100" style={{ maxWidth: 480 }}>
        <div className="text-center mb-4">
          <div className="wa-logo-icon mx-auto mb-3">W</div>
          <h1 className="h3 fw-bold mb-1">Create account</h1>
          <p className="text-muted mb-0">Get started with Workspace AI</p>
        </div>

        {registered && (
          <Alert variant="success">
            Account created successfully. <Link to="/login">Sign in</Link> to continue.
          </Alert>
        )}

        <Form onSubmit={handleRegister} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={Boolean(fieldErrors.email)}
              placeholder="you@company.com"
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={Boolean(fieldErrors.password)}
              placeholder="At least 6 characters"
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={Boolean(fieldErrors.confirmPassword)}
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.confirmPassword}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </Form>

        <p className="text-center text-muted small mt-4 mb-0">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
