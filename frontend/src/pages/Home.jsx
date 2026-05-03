import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/Home.css';

const PRODUCTS = [
  {
    key: 'animeflix',
    icon: 'fas fa-dragon',
    style: { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' },
    name: 'AnimeFlix Scraper',
    desc: 'Auto-scrape & upload anime releases to Telegram 24/7',
    price: '₹799',
    old: '₹1,999',
  },
  {
    key: 'youtube',
    icon: 'fab fa-youtube',
    style: { background: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    name: 'YouTube Downloader Bot',
    desc: 'Download any YouTube video via Telegram, no cookies needed',
    price: '₹999',
    old: '₹3,499',
  },
  {
    key: 'instagram',
    icon: 'fab fa-instagram',
    style: { background: 'linear-gradient(135deg, #f59e0b, #ec4899)' },
    name: 'Instagram Auto DM Bot',
    desc: 'Automate DMs, story reactions & follower growth',
    price: '₹699',
    old: '₹1,499',
  },
  {
    key: 'telegram',
    icon: 'fab fa-telegram',
    style: { background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
    name: 'Telegram Channel Bot',
    desc: 'Schedule posts, RSS feeds & auto-manage your channel',
    price: '₹599',
    old: '₹999',
  },
];

const FEATURES = [
  { icon: 'fas fa-code', title: 'Full Source Code', desc: 'Clean, documented, production-ready code — yours to own and modify.' },
  { icon: 'fas fa-rotate', title: 'Lifetime Updates', desc: 'Pay once and receive every future update at absolutely no extra cost.' },
  { icon: 'fas fa-bolt', title: 'Instant Delivery', desc: 'Receive your purchase immediately via Telegram after payment.' },
  { icon: 'fas fa-headset', title: 'Telegram Support', desc: 'Fast personal support directly on Telegram — real humans, not bots.' },
  { icon: 'fas fa-server', title: 'Self-Hosted', desc: 'Run on your own VPS. No subscriptions, no third-party dependencies.' },
  { icon: 'fas fa-shield-halved', title: 'Secure & Reliable', desc: 'Production-tested scripts with built-in rate limiting and error handling.' },
];

export default function Home() {
  const { theme, toggle } = useTheme();

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon"><i className="fas fa-bolt"></i></div>
            Vinnoshiv
          </Link>

          <ul className="navbar-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>
            <Link to="/tools/automation" className="navbar-cta">
              Browse Tools <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-noise" />
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Automation tools for creators &amp; developers
          </div>

          <h1>
            The fastest way to<br />
            <em>automate your workflow</em>
          </h1>

          <p className="hero-sub">
            Premium Telegram bots and automation scripts — built for speed,
            sold with full source code, and supported for life.
          </p>

          <div className="hero-actions">
            <Link to="/tools/automation" className="btn btn-primary btn-lg">
              <i className="fas fa-rocket"></i> Explore Tools
            </Link>
            <a href="#about" className="btn btn-outline btn-lg">
              Learn more
            </a>
          </div>

          <div className="social-proof">
            <div className="social-proof-avatars">
              {['S', 'R', 'A', 'M', 'K'].map((l, i) => (
                <div className="avatar-bubble" key={i}>{l}</div>
              ))}
            </div>
            <div className="stars">
              {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
            </div>
            <span className="social-proof-text">Trusted by 100+ customers</span>
          </div>
        </div>
      </section>

      {/* ── Logo Bar ── */}
      <div className="logo-bar">
        <div className="logo-bar-label">Works with</div>
        <div className="logo-bar-items">
          {[
            { icon: 'fab fa-telegram', label: 'Telegram' },
            { icon: 'fab fa-youtube', label: 'YouTube' },
            { icon: 'fab fa-instagram', label: 'Instagram' },
            { icon: 'fab fa-node-js', label: 'Node.js' },
            { icon: 'fab fa-python', label: 'Python' },
            { icon: 'fas fa-server', label: 'VPS / Linux' },
          ].map((item) => (
            <div className="logo-bar-item" key={item.label}>
              <i className={item.icon}></i>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge"><i className="fas fa-star"></i> Why Vinnoshiv</div>
            <h2 className="section-title">Everything you need, nothing you don't</h2>
            <p className="section-desc">
              Every product ships with the things that actually matter to developers and creators.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-cell" key={f.title}>
                <div className="feature-icon"><i className={f.icon}></i></div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="section" id="products" style={{ background: 'var(--bg-subtle)' }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge"><i className="fas fa-tools"></i> Automation Tools</div>
            <h2 className="section-title">Pick your automation</h2>
            <p className="section-desc">
              One-time payment, lifetime access, full source code included with every tool.
            </p>
          </div>

          <div className="products-grid">
            {PRODUCTS.map((p) => (
              <Link
                key={p.key}
                to={`/tools/automation?ref=${p.key}`}
                className="product-card"
              >
                <div className="product-card-badge">Popular</div>
                <div className="product-card-icon" style={p.style}>
                  <i className={p.icon}></i>
                </div>
                <div className="product-card-name">{p.name}</div>
                <div className="product-card-desc">{p.desc}</div>
                <div className="product-card-footer">
                  <div>
                    <span className="product-card-old">{p.old}</span>
                    <span className="product-card-price">{p.price}</span>
                  </div>
                  <div className="product-card-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="section" id="about">
        <div className="section-inner">
          <div className="about-layout">
            <div className="about-text">
              <span className="label">About Vinnoshiv</span>
              <h2>Built by a developer,<br />for developers</h2>
              <p>
                Vinnoshiv is an independent brand that creates affordable, production-grade
                automation tools for Telegram, YouTube, Instagram, and beyond.
              </p>
              <p>
                Every tool is hand-crafted, thoroughly tested, and documented — so you
                can deploy in minutes and build on top of it without friction.
              </p>
              <div className="about-checks">
                {[
                  'Full source code', 'Lifetime updates',
                  'Self-hostable', 'No subscriptions',
                  'Telegram support', 'Instant delivery',
                ].map((item) => (
                  <div className="about-check" key={item}>
                    <i className="fas fa-circle-check"></i> {item}
                  </div>
                ))}
              </div>
              <a
                href="https://telegram.me/shivamnox"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-md"
              >
                <i className="fab fa-telegram"></i> Chat on Telegram
              </a>
            </div>

            <div className="about-visual">
              <div className="about-card-stack">
                {[
                  { icon: 'fas fa-tools', iconStyle: { background: 'rgba(124,58,237,0.12)', color: '#7c3aed' }, label: 'Total Products', value: '4+', sub: 'and growing' },
                  { icon: 'fas fa-users', iconStyle: { background: 'rgba(5,150,105,0.12)', color: '#059669' }, label: 'Happy Customers', value: '100+', sub: 'across India' },
                  { icon: 'fas fa-rotate', iconStyle: { background: 'rgba(14,165,233,0.12)', color: '#0ea5e9' }, label: 'Updates Shipped', value: '∞', sub: 'lifetime, free' },
                  { icon: 'fas fa-bolt', iconStyle: { background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }, label: 'Avg. Response Time', value: '< 2h', sub: 'support on Telegram' },
                ].map((s) => (
                  <div className="mini-stat-card" key={s.label}>
                    <div className="mini-stat-icon" style={s.iconStyle}>
                      <i className={s.icon}></i>
                    </div>
                    <div className="mini-stat-info">
                      <h4>{s.value}</h4>
                      <p>{s.label} — {s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="section" id="contact" style={{ background: 'var(--bg-subtle)' }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge"><i className="fas fa-envelope"></i> Get in touch</div>
            <h2 className="section-title">We're here to help</h2>
            <p className="section-desc">
              Questions before buying? Pre-sales queries? Reach out — we usually reply within 2 hours.
            </p>
          </div>

          <div className="contact-box">
            <div className="contact-email-display">
              <i className="fas fa-envelope"></i>
              vinnoshiv@gmail.com
            </div>

            <div className="social-row">
              <a href="https://telegram.me/shivamnox" target="_blank" rel="noreferrer" className="social-pill tg">
                <i className="fab fa-telegram"></i> @shivamnox
              </a>
              <a href="https://instagram.com/vinnoshiv" target="_blank" rel="noreferrer" className="social-pill ig">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="https://youtube.com/@vinnoshiv" target="_blank" rel="noreferrer" className="social-pill yt">
                <i className="fab fa-youtube"></i> YouTube
              </a>
              <a href="https://github.com/vinnoshiv" target="_blank" rel="noreferrer" className="social-pill gh">
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <div className="navbar-logo-icon" style={{ width: 22, height: 22, borderRadius: 5, fontSize: '0.6rem' }}>
              <i className="fas fa-bolt"></i>
            </div>
            Vinnoshiv
          </div>
          <div className="footer-copy">© {new Date().getFullYear()} Vinnoshiv. All rights reserved.</div>
          <div className="footer-links">
            <Link to="/tools/automation">Tools</Link>
            <Link to="/admin/login">Admin</Link>
            <a href="mailto:vinnoshiv@gmail.com">Email</a>
          </div>
        </div>
      </footer>
    </>
  );
}
