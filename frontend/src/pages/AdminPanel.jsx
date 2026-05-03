import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const navigate  = useNavigate();
  const username  = localStorage.getItem('vinnoshiv_admin_username') || 'Admin';
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('vinnoshiv_admin_token');
    fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error('unauthorized');
        return r.json();
      })
      .then(() => setVerified(true))
      .catch(() => {
        handleLogout();
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vinnoshiv_admin_token');
    localStorage.removeItem('vinnoshiv_admin_username');
    navigate('/admin/login');
  };

  if (verified === null) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#07070b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '0.5rem' }}></i>
        Verifying session…
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-navbar-logo">Vinnoshiv Admin</div>
        <div className="admin-navbar-right">
          <div className="admin-user-badge">
            <i className="fas fa-user-shield"></i> {username}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="admin-content">
        <div className="admin-welcome">
          <h1>Welcome back, {username} 👋</h1>
          <p>Here's an overview of your Vinnoshiv dashboard.</p>
        </div>

        {/* Stat Cards */}
        <div className="admin-cards">
          <div className="admin-stat-card">
            <div className="card-icon purple"><i className="fas fa-tools"></i></div>
            <h3>Total Tools</h3>
            <div className="value">4</div>
          </div>
          <div className="admin-stat-card">
            <div className="card-icon green"><i className="fas fa-users"></i></div>
            <h3>Customers</h3>
            <div className="value">100+</div>
          </div>
          <div className="admin-stat-card">
            <div className="card-icon blue"><i className="fas fa-envelope"></i></div>
            <h3>Contact Email</h3>
            <div className="value" style={{ fontSize: '0.9rem' }}>vinnoshiv@gmail.com</div>
          </div>
          <div className="admin-stat-card">
            <div className="card-icon red"><i className="fas fa-circle-check"></i></div>
            <h3>Status</h3>
            <div className="value status-dot" style={{ fontSize: '1rem' }}>Live</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="admin-section">
          <div className="admin-section-title">
            <i className="fas fa-bolt"></i> Quick Actions
          </div>
          <div className="quick-links">
            <Link to="/" className="quick-link-btn">
              <i className="fas fa-home"></i> View Homepage
            </Link>
            <Link to="/tools/automation" className="quick-link-btn">
              <i className="fas fa-robot"></i> Tools Page
            </Link>
            <a
              href="https://telegram.me/shivamnox"
              className="quick-link-btn"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-telegram"></i> Telegram
            </a>
            <a
              href="mailto:vinnoshiv@gmail.com"
              className="quick-link-btn"
            >
              <i className="fas fa-envelope"></i> Send Email
            </a>
          </div>
        </div>

        {/* Site Info */}
        <div className="admin-section">
          <div className="admin-section-title">
            <i className="fas fa-circle-info"></i> Site Information
          </div>
          <div className="admin-info-row">
            <span className="info-label">Brand Name</span>
            <span className="info-value">Vinnoshiv</span>
          </div>
          <div className="admin-info-row">
            <span className="info-label">Contact Email</span>
            <span className="info-value">vinnoshiv@gmail.com</span>
          </div>
          <div className="admin-info-row">
            <span className="info-label">Telegram</span>
            <span className="info-value">@shivamnox</span>
          </div>
          <div className="admin-info-row">
            <span className="info-label">Tools Page</span>
            <span className="info-value">/tools/automation</span>
          </div>
          <div className="admin-info-row">
            <span className="info-label">Server Status</span>
            <span className="info-value status-dot">Online</span>
          </div>
          <div className="admin-info-row">
            <span className="info-label">Session</span>
            <span className="info-value">Active (8h token)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
