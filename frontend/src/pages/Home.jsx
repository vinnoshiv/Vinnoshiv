import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const products = [
  {
    key: 'animeflix',
    icon: 'fas fa-dragon',
    iconClass: 'animeflix',
    iconStyle: { background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' },
    title: 'AnimeFlix Scraper',
    desc: 'Auto scrape & upload anime to Telegram 24/7',
    price: '₹799',
  },
  {
    key: 'youtube',
    icon: 'fab fa-youtube',
    iconClass: 'youtube',
    iconStyle: { background: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    title: 'YouTube Downloader Bot',
    desc: 'Download any YouTube video via Telegram bot',
    price: '₹999',
  },
  {
    key: 'instagram',
    icon: 'fab fa-instagram',
    iconClass: 'instagram',
    iconStyle: { background: 'linear-gradient(135deg, #f59e0b, #ec4899)' },
    title: 'Instagram Auto DM Bot',
    desc: 'Automate Instagram DMs & grow your audience',
    price: '₹699',
  },
  {
    key: 'telegram',
    icon: 'fab fa-telegram',
    iconClass: 'telegram',
    iconStyle: { background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
    title: 'Telegram Channel Bot',
    desc: 'Auto-post, schedule & manage your channel',
    price: '₹599',
  },
];

export default function Home() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">Vinnoshiv</div>
        <ul className="navbar-links">
          <li><a href="#about">About</a></li>
          <li><a href="#products">Tools</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-bolt"></i> Automation Tools
          </div>
          <h1>
            Build Smarter,<br />
            <span className="gradient-text">Automate Everything</span>
          </h1>
          <p>
            Vinnoshiv delivers premium automation bots and scripts for Telegram,
            YouTube, Instagram and more — built for creators, developers, and
            digital entrepreneurs.
          </p>
          <div className="hero-buttons">
            <Link to="/tools/automation" className="btn-primary">
              <i className="fas fa-rocket"></i> Browse Tools
            </Link>
            <a href="#contact" className="btn-secondary">
              <i className="fab fa-telegram"></i> Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-section">
        <div className="stat-item">
          <div className="number">4+</div>
          <div className="label">Automation Tools</div>
        </div>
        <div className="stat-item">
          <div className="number">100+</div>
          <div className="label">Happy Customers</div>
        </div>
        <div className="stat-item">
          <div className="number">24/7</div>
          <div className="label">Support</div>
        </div>
        <div className="stat-item">
          <div className="number">∞</div>
          <div className="label">Lifetime Access</div>
        </div>
      </div>

      {/* About */}
      <section className="about-section" id="about">
        <div className="section-tag">About Us</div>
        <h2>Who is Vinnoshiv?</h2>
        <p>
          Vinnoshiv is an independent brand focused on building powerful,
          affordable automation tools for the modern internet. We write clean,
          production-ready source code that you own forever.
        </p>
        <p>
          Every tool we sell comes with full source code, detailed documentation,
          and lifetime updates — no subscriptions, no hidden fees.
        </p>
        <div className="about-cards">
          <div className="about-card">
            <div className="about-card-icon"><i className="fas fa-code"></i></div>
            <h3>Full Source Code</h3>
            <p>You get the complete, readable code — not a compiled black box.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon"><i className="fas fa-infinity"></i></div>
            <h3>Lifetime Updates</h3>
            <p>Buy once and receive all future updates at no extra cost.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon"><i className="fas fa-headset"></i></div>
            <h3>Telegram Support</h3>
            <p>Get help directly on Telegram — fast, personal, and reliable.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon"><i className="fas fa-lock"></i></div>
            <h3>One-Time Payment</h3>
            <p>No subscriptions. Pay once, use it forever on your own server.</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="products-section" id="products">
        <div className="section-tag">Our Tools</div>
        <h2>Automation Tools</h2>
        <p className="sub">Click any tool to view details and pricing.</p>
        <div className="products-grid">
          {products.map((p) => (
            <Link
              key={p.key}
              to={`/tools/automation?ref=${p.key}`}
              className="product-card"
            >
              <div className="product-card-icon" style={p.iconStyle}>
                <i className={p.icon}></i>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="product-card-price">{p.price}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section" id="contact">
        <div className="section-tag">Get In Touch</div>
        <h2>Contact Us</h2>
        <p>Have questions? Reach out via email or any of our social channels.</p>
        <div className="contact-card">
          <div className="contact-email">
            <i className="fas fa-envelope"></i>
            vinnoshiv@gmail.com
          </div>
          <div className="social-links">
            <a
              href="https://telegram.me/shivamnox"
              className="social-link telegram"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-telegram"></i> Telegram
            </a>
            <a
              href="https://instagram.com/vinnoshiv"
              className="social-link instagram"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a
              href="https://youtube.com/@vinnoshiv"
              className="social-link youtube"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-youtube"></i> YouTube
            </a>
            <a
              href="https://github.com/vinnoshiv"
              className="social-link github"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-github"></i> GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} <span>Vinnoshiv</span>. All rights reserved.</p>
      </footer>
    </>
  );
}
