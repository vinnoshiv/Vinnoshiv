import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/AdminPanel.css';

const NAV = [
  { icon: 'fas fa-gauge', label: 'Overview', id: 'overview' },
  { icon: 'fas fa-tools', label: 'Tools', id: 'tools' },
  { icon: 'fas fa-circle-info', label: 'Site Info', id: 'info' },
];

export default function AdminPanel() {
  const navigate  = useNavigate();
  const { theme, toggle } = useTheme();
  const username  = localStorage.getItem('vinnoshiv_admin_username') || 'Admin';
  const [verified, setVerified] = useState(null);
  const [active, setActive]     = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem('vinnoshiv_admin_token');
    fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(() => setVerified(true))
      .catch(() => { localStorage.removeItem('vinnoshiv_admin_token'); navigate('/admin/login'); });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('vinnoshiv_admin_token');
    localStorage.removeItem('vinnoshiv_admin_username');
    navigate('/admin/login');
  };

  if (!verified) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font)', color:'var(--text-4)', gap:'0.5rem' }}>
        <i className="fas fa-circle-notch fa-spin"></i> Verifying session…
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-logo">
          <div className="admin-topbar-logo-icon"><i className="fas fa-bolt"></i></div>
          Vinnoshiv
        </div>
        <div className="admin-topbar-badge">
          <i className="fas fa-user-shield"></i> {username}
        </div>
        <button onClick={toggle} style={{ width:34, height:34, borderRadius:'var(--radius-md)', background:'none', border:'1px solid var(--border)', color:'var(--text-3)', cursor:'pointer', fontSize:'0.8rem' }}>
          <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
        </button>
        <button className="admin-logout" onClick={logout}>
          <i className="fas fa-right-from-bracket"></i> Logout
        </button>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-label">Navigation</div>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`sidebar-item ${active === n.id ? 'active' : ''}`}
              onClick={() => setActive(n.id)}
            >
              <i className={n.icon}></i> {n.label}
            </button>
          ))}

          <div className="sidebar-label">Quick Links</div>
          <Link to="/" className="sidebar-item">
            <i className="fas fa-house"></i> Homepage
          </Link>
          <Link to="/tools/automation" className="sidebar-item">
            <i className="fas fa-robot"></i> Tools Page
          </Link>
          <a href="https://telegram.me/shivamnox" target="_blank" rel="noreferrer" className="sidebar-item">
            <i className="fab fa-telegram"></i> Telegram
          </a>
        </aside>

        {/* Main */}
        <main className="admin-main">
          <div className="admin-main-inner">

            {active === 'overview' && (
              <>
                <div className="admin-page-header">
                  <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {username} 👋</h1>
                  <p>Here's your Vinnoshiv dashboard overview.</p>
                </div>

                <div className="admin-stats-grid">
                  {[
                    { label: 'Total Tools', value: '4', sub: 'Active listings', icon: 'fas fa-tools', cls: 'stat-purple' },
                    { label: 'Customers', value: '100+', sub: 'Lifetime buyers', icon: 'fas fa-users', cls: 'stat-green' },
                    { label: 'Revenue', value: '₹—', sub: 'Manual tracking', icon: 'fas fa-indian-rupee-sign', cls: 'stat-blue' },
                    { label: 'Support Tickets', value: '0', sub: 'Open right now', icon: 'fas fa-headset', cls: 'stat-amber' },
                  ].map(s => (
                    <div className="admin-stat" key={s.label}>
                      <div className="admin-stat-top">
                        <span className="admin-stat-label">{s.label}</span>
                        <div className={`admin-stat-icon ${s.cls}`}><i className={s.icon}></i></div>
                      </div>
                      <div className="admin-stat-value">{s.value}</div>
                      <div className="admin-stat-sub">{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="admin-panel-grid">
                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <div className="admin-panel-title"><i className="fas fa-bolt"></i> Quick Actions</div>
                    </div>
                    <div className="admin-panel-body">
                      <div className="quick-links-grid">
                        <Link to="/" className="quick-link"><i className="fas fa-house"></i> View Home</Link>
                        <Link to="/tools/automation" className="quick-link"><i className="fas fa-robot"></i> Tools Page</Link>
                        <a href="mailto:vinnoshiv@gmail.com" className="quick-link"><i className="fas fa-envelope"></i> Send Email</a>
                        <a href="https://telegram.me/shivamnox" target="_blank" rel="noreferrer" className="quick-link"><i className="fab fa-telegram"></i> Telegram</a>
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <div className="admin-panel-title"><i className="fas fa-circle-info"></i> Site Status</div>
                    </div>
                    <div className="admin-panel-body">
                      <div className="info-row">
                        <span className="info-row-label">Server</span>
                        <span className="info-row-value status-live">Online</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Session</span>
                        <span className="info-row-value">Active — 8h token</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Theme</span>
                        <span className="info-row-value" style={{ textTransform:'capitalize' }}>{theme}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Version</span>
                        <span className="info-row-value">v1.0.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {active === 'info' && (
              <>
                <div className="admin-page-header">
                  <h1>Site Information</h1>
                  <p>Brand and contact details for Vinnoshiv.</p>
                </div>
                <div className="admin-panel">
                  <div className="admin-panel-head">
                    <div className="admin-panel-title"><i className="fas fa-building"></i> Brand Details</div>
                  </div>
                  <div className="admin-panel-body">
                    {[
                      ['Brand Name', 'Vinnoshiv'],
                      ['Contact Email', 'vinnoshiv@gmail.com'],
                      ['Telegram Handle', '@shivamnox'],
                      ['Telegram Link', 'telegram.me/shivamnox'],
                      ['Tools Page', '/tools/automation'],
                      ['Admin Route', '/admin'],
                    ].map(([label, value]) => (
                      <div className="info-row" key={label}>
                        <span className="info-row-label">{label}</span>
                        <span className="info-row-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {active === 'tools' && (
              <>
                <div className="admin-page-header">
                  <h1>Tools Overview</h1>
                  <p>All listed automation tools on the store.</p>
                </div>
                <div className="admin-panel">
                  <div className="admin-panel-head">
                    <div className="admin-panel-title"><i className="fas fa-tools"></i> Listed Products</div>
                  </div>
                  <div className="admin-panel-body">
                    {[
                      { name: 'AnimeFlix Auto Scraper', price: '₹799', old: '₹1,999', ref: 'animeflix' },
                      { name: 'YouTube Downloader Bot', price: '₹999', old: '₹3,499', ref: 'youtube' },
                      { name: 'Instagram Auto DM Bot', price: '₹699', old: '₹1,499', ref: 'instagram' },
                      { name: 'Telegram Channel Bot', price: '₹599', old: '₹999', ref: 'telegram' },
                    ].map(t => (
                      <div className="info-row" key={t.ref}>
                        <span className="info-row-label">{t.name}</span>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                          <span className="info-row-value">{t.price}</span>
                          <Link
                            to={`/tools/automation?ref=${t.ref}`}
                            style={{ fontSize:'0.75rem', color:'var(--accent-text)', textDecoration:'none', fontWeight:600 }}
                          >
                            View <i className="fas fa-arrow-right" style={{ fontSize:'0.65rem' }}></i>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
