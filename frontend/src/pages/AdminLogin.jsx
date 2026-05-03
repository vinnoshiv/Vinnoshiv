import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed. Check your credentials.');
        return;
      }

      localStorage.setItem('vinnoshiv_admin_token',    data.token);
      localStorage.setItem('vinnoshiv_admin_username', data.username);
      navigate('/admin');
    } catch (err) {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <i className="fas fa-shield-halved"></i>
          </div>
          <h1>Vinnoshiv Admin</h1>
          <p>Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-msg">
              <i className="fas fa-circle-exclamation"></i> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <><i className="fas fa-circle-notch fa-spin"></i> Signing in...</>
            ) : (
              <><i className="fas fa-right-to-bracket"></i> Sign In</>
            )}
          </button>
        </form>

        <div className="back-home">
          <Link to="/">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
