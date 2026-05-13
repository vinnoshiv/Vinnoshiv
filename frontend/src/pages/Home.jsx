import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/Home.css";

const FEATURES = [
  {
    icon: "fas fa-code",
    title: "Full Source Code",
    desc: "Clean, documented, production-ready code — yours to own and modify forever.",
  },
  {
    icon: "fas fa-rotate",
    title: "Lifetime Updates",
    desc: "Pay once and receive every future update at absolutely no extra cost.",
  },
  {
    icon: "fas fa-bolt",
    title: "Instant Delivery",
    desc: "Receive your purchase immediately via Telegram after payment confirmation.",
  },
  {
    icon: "fas fa-headset",
    title: "Telegram Support",
    desc: "Fast personal support directly on Telegram — real humans, not bots.",
  },
  {
    icon: "fas fa-server",
    title: "Self-Hosted",
    desc: "Run on your own VPS. No subscriptions, no third-party dependencies.",
  },
  {
    icon: "fas fa-shield-halved",
    title: "Secure & Reliable",
    desc: "Production-tested scripts with built-in rate limiting and error handling.",
  },
];

const AUTOMATION_CATEGORIES = [
  {
    icon: "fab fa-telegram",
    title: "Telegram Automation",
    desc: "Powerful bots for channel management, auto-posting, scraping, and more.",
    gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    count: "8+ Tools",
  },
  {
    icon: "fab fa-youtube",
    title: "YouTube Tools",
    desc: "Download, track, and automate your YouTube workflow with ease.",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    count: "5+ Tools",
  },
  {
    icon: "fab fa-instagram",
    title: "Instagram Automation",
    desc: "Auto DM, story reactions, follower growth, and engagement automation.",
    gradient: "linear-gradient(135deg, #f59e0b, #ec4899)",
    count: "6+ Tools",
  },
  {
    icon: "fas fa-robot",
    title: "AI-Powered Bots",
    desc: "Smart automation with ChatGPT integration, content generation, and more.",
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    count: "4+ Tools",
  },
];

const USE_CASES = [
  {
    icon: "fas fa-rocket",
    title: "Content Creators",
    desc: "Automate video downloads, schedule posts, and grow your audience effortlessly.",
  },
  {
    icon: "fas fa-briefcase",
    title: "Digital Marketers",
    desc: "Scale your social media campaigns with intelligent automation and analytics.",
  },
  {
    icon: "fas fa-users",
    title: "Community Managers",
    desc: "Manage multiple channels, auto-moderate, and engage with your community 24/7.",
  },
  {
    icon: "fas fa-laptop-code",
    title: "Developers",
    desc: "Build on top of our clean, documented code to create custom solutions faster.",
  },
];

const STATS = [
  { value: "500+", label: "Active Users", icon: "fas fa-users" },
  { value: "20+", label: "Automation Tools", icon: "fas fa-tools" },
  { value: "99.9%", label: "Uptime", icon: "fas fa-server" },
  { value: "<2h", label: "Support Response", icon: "fas fa-headset" },
];

export default function Home() {
  const { theme, toggle } = useTheme();

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="Vinnoshiv" className="navbar-logo-icon" />
            Vinnoshiv
          </Link>

          <ul className="navbar-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#automation">Automation</a>
            </li>
            <li>
              <a href="#use-cases">Use Cases</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>

          <div className="navbar-actions">
            <button
              className="theme-toggle"
              onClick={toggle}
              aria-label="Toggle theme"
            >
              <i
                className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}
              ></i>
            </button>
            <Link to="/tools/automation" className="navbar-cta">
              <i className="fas fa-store"></i> Browse Store
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
            Your AI-Powered Automation Partner
          </div>

          <h1>
            Automate Everything.
            <br />
            <em>Focus on What Matters.</em>
          </h1>

          <p className="hero-sub">
            Premium automation tools for creators, marketers, and developers.
            Full source code. One-time payment. Lifetime updates. Zero
            subscriptions.
          </p>

          <div className="hero-actions">
            <Link to="/tools/automation" className="btn btn-primary btn-lg">
              <i className="fas fa-rocket"></i> Explore Automation Tools
            </Link>
            <a href="#automation" className="btn btn-outline btn-lg">
              See How It Works
            </a>
          </div>

          <div className="social-proof">
            <div className="social-proof-avatars">
              {["S", "R", "A", "M", "K", "V", "P"].map((l, i) => (
                <div className="avatar-bubble" key={i}>
                  {l}
                </div>
              ))}
            </div>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
            <span className="social-proof-text">
              Trusted by 500+ creators & developers
            </span>
          </div>

          <div className="hero-pills">
            <span className="hero-pill green">
              <i className="fas fa-circle-check"></i> One-time payment
            </span>
            <span className="hero-pill blue">
              <i className="fas fa-code"></i> Full source code
            </span>
            <span className="hero-pill purple">
              <i className="fas fa-brain"></i> AI-powered
            </span>
            <span className="hero-pill green">
              <i className="fas fa-rotate"></i> Lifetime updates
            </span>
            <span className="hero-pill blue">
              <i className="fab fa-telegram"></i> Instant delivery
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          {STATS.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <i className={stat.icon}></i>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Logo Bar ── */}
      <div className="logo-bar">
        <div className="logo-bar-label">
          Powered by industry-leading technologies
        </div>
        <div className="logo-bar-items">
          {[
            { icon: "fab fa-telegram", label: "Telegram" },
            { icon: "fab fa-youtube", label: "YouTube" },
            { icon: "fab fa-instagram", label: "Instagram" },
            { icon: "fas fa-brain", label: "OpenAI" },
            { icon: "fab fa-node-js", label: "Node.js" },
            { icon: "fab fa-python", label: "Python" },
            { icon: "fas fa-server", label: "Cloud VPS" },
            { icon: "fab fa-docker", label: "Docker" },
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
            <div className="section-badge">
              <i className="fas fa-star"></i> Why Choose Vinnoshiv
            </div>
            <h2 className="section-title">Built for the modern developer</h2>
            <p className="section-desc">
              Every automation tool ships with everything you need to deploy,
              customize, and scale.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-cell" key={f.title}>
                <div className="feature-icon">
                  <i className={f.icon}></i>
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Automation Categories ── */}
      <section
        className="section"
        id="automation"
        style={{ background: "var(--bg-subtle)" }}
      >
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-robot"></i> Automation Suite
            </div>
            <h2 className="section-title">Your complete automation toolkit</h2>
            <p className="section-desc">
              From Telegram bots to AI-powered assistants — we've got the tools
              to automate your workflow.
            </p>
          </div>

          <div className="automation-grid">
            {AUTOMATION_CATEGORIES.map((cat) => (
              <div className="automation-card" key={cat.title}>
                <div
                  className="automation-card-icon"
                  style={{ background: cat.gradient }}
                >
                  <i className={cat.icon}></i>
                </div>
                <div className="automation-card-badge">{cat.count}</div>
                <h3 className="automation-card-title">{cat.title}</h3>
                <p className="automation-card-desc">{cat.desc}</p>
              </div>
            ))}
          </div>

          <div className="products-cta">
            <Link to="/tools/automation" className="btn btn-primary btn-lg">
              <i className="fas fa-store"></i> View All Automation Tools
              <i
                className="fas fa-arrow-right"
                style={{ fontSize: "0.75rem", marginLeft: "8px" }}
              ></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="section" id="use-cases">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-lightbulb"></i> Use Cases
            </div>
            <h2 className="section-title">Built for teams like yours</h2>
            <p className="section-desc">
              Whether you're a solo creator or managing a team, our tools scale
              with you.
            </p>
          </div>

          <div className="use-cases-grid">
            {USE_CASES.map((uc) => (
              <div className="use-case-card" key={uc.title}>
                <div className="use-case-icon">
                  <i className={uc.icon}></i>
                </div>
                <h3 className="use-case-title">{uc.title}</h3>
                <p className="use-case-desc">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" style={{ background: "var(--bg-subtle)" }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-cog"></i> How It Works
            </div>
            <h2 className="section-title">Get started in minutes</h2>
            <p className="section-desc">
              Simple 3-step process to automate your workflow.
            </p>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h3>Choose Your Tool</h3>
              <p>
                Browse our store and pick the automation that fits your needs.
              </p>
            </div>

            <div className="step-connector">
              <i className="fas fa-arrow-right"></i>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <i className="fas fa-download"></i>
              </div>
              <h3>Instant Delivery</h3>
              <p>
                Get full source code delivered to your Telegram immediately
                after payment.
              </p>
            </div>

            <div className="step-connector">
              <i className="fas fa-arrow-right"></i>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h3>Deploy & Automate</h3>
              <p>
                Follow our detailed docs to deploy on your VPS and start
                automating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="section" id="about">
        <div className="section-inner">
          <div className="about-layout">
            <div className="about-text">
              <span className="label">About Vinnoshiv</span>
              <h2>
                Your Automation Partner
                <br />
                in the AI Era
              </h2>
              <p>
                Vinnoshiv is an independent automation studio creating
                intelligent, production-grade tools for the modern creator
                economy.
              </p>
              <p>
                In a world where AI and automation are transforming how we work,
                we believe powerful tools should be accessible, affordable, and
                yours to own — not locked behind monthly subscriptions.
              </p>
              <p>
                Every tool is crafted with care, tested in production, and
                documented thoroughly — so you can deploy with confidence and
                build on top without friction.
              </p>
              <div className="about-checks">
                {[
                  "Full source code ownership",
                  "Lifetime free updates",
                  "Self-hostable on your VPS",
                  "No recurring subscriptions",
                  "24/7 Telegram support",
                  "Instant digital delivery",
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
                <i className="fab fa-telegram"></i> Chat with Founder
              </a>
            </div>

            <div className="about-visual">
              <div className="about-card-stack">
                {[
                  {
                    icon: "fas fa-tools",
                    iconStyle: {
                      background: "rgba(2,132,199,0.1)",
                      color: "#0284c7",
                    },
                    label: "Total Products",
                    value: "20+",
                    sub: "and growing weekly",
                  },
                  {
                    icon: "fas fa-users",
                    iconStyle: {
                      background: "rgba(5,150,105,0.12)",
                      color: "#059669",
                    },
                    label: "Happy Customers",
                    value: "500+",
                    sub: "across 15+ countries",
                  },
                  {
                    icon: "fas fa-rotate",
                    iconStyle: {
                      background: "rgba(14,165,233,0.12)",
                      color: "#0ea5e9",
                    },
                    label: "Updates Shipped",
                    value: "∞",
                    sub: "lifetime, always free",
                  },
                  {
                    icon: "fas fa-bolt",
                    iconStyle: {
                      background: "rgba(245,158,11,0.12)",
                      color: "#f59e0b",
                    },
                    label: "Response Time",
                    value: "< 2h",
                    sub: "personal support",
                  },
                ].map((s) => (
                  <div className="mini-stat-card" key={s.label}>
                    <div className="mini-stat-icon" style={s.iconStyle}>
                      <i className={s.icon}></i>
                    </div>
                    <div className="mini-stat-info">
                      <h4>{s.value}</h4>
                      <p>
                        {s.label} — {s.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section" style={{ background: "var(--bg-subtle)" }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-quote-left"></i> Testimonials
            </div>
            <h2 className="section-title">Loved by creators worldwide</h2>
            <p className="section-desc">
              See what our customers have to say about their automation journey.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="testimonial-text">
                "The Telegram automation tools saved me 10+ hours every week.
                Best investment I've made for my channel!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">R</div>
                <div>
                  <div className="testimonial-name">Raj Kumar</div>
                  <div className="testimonial-role">Content Creator</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="testimonial-text">
                "Clean code, great documentation, and amazing support. Deployed
                in under 30 minutes!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">A</div>
                <div>
                  <div className="testimonial-name">Aman Sharma</div>
                  <div className="testimonial-role">Developer</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="testimonial-text">
                "Finally, automation tools that just work. No subscriptions, no
                BS. Just quality code."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">M</div>
                <div>
                  <div className="testimonial-name">Meera Patel</div>
                  <div className="testimonial-role">Digital Marketer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="section cta-section">
        <div className="section-inner">
          <div className="cta-box">
            <h2>Ready to automate your workflow?</h2>
            <p>
              Join 500+ creators and developers who've already automated their
              processes.
            </p>
            <div className="cta-actions">
              <Link to="/tools/automation" className="btn btn-primary btn-lg">
                <i className="fas fa-rocket"></i> Browse Automation Store
              </Link>
              <a
                href="https://telegram.me/shivamnox"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-lg"
              >
                <i className="fab fa-telegram"></i> Talk to Us First
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        className="section"
        id="contact"
        style={{ background: "var(--bg-subtle)" }}
      >
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-envelope"></i> Get in Touch
            </div>
            <h2 className="section-title">We're here to help</h2>
            <p className="section-desc">
              Questions? Pre-sales queries? Reach out — we typically respond
              within 2 hours.
            </p>
          </div>

          <div className="contact-box">
            <div className="contact-email-display">
              <i className="fas fa-envelope"></i>
              vinnoshiv@gmail.com
            </div>

            <div className="social-row">
              <a
                href="https://telegram.me/shivamnox"
                target="_blank"
                rel="noreferrer"
                className="social-pill tg"
              >
                <i className="fab fa-telegram"></i> @shivamnox
              </a>
              <a
                href="https://instagram.com/vinnoshiv"
                target="_blank"
                rel="noreferrer"
                className="social-pill ig"
              >
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a
                href="https://youtube.com/@vinnoshiv"
                target="_blank"
                rel="noreferrer"
                className="social-pill yt"
              >
                <i className="fab fa-youtube"></i> YouTube
              </a>
              <a
                href="https://github.com/vinnoshiv"
                target="_blank"
                rel="noreferrer"
                className="social-pill gh"
              >
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <img
                  src="/logo.png"
                  alt="Vinnoshiv"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    objectFit: "cover",
                  }}
                />
                <span>Vinnoshiv</span>
              </div>
              <p className="footer-tagline">
                Your trusted automation partner in the AI era.
              </p>
            </div>

            <div className="footer-links-group">
              <div className="footer-column">
                <h4>Products</h4>
                <Link to="/tools/automation">Automation Tools</Link>
                <Link to="/tools/automation">Telegram Bots</Link>
                <Link to="/tools/automation">AI Tools</Link>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#contact">Contact</a>
                <Link to="/admin/login">Admin</Link>
              </div>

              <div className="footer-column">
                <h4>Support</h4>
                <a
                  href="https://telegram.me/shivamnox"
                  target="_blank"
                  rel="noreferrer"
                >
                  Telegram Support
                </a>
                <a href="mailto:vinnoshiv@gmail.com">Email Support</a>
                <Link to="/tools/automation">Documentation</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © {new Date().getFullYear()} Vinnoshiv. All rights reserved.
            </div>
            <div className="footer-social">
              <a
                href="https://telegram.me/shivamnox"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-telegram"></i>
              </a>
              <a
                href="https://instagram.com/vinnoshiv"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://youtube.com/@vinnoshiv"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="https://github.com/vinnoshiv"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
