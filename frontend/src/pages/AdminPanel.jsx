import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/AdminPanel.css';

const NAV = [
  { icon: 'fas fa-gauge',       label: 'Overview',   id: 'overview' },
  { icon: 'fas fa-store',       label: 'Tool Store',  id: 'tools' },
  { icon: 'fas fa-chart-bar',   label: 'Analytics',  id: 'analytics' },
  { icon: 'fas fa-envelope',    label: 'Messages',   id: 'messages' },
  { icon: 'fas fa-circle-info', label: 'Site Info',  id: 'info' },
];

const PRODUCTS = [
  { name: 'AnimeFlix Auto Scraper',  price: '₹799',  old: '₹1,999', ref: 'animeflix',  icon: 'fas fa-dragon',    color: '#7c3aed', sales: 38, status: 'active' },
  { name: 'YouTube Downloader Bot',  price: '₹999',  old: '₹3,499', ref: 'youtube',    icon: 'fab fa-youtube',   color: '#dc2626', sales: 29, status: 'active' },
  { name: 'Instagram Auto DM Bot',   price: '₹699',  old: '₹1,499', ref: 'instagram',  icon: 'fab fa-instagram', color: '#e11d77', sales: 21, status: 'active' },
  { name: 'Telegram Channel Bot',    price: '₹599',  old: '₹999',   ref: 'telegram',   icon: 'fab fa-telegram',  color: '#0088cc', sales: 17, status: 'active' },
];

const ACTIVITY = [
  { icon: 'fas fa-user-plus',   color: 'var(--green)',   text: 'New customer via AnimeFlix link',         time: '2 min ago' },
  { icon: 'fas fa-store',       color: 'var(--accent)',  text: 'Tool Store visited from Telegram DM',      time: '18 min ago' },
  { icon: 'fas fa-envelope',    color: '#0ea5e9',        text: 'New message from contact form',            time: '1 hr ago' },
  { icon: 'fas fa-user-plus',   color: 'var(--green)',   text: 'New customer via YouTube Bot ref link',    time: '3 hr ago' },
  { icon: 'fas fa-shield-halved', color: 'var(--accent)', text: 'Admin login — session started',          time: '8 hr ago' },
];

const MESSAGES = [
  { name: 'Rahul M.',    avatar: 'R', subject: 'AnimeFlix bot query',         preview: 'Hey, does the scraper support multiple...', time: '5m ago',   unread: true },
  { name: 'Sneha K.',    avatar: 'S', subject: 'Payment done, awaiting link', preview: 'I completed the UPI payment for YouTube...', time: '42m ago',  unread: true },
  { name: 'Arjun D.',    avatar: 'A', subject: 'Setup help needed',           preview: 'Getting an error on first run, can you...', time: '2h ago',   unread: false },
  { name: 'Priya N.',    avatar: 'P', subject: 'Lifetime update question',    preview: 'Will the Instagram bot support Reels in...', time: '1d ago',   unread: false },
  { name: 'Kiran T.',    avatar: 'K', subject: 'Great product!',              preview: 'Just wanted to say the Telegram bot works...', time: '2d ago', unread: false },
];

const WEEKLY = [
  { day: 'Mon', visits: 42, sales: 2 },
  { day: 'Tue', visits: 61, sales: 3 },
  { day: 'Wed', visits: 55, sales: 4 },
  { day: 'Thu', visits: 78, sales: 6 },
  { day: 'Fri', visits: 93, sales: 8 },
  { day: 'Sat', visits: 110, sales: 11 },
  { day: 'Sun', visits: 87, sales: 7 },
];
const MAX_VISITS = Math.max(...WEEKLY.map(d => d.visits));
const MAX_SALES  = Math.max(...WEEKLY.map(d => d.sales));

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="admin-clock">
      {now.toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
      {' · '}
      {now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
    </span>
  );
}

export default function AdminPanel() {
  const navigate  = useNavigate();
  const { theme, toggle } = useTheme();
  const username  = localStorage.getItem('vinnoshiv_admin_username') || 'Admin';
  const [verified, setVerified]   = useState(null);
  const [active, setActive]       = useState('overview');
  const [sidebarOpen, setSidebar] = useState(false);
  const [copied, setCopied]       = useState('');
  const [openMsg, setOpenMsg]     = useState(null);

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

  const copyText = useCallback((text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  }, []);

  const navTo = (id) => { setActive(id); setSidebar(false); };

  if (!verified) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font)', color:'var(--text-4)', gap:'0.5rem' }}>
        <i className="fas fa-circle-notch fa-spin"></i> Verifying session…
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebar(false)} />}

      {/* ── Top Bar ── */}
      <header className="admin-topbar">
        <button className="hamburger" onClick={() => setSidebar(o => !o)} aria-label="Menu">
          <i className={sidebarOpen ? 'fas fa-xmark' : 'fas fa-bars'}></i>
        </button>

        <div className="admin-topbar-logo">
          <img src="/logo.png" alt="Vinnoshiv" className="admin-topbar-logo-icon" />
          Vinnoshiv
        </div>

        <Clock />

        <div className="admin-topbar-badge">
          <i className="fas fa-user-shield"></i> {username}
        </div>

        <button onClick={toggle} className="admin-icon-btn" title="Toggle theme">
          <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
        </button>

        <button className="admin-logout" onClick={logout}>
          <i className="fas fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </header>

      <div className="admin-body">
        {/* ── Sidebar ── */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-section-label">Navigation</div>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`sidebar-item ${active === n.id ? 'active' : ''}`}
              onClick={() => navTo(n.id)}
            >
              <i className={n.icon}></i> {n.label}
              {n.id === 'messages' && <span className="sidebar-badge">2</span>}
            </button>
          ))}

          <div className="sidebar-section-label">Quick Links</div>
          <Link to="/" className="sidebar-item" onClick={() => setSidebar(false)}>
            <i className="fas fa-house"></i> Homepage
          </Link>
          <Link to="/tools/automation" className="sidebar-item" onClick={() => setSidebar(false)}>
            <i className="fas fa-store"></i> Tool Store
          </Link>
          <a href="https://telegram.me/shivamnox" target="_blank" rel="noreferrer" className="sidebar-item">
            <i className="fab fa-telegram"></i> Telegram
          </a>

          <div className="sidebar-footer">
            <div className="sidebar-status-dot"></div>
            <span>All systems online</span>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="admin-main">
          <div className="admin-main-inner">

            {/* ══ OVERVIEW ══ */}
            {active === 'overview' && (
              <>
                <div className="admin-page-header">
                  <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {username} 👋</h1>
                  <p>Here's your Vinnoshiv dashboard overview.</p>
                </div>

                <div className="admin-stats-grid">
                  {[
                    { label:'Total Tools',       value:'4',    sub:'+0 this week',    icon:'fas fa-tools',              cls:'stat-purple', trend:null },
                    { label:'Customers',          value:'100+', sub:'↑ 12 this month', icon:'fas fa-users',              cls:'stat-green',  trend:'up' },
                    { label:'Revenue',            value:'₹—',   sub:'Manual tracking', icon:'fas fa-indian-rupee-sign',  cls:'stat-blue',   trend:null },
                    { label:'Support Tickets',    value:'2',    sub:'Open right now',  icon:'fas fa-headset',            cls:'stat-amber',  trend:'warn' },
                  ].map(s => (
                    <div className="admin-stat" key={s.label}>
                      <div className="admin-stat-top">
                        <span className="admin-stat-label">{s.label}</span>
                        <div className={`admin-stat-icon ${s.cls}`}><i className={s.icon}></i></div>
                      </div>
                      <div className="admin-stat-value">{s.value}</div>
                      <div className="admin-stat-sub">
                        {s.trend === 'up'   && <span className="trend-up"><i className="fas fa-arrow-trend-up"></i></span>}
                        {s.trend === 'warn' && <span className="trend-warn"><i className="fas fa-circle-exclamation"></i></span>}
                        {s.sub}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-panel-grid">
                  {/* Quick Actions */}
                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <div className="admin-panel-title"><i className="fas fa-bolt"></i> Quick Actions</div>
                    </div>
                    <div className="admin-panel-body">
                      <div className="quick-links-grid">
                        <Link to="/" className="quick-link"><i className="fas fa-house"></i> View Home</Link>
                        <Link to="/tools/automation" className="quick-link"><i className="fas fa-store"></i> Tool Store</Link>
                        <button className="quick-link" onClick={() => navTo('analytics')}><i className="fas fa-chart-bar"></i> Analytics</button>
                        <button className="quick-link" onClick={() => navTo('messages')}><i className="fas fa-envelope"></i> Messages <span className="quick-badge">2</span></button>
                        <a href="mailto:vinnoshiv@gmail.com" className="quick-link"><i className="fas fa-envelope"></i> Send Email</a>
                        <a href="https://telegram.me/shivamnox" target="_blank" rel="noreferrer" className="quick-link"><i className="fab fa-telegram"></i> Telegram</a>
                      </div>
                    </div>
                  </div>

                  {/* Site Status */}
                  <div className="admin-panel">
                    <div className="admin-panel-head">
                      <div className="admin-panel-title"><i className="fas fa-server"></i> Site Status</div>
                    </div>
                    <div className="admin-panel-body">
                      <div className="info-row">
                        <span className="info-row-label">Server</span>
                        <span className="status-live">Online</span>
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
                        <span className="info-row-label">MongoDB</span>
                        <span className="status-warn">IP not whitelisted</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Version</span>
                        <span className="info-row-value">v1.0.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="admin-panel" style={{ marginTop:'1rem' }}>
                  <div className="admin-panel-head">
                    <div className="admin-panel-title"><i className="fas fa-clock-rotate-left"></i> Recent Activity</div>
                    <span className="panel-badge">Live</span>
                  </div>
                  <div className="admin-panel-body" style={{ padding:'0.5rem 1.25rem' }}>
                    {ACTIVITY.map((a, i) => (
                      <div className="activity-row" key={i}>
                        <div className="activity-icon" style={{ color: a.color }}>
                          <i className={a.icon}></i>
                        </div>
                        <div className="activity-text">{a.text}</div>
                        <div className="activity-time">{a.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══ TOOL STORE ══ */}
            {active === 'tools' && (
              <>
                <div className="admin-page-header">
                  <h1>Tool Store</h1>
                  <p>All listed products and their performance.</p>
                </div>

                <div className="products-grid">
                  {PRODUCTS.map(p => (
                    <div className="product-card" key={p.ref}>
                      <div className="product-card-top" style={{ background: p.color }}></div>
                      <div className="product-card-body">
                        <div className="product-card-header">
                          <div className="product-icon" style={{ background: `${p.color}18`, color: p.color }}>
                            <i className={p.icon}></i>
                          </div>
                          <span className={`product-status ${p.status}`}>{p.status}</span>
                        </div>
                        <div className="product-name">{p.name}</div>
                        <div className="product-pricing">
                          <span className="product-price">{p.price}</span>
                          <span className="product-old">{p.old}</span>
                        </div>
                        <div className="product-stats-row">
                          <div className="product-stat-item">
                            <i className="fas fa-users"></i>
                            <span>{p.sales} sales</span>
                          </div>
                          <div className="product-stat-item">
                            <i className="fas fa-link"></i>
                            <span>ref={p.ref}</span>
                          </div>
                        </div>
                        <div className="product-actions">
                          <Link to={`/tools/automation?ref=${p.ref}`} className="product-btn product-btn-ghost">
                            <i className="fas fa-eye"></i> View
                          </Link>
                          <button
                            className={`product-btn product-btn-ghost ${copied === p.ref ? 'copied' : ''}`}
                            onClick={() => copyText(`${window.location.origin}/tools/automation?ref=${p.ref}`, p.ref)}
                          >
                            <i className={copied === p.ref ? 'fas fa-check' : 'fas fa-copy'}></i>
                            {copied === p.ref ? 'Copied!' : 'Copy Link'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-panel" style={{ marginTop:'1.5rem' }}>
                  <div className="admin-panel-head">
                    <div className="admin-panel-title"><i className="fas fa-ranking-star"></i> Sales Breakdown</div>
                  </div>
                  <div className="admin-panel-body">
                    {PRODUCTS.map(p => (
                      <div className="sales-row" key={p.ref}>
                        <div className="sales-name">
                          <i className={p.icon} style={{ color: p.color, width:16, textAlign:'center' }}></i>
                          {p.name}
                        </div>
                        <div className="sales-bar-wrap">
                          <div className="sales-bar" style={{ width:`${(p.sales / 38) * 100}%`, background: p.color }}></div>
                        </div>
                        <span className="sales-count">{p.sales}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══ ANALYTICS ══ */}
            {active === 'analytics' && (
              <>
                <div className="admin-page-header">
                  <h1>Analytics</h1>
                  <p>Weekly traffic and sales overview — last 7 days.</p>
                </div>

                <div className="admin-stats-grid" style={{ marginBottom:'1.5rem' }}>
                  {[
                    { label:'Total Visits',   value:'526',  sub:'This week', icon:'fas fa-eye',          cls:'stat-purple' },
                    { label:'Total Sales',    value:'41',   sub:'This week', icon:'fas fa-bag-shopping',  cls:'stat-green' },
                    { label:'Conversion',     value:'7.8%', sub:'Visits→sales', icon:'fas fa-percent',   cls:'stat-blue' },
                    { label:'Avg. Daily',     value:'75',   sub:'Visits/day', icon:'fas fa-chart-line',   cls:'stat-amber' },
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

                <div className="admin-panel">
                  <div className="admin-panel-head">
                    <div className="admin-panel-title"><i className="fas fa-chart-column"></i> Daily Visits</div>
                    <span className="chart-legend"><span className="legend-dot" style={{ background:'var(--accent)' }}></span> Visits</span>
                  </div>
                  <div className="admin-panel-body">
                    <div className="bar-chart">
                      {WEEKLY.map(d => (
                        <div className="bar-col" key={d.day}>
                          <div className="bar-val">{d.visits}</div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ height:`${(d.visits / MAX_VISITS) * 100}%`, background:'var(--accent)' }}></div>
                          </div>
                          <div className="bar-label">{d.day}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="admin-panel" style={{ marginTop:'1rem' }}>
                  <div className="admin-panel-head">
                    <div className="admin-panel-title"><i className="fas fa-chart-column"></i> Daily Sales</div>
                    <span className="chart-legend"><span className="legend-dot" style={{ background:'var(--green)' }}></span> Sales</span>
                  </div>
                  <div className="admin-panel-body">
                    <div className="bar-chart">
                      {WEEKLY.map(d => (
                        <div className="bar-col" key={d.day}>
                          <div className="bar-val">{d.sales}</div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ height:`${(d.sales / MAX_SALES) * 100}%`, background:'var(--green)' }}></div>
                          </div>
                          <div className="bar-label">{d.day}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="admin-panel" style={{ marginTop:'1rem' }}>
                  <div className="admin-panel-head">
                    <div className="admin-panel-title"><i className="fas fa-arrow-pointer"></i> Top Ref Sources</div>
                  </div>
                  <div className="admin-panel-body">
                    {[
                      { source:'Telegram DM',      pct:42, color:'#0088cc' },
                      { source:'Direct link',       pct:28, color:'var(--accent)' },
                      { source:'Instagram bio',     pct:17, color:'#e11d77' },
                      { source:'YouTube desc',      pct:13, color:'#dc2626' },
                    ].map(s => (
                      <div className="source-row" key={s.source}>
                        <div className="source-name">{s.source}</div>
                        <div className="source-bar-wrap">
                          <div className="source-bar" style={{ width:`${s.pct}%`, background: s.color }}></div>
                        </div>
                        <span className="source-pct">{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ══ MESSAGES ══ */}
            {active === 'messages' && (
              <>
                <div className="admin-page-header">
                  <h1>Messages</h1>
                  <p>Contact form submissions and customer enquiries.</p>
                </div>

                <div className="messages-layout">
                  <div className="messages-list">
                    {MESSAGES.map((m, i) => (
                      <div
                        key={i}
                        className={`message-row ${openMsg === i ? 'selected' : ''} ${m.unread ? 'unread' : ''}`}
                        onClick={() => setOpenMsg(i)}
                      >
                        <div className="message-avatar">{m.avatar}</div>
                        <div className="message-meta">
                          <div className="message-top">
                            <span className="message-name">{m.name}</span>
                            <span className="message-time">{m.time}</span>
                          </div>
                          <div className="message-subject">{m.subject}</div>
                          <div className="message-preview">{m.preview}</div>
                        </div>
                        {m.unread && <div className="unread-dot"></div>}
                      </div>
                    ))}
                  </div>

                  <div className="message-detail">
                    {openMsg !== null ? (
                      <>
                        <div className="detail-header">
                          <div className="detail-avatar">{MESSAGES[openMsg].avatar}</div>
                          <div>
                            <div className="detail-name">{MESSAGES[openMsg].name}</div>
                            <div className="detail-subject">{MESSAGES[openMsg].subject}</div>
                          </div>
                          <span className="detail-time">{MESSAGES[openMsg].time}</span>
                        </div>
                        <div className="detail-body">
                          <p>{MESSAGES[openMsg].preview} and I wanted to know more about the setup process and whether you offer any onboarding support or documentation along with the purchase.</p>
                          <p style={{ marginTop:'1rem' }}>Looking forward to your response.</p>
                          <p style={{ marginTop:'0.5rem', color:'var(--text-4)' }}>— {MESSAGES[openMsg].name}</p>
                        </div>
                        <div className="detail-reply">
                          <textarea placeholder="Write a reply..." rows={3}></textarea>
                          <div className="detail-reply-actions">
                            <a href="https://telegram.me/shivamnox" target="_blank" rel="noreferrer" className="product-btn product-btn-ghost" style={{ textDecoration:'none' }}>
                              <i className="fab fa-telegram"></i> Reply on Telegram
                            </a>
                            <button className="product-btn product-btn-primary">
                              <i className="fas fa-paper-plane"></i> Send Reply
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="detail-empty">
                        <i className="fas fa-envelope-open-text"></i>
                        <p>Select a message to read it</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ══ SITE INFO ══ */}
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
                      { label:'Brand Name',      value:'Vinnoshiv',                  key:'brand' },
                      { label:'Contact Email',   value:'vinnoshiv@gmail.com',         key:'email' },
                      { label:'Telegram Handle', value:'@shivamnox',                  key:'tg' },
                      { label:'Telegram Link',   value:'https://telegram.me/shivamnox', key:'tglink' },
                      { label:'Tools Page',      value:'/tools/automation',            key:'tools' },
                      { label:'Admin Route',     value:'/admin',                       key:'admin' },
                    ].map(({ label, value, key }) => (
                      <div className="info-row" key={key}>
                        <span className="info-row-label">{label}</span>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                          <span className="info-row-value">{value}</span>
                          <button
                            className={`copy-btn ${copied === key ? 'copied' : ''}`}
                            onClick={() => copyText(value, key)}
                            title="Copy"
                          >
                            <i className={copied === key ? 'fas fa-check' : 'fas fa-copy'}></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-panel" style={{ marginTop:'1rem' }}>
                  <div className="admin-panel-head">
                    <div className="admin-panel-title"><i className="fas fa-circle-info"></i> Technical Info</div>
                  </div>
                  <div className="admin-panel-body">
                    {[
                      { label:'Stack',       value:'Node.js + Express + React + Vite' },
                      { label:'Database',    value:'MongoDB Atlas (graceful fallback)' },
                      { label:'Auth',        value:'JWT — env-based credentials' },
                      { label:'Hosting',     value:'Replit Autoscale (Cloud Run)' },
                      { label:'Theme',       value:'Light / Dark — CSS variables' },
                      { label:'Version',     value:'v1.0.0' },
                    ].map(({ label, value }) => (
                      <div className="info-row" key={label}>
                        <span className="info-row-label">{label}</span>
                        <span className="info-row-value">{value}</span>
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
