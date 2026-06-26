import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@inboxintel.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow border-0 p-4 w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div className="d-inline-block p-3 bg-primary bg-opacity-10 rounded-circle mb-3">
            <i className="bi bi-lightning-charge-fill text-primary fs-2"></i>
          </div>
          <h1 className="h4 fw-bold mb-1">Welcome Back</h1>
          <p className="text-muted small">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">EMAIL ADDRESS</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-1">
              <label className="form-label small fw-bold text-muted mb-0">PASSWORD</label>
              <a href="#" className="small text-decoration-none">Forgot?</a>
            </div>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
            SIGN IN
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="small text-muted mb-0">
            Don't have an account? <a href="#" className="fw-bold text-decoration-none">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
