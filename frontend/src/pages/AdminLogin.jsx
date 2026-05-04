import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { theme, toggle }       = useTheme();
  const navigate                = useNavigate();

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
      if (!res.ok) { setError(data.message || 'Invalid credentials.'); return; }
      localStorage.setItem('vinnoshiv_admin_token',    data.token);
      localStorage.setItem('vinnoshiv_admin_username', data.username);
      navigate('/admin');
    } catch {
      setError('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrap">
            <img src="/logo.png" alt="Vinnoshiv" style={{ width:40, height:40, borderRadius:10, objectFit:'cover' }} />
          </div>
          <h1>Sign in to Admin</h1>
          <p>Vinnoshiv Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-banner">
              <i className="fas fa-triangle-exclamation"></i> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="un">Username</label>
            <input
              id="un" type="text" placeholder="Enter username"
              value={username} onChange={e => setUsername(e.target.value)}
              required autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pw">Password</label>
            <input
              id="pw" type="password" placeholder="Enter password"
              value={password} onChange={e => setPassword(e.target.value)}
              required autoComplete="current-password"
            />
          </div>

          <button className="login-submit" type="submit" disabled={loading}>
            {loading
              ? <><i className="fas fa-circle-notch fa-spin"></i> Signing in…</>
              : <><i className="fas fa-right-to-bracket"></i> Sign In</>}
          </button>
        </form>

        <div className="login-divider"><span>or</span></div>

        <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center' }}>
          <Link to="/" className="btn btn-ghost btn-sm" style={{ textDecoration:'none', fontSize:'0.8rem', color:'var(--text-3)' }}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
          <button onClick={toggle} className="btn btn-ghost btn-sm" style={{ fontSize:'0.8rem', color:'var(--text-3)', cursor:'pointer', border:'none', background:'none', fontFamily:'var(--font)' }}>
            <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
            {theme === 'dark' ? ' Light' : ' Dark'} mode
          </button>
        </div>
      </div>
    </div>
  );
}
