import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/Home.css";

const FEATURES = [
  {
    icon: "fas fa-code",
    title: "Full Source Code",
    desc: "Clean, documented, production-ready code — yours to own and modify forever.",
    color: "#0284c7",
  },
  {
    icon: "fas fa-rotate",
    title: "Lifetime Updates",
    desc: "Pay once and receive every future update at absolutely no extra cost.",
    color: "#059669",
  },
  {
    icon: "fas fa-bolt",
    title: "Instant Delivery",
    desc: "Receive your purchase immediately via Telegram after payment confirmation.",
    color: "#f59e0b",
  },
  {
    icon: "fas fa-headset",
    title: "Telegram Support",
    desc: "Fast personal support directly on Telegram — real humans, not bots.",
    color: "#0088cc",
  },
  {
    icon: "fas fa-server",
    title: "Self-Hosted",
    desc: "Run on your own VPS. No subscriptions, no third-party dependencies.",
    color: "#8b5cf6",
  },
  {
    icon: "fas fa-shield-halved",
    title: "Secure & Reliable",
    desc: "Production-tested scripts with built-in rate limiting and error handling.",
    color: "#ef4444",
  },
];

const AUTOMATION_CATEGORIES = [
  {
    icon: "fab fa-telegram",
    title: "Telegram Automation",
    desc: "Powerful bots for channel management, auto-posting, scraping, and more.",
    gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    count: "8+ Tools",
    glow: "rgba(14,165,233,0.25)",
  },
  {
    icon: "fab fa-youtube",
    title: "YouTube Tools",
    desc: "Download, track, and automate your YouTube workflow with ease.",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    count: "5+ Tools",
    glow: "rgba(239,68,68,0.25)",
  },
  {
    icon: "fab fa-instagram",
    title: "Instagram Automation",
    desc: "Auto DM, story reactions, follower growth, and engagement automation.",
    gradient: "linear-gradient(135deg, #f59e0b, #ec4899)",
    count: "6+ Tools",
    glow: "rgba(236,72,153,0.25)",
  },
  {
    icon: "fas fa-robot",
    title: "AI-Powered Bots",
    desc: "Smart automation with ChatGPT integration, content generation, and more.",
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    count: "4+ Tools",
    glow: "rgba(139,92,246,0.25)",
  },
];

const USE_CASES = [
  {
    icon: "fas fa-rocket",
    title: "Content Creators",
    desc: "Automate video downloads, schedule posts, and grow your audience effortlessly.",
    color: "#f59e0b",
  },
  {
    icon: "fas fa-briefcase",
    title: "Digital Marketers",
    desc: "Scale your social media campaigns with intelligent automation and analytics.",
    color: "#0284c7",
  },
  {
    icon: "fas fa-users",
    title: "Community Managers",
    desc: "Manage multiple channels, auto-moderate, and engage with your community 24/7.",
    color: "#059669",
  },
  {
    icon: "fas fa-laptop-code",
    title: "Developers",
    desc: "Build on top of our clean, documented code to create custom solutions faster.",
    color: "#8b5cf6",
  },
];

const STATS = [
  { value: "500+", label: "Active Users", icon: "fas fa-users", color: "#0284c7" },
  { value: "20+", label: "Automation Tools", icon: "fas fa-tools", color: "#059669" },
  { value: "99.9%", label: "Uptime", icon: "fas fa-server", color: "#8b5cf6" },
  { value: "<2h", label: "Support Response", icon: "fas fa-headset", color: "#f59e0b" },
];

const TECH_STACK = [
  { icon: "fab fa-telegram", label: "Telegram", color: "#0088cc" },
  { icon: "fab fa-youtube", label: "YouTube", color: "#ef4444" },
  { icon: "fab fa-instagram", label: "Instagram", color: "#ec4899" },
  { icon: "fas fa-brain", label: "OpenAI", color: "#10a37f" },
  { icon: "fab fa-node-js", label: "Node.js", color: "#68a063" },
  { icon: "fab fa-python", label: "Python", color: "#3776ab" },
  { icon: "fas fa-server", label: "Cloud VPS", color: "#6366f1" },
  { icon: "fab fa-docker", label: "Docker", color: "#2496ed" },
];

const TESTIMONIALS = [
  {
    text: "The Telegram automation tools saved me 10+ hours every week. Best investment I've made for my channel!",
    name: "Raj Kumar",
    role: "Content Creator",
    avatar: "R",
    gradient: "linear-gradient(135deg, #0284c7, #38bdf8)",
  },
  {
    text: "Clean code, great documentation, and amazing support. Deployed in under 30 minutes!",
    name: "Aman Sharma",
    role: "Developer",
    avatar: "A",
    gradient: "linear-gradient(135deg, #059669, #34d399)",
  },
  {
    text: "Finally, automation tools that just work. No subscriptions, no BS. Just quality code.",
    name: "Meera Patel",
    role: "Digital Marketer",
    avatar: "M",
    gradient: "linear-gradient(135deg, #8b5cf6, #c4b5fd)",
  },
];

// ── Animated Counter Hook ──
function useCountUp(target, duration = 2000, isVisible = false) {
  const [count, setCount] = useState(0);
  const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ""));
  const suffix = target.replace(/[0-9.]/g, "");

  useEffect(() => {
    if (!isVisible || isNaN(numericTarget)) return;
    let start = 0;
    const increment = numericTarget / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, numericTarget, duration]);

  if (isNaN(numericTarget)) return target;
  return `${count}${suffix}`;
}

// ── Single Stat Item with animation ──
function StatItem({ stat, isVisible }) {
  const display = useCountUp(stat.value, 2000, isVisible);
  return (
    <div className="stat-item" style={{ "--stat-color": stat.color }}>
      <div className="stat-icon-wrap">
        <i className={stat.icon}></i>
      </div>
      <div className="stat-content">
        <div className="stat-value">{display}</div>
        <div className="stat-label">{stat.label}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const { theme, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [subEmail, setSubEmail]     = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subMsg, setSubMsg]         = useState(null);
  const statsRef = useRef(null);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubLoading(true);
    setSubMsg(null);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail.trim() }),
      });
      const data = await res.json();
      setSubMsg({ ok: res.ok, text: data.message || (res.ok ? "Subscribed!" : "Error.") });
      if (res.ok) setSubEmail("");
    } catch {
      setSubMsg({ ok: false, text: "Network error. Please try again." });
    } finally {
      setSubLoading(false);
      setTimeout(() => setSubMsg(null), 6000);
    }
  };

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Stats intersection observer
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* ── Navbar ── */}
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-inner">
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <i className={`fas fa-${mobileMenuOpen ? "times" : "bars"}`}></i>
          </button>

          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <div className="navbar-logo-img-wrap">
              <img src="/logo.png" alt="Vinnoshiv" className="navbar-logo-icon" />
            </div>
            <span className="navbar-logo-text">Vinnoshiv</span>
          </Link>

          <ul className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            {[
              { href: "#features", label: "Features" },
              { href: "#automation", label: "Automation" },
              { href: "#use-cases", label: "Use Cases" },
              { href: "#about", label: "About" },
              { href: "#contact", label: "Contact" },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={closeMobileMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <button
              className="theme-toggle"
              onClick={toggle}
              aria-label="Toggle theme"
            >
              <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
            </button>

            <Link to="/tools/automation" className="navbar-cta">
              <i className="fas fa-store"></i>
              <span>Store</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Your AI-Powered Automation Partner
          </div>

          <h1 className="hero-title">
            Automate Everything.
            <br />
            <em>Focus on What Matters.</em>
          </h1>

          <p className="hero-sub">
            Premium automation tools for creators, marketers, and developers.
            Full source code. One-time payment. Lifetime updates. Zero subscriptions.
          </p>

          <div className="hero-actions">
            <Link to="/tools/automation" className="btn btn-primary btn-lg">
              <i className="fas fa-rocket"></i>
              <span>Explore Tools</span>
            </Link>
            <a href="#automation" className="btn btn-outline btn-lg">
              <i className="fas fa-play-circle"></i>
              <span>See How It Works</span>
            </a>
          </div>

          <div className="social-proof">
            <div className="social-proof-avatars">
              {["S", "R", "A", "M", "K", "V", "P"].map((l, i) => (
                <div className="avatar-bubble" key={i} style={{ "--i": i }}>
                  {l}
                </div>
              ))}
            </div>
            <div className="social-proof-meta">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <span className="social-proof-text">
                Trusted by <strong>500+</strong> creators & developers
              </span>
            </div>
          </div>

          <div className="hero-pills">
            {[
              { color: "green", icon: "fas fa-circle-check", text: "One-time payment" },
              { color: "blue", icon: "fas fa-code", text: "Full source code" },
              { color: "purple", icon: "fas fa-brain", text: "AI-powered" },
              { color: "green", icon: "fas fa-rotate", text: "Lifetime updates" },
              { color: "blue", icon: "fab fa-telegram", text: "Instant delivery" },
            ].map((pill) => (
              <span key={pill.text} className={`hero-pill ${pill.color}`}>
                <i className={pill.icon}></i>
                {pill.text}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="stats-bar" ref={statsRef}>
        <div className="stats-bar-inner">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} isVisible={statsVisible} />
          ))}
        </div>
      </div>

      {/* ── Tech Stack Bar ── */}
      <div className="logo-bar">
        <div className="logo-bar-label">
          <span>Powered by industry-leading technologies</span>
        </div>
        <div className="logo-bar-track">
          <div className="logo-bar-items">
            {[...TECH_STACK, ...TECH_STACK].map((item, idx) => (
              <div
                className="logo-bar-item"
                key={`${item.label}-${idx}`}
                style={{ "--item-color": item.color }}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
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
            {FEATURES.map((f, i) => (
              <div
                className="feature-cell"
                key={f.title}
                style={{ "--feature-color": f.color, "--delay": `${i * 0.1}s` }}
              >
                <div className="feature-icon-wrap">
                  <div className="feature-icon">
                    <i className={f.icon}></i>
                  </div>
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
                <div className="feature-shine" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Automation Categories ── */}
      <section className="section section-alt" id="automation">
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
            {AUTOMATION_CATEGORIES.map((cat, i) => (
              <div
                className="automation-card"
                key={cat.title}
                style={{ "--glow": cat.glow, "--delay": `${i * 0.1}s` }}
              >
                <div className="automation-card-header">
                  <div
                    className="automation-card-icon"
                    style={{ background: cat.gradient }}
                  >
                    <i className={cat.icon}></i>
                  </div>
                  <span className="automation-card-badge">{cat.count}</span>
                </div>
                <h3 className="automation-card-title">{cat.title}</h3>
                <p className="automation-card-desc">{cat.desc}</p>
                <div className="automation-card-footer">
                  <Link to="/tools/automation" className="automation-card-link">
                    Explore <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="products-cta">
            <Link to="/tools/automation" className="btn btn-primary btn-lg">
              <i className="fas fa-store"></i>
              <span>View All Tools</span>
              <i className="fas fa-arrow-right btn-arrow"></i>
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
              Whether you're a solo creator or managing a team, our tools scale with you.
            </p>
          </div>

          <div className="use-cases-grid">
            {USE_CASES.map((uc, i) => (
              <div
                className="use-case-card"
                key={uc.title}
                style={{ "--uc-color": uc.color, "--delay": `${i * 0.1}s` }}
              >
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
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-cog"></i> How It Works
            </div>
            <h2 className="section-title">Get started in minutes</h2>
            <p className="section-desc">Simple 3-step process to automate your workflow.</p>
          </div>

          <div className="steps-container">
            {[
              {
                num: "1",
                icon: "fas fa-shopping-cart",
                title: "Choose Your Tool",
                desc: "Browse our store and pick the automation that fits your needs.",
              },
              {
                num: "2",
                icon: "fas fa-download",
                title: "Instant Delivery",
                desc: "Get full source code delivered to your Telegram immediately after payment.",
              },
              {
                num: "3",
                icon: "fas fa-rocket",
                title: "Deploy & Automate",
                desc: "Follow our detailed docs to deploy on your VPS and start automating.",
              },
            ].map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="step-card" style={{ "--delay": `${i * 0.15}s` }}>
                  <div className="step-number">{step.num}</div>
                  <div className="step-icon">
                    <i className={step.icon}></i>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="step-connector">
                    <div className="step-connector-line" />
                    <i className="fas fa-chevron-right"></i>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="section" id="about">
        <div className="section-inner">
          <div className="about-layout">
            <div className="about-text">
              <span className="section-badge">
                <i className="fas fa-info-circle"></i> About Vinnoshiv
              </span>
              <h2>
                Your Automation Partner
                <br />
                <em>in the AI Era</em>
              </h2>
              <p>
                Vinnoshiv is an independent automation studio creating intelligent,
                production-grade tools for the modern creator economy.
              </p>
              <p>
                In a world where AI and automation are transforming how we work, we believe
                powerful tools should be accessible, affordable, and yours to own — not
                locked behind monthly subscriptions.
              </p>
              <p>
                Every tool is crafted with care, tested in production, and documented
                thoroughly — so you can deploy with confidence and build on top without friction.
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
                    <i className="fas fa-circle-check"></i>
                    <span>{item}</span>
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
                    bg: "rgba(2,132,199,0.1)",
                    color: "#0284c7",
                    label: "Total Products",
                    value: "20+",
                    sub: "and growing weekly",
                  },
                  {
                    icon: "fas fa-users",
                    bg: "rgba(5,150,105,0.12)",
                    color: "#059669",
                    label: "Happy Customers",
                    value: "500+",
                    sub: "across 15+ countries",
                  },
                  {
                    icon: "fas fa-rotate",
                    bg: "rgba(14,165,233,0.12)",
                    color: "#0ea5e9",
                    label: "Updates Shipped",
                    value: "∞",
                    sub: "lifetime, always free",
                  },
                  {
                    icon: "fas fa-bolt",
                    bg: "rgba(245,158,11,0.12)",
                    color: "#f59e0b",
                    label: "Response Time",
                    value: "< 2h",
                    sub: "personal support",
                  },
                ].map((s, i) => (
                  <div
                    className="mini-stat-card"
                    key={s.label}
                    style={{ "--delay": `${i * 0.1}s` }}
                  >
                    <div
                      className="mini-stat-icon"
                      style={{ background: s.bg, color: s.color }}
                    >
                      <i className={s.icon}></i>
                    </div>
                    <div className="mini-stat-info">
                      <h4>{s.value}</h4>
                      <p>
                        {s.label} — <em>{s.sub}</em>
                      </p>
                    </div>
                    <div className="mini-stat-arrow">
                      <i className="fas fa-arrow-up-right"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section section-alt">
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
            {TESTIMONIALS.map((t, i) => (
              <div
                className="testimonial-card"
                key={t.name}
                style={{ "--delay": `${i * 0.1}s` }}
              >
                <div className="testimonial-quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, si) => (
                    <i key={si} className="fas fa-star"></i>
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div
                    className="testimonial-avatar"
                    style={{ background: t.gradient }}
                  >
                    {t.avatar}
                  </div>
                  <div className="testimonial-meta">
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-section">
        <div className="section-inner">
          <div className="cta-box">
            <div className="cta-box-bg" />
            <div className="cta-box-content">
              <div className="cta-badge">
                <i className="fas fa-rocket"></i> Get Started Today
              </div>
              <h2>Ready to automate your workflow?</h2>
              <p>
                Join 500+ creators and developers who've already automated their processes.
              </p>
              <div className="cta-actions">
                <Link to="/tools/automation" className="btn btn-white btn-lg">
                  <i className="fas fa-store"></i>
                  <span>Browse Store</span>
                </Link>
                <a
                  href="https://telegram.me/shivamnox"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-white btn-lg"
                >
                  <i className="fab fa-telegram"></i>
                  <span>Talk to Us</span>
                </a>
              </div>
              <div className="cta-trust">
                <span><i className="fas fa-shield-halved"></i> Secure payment</span>
                <span><i className="fas fa-rotate"></i> Lifetime updates</span>
                <span><i className="fas fa-bolt"></i> Instant delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="section section-alt" id="contact">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-envelope"></i> Get in Touch
            </div>
            <h2 className="section-title">We're here to help</h2>
            <p className="section-desc">
              Questions? Pre-sales queries? Reach out — we typically respond within 2 hours.
            </p>
          </div>

          <div className="contact-box">
            <a
              href="mailto:vinnoshiv@gmail.com"
              className="contact-email-display"
            >
              <i className="fas fa-envelope"></i>
              <span>vinnoshiv.mail@gmail.com</span>
              <i className="fas fa-arrow-up-right contact-email-arrow"></i>
            </a>

            <div className="contact-divider">
              <span>or connect on social</span>
            </div>

            <div className="social-row">
              {[
                {
                  href: "https://telegram.me/shivamnox",
                  cls: "tg",
                  icon: "fab fa-telegram",
                  label: "@shivamnox",
                },
                {
                  href: "https://instagram.com/vinnoshiv",
                  cls: "ig",
                  icon: "fab fa-instagram",
                  label: "Instagram",
                },
                {
                  href: "https://youtube.com/@vinnoshiv",
                  cls: "yt",
                  icon: "fab fa-youtube",
                  label: "YouTube",
                },
                {
                  href: "https://github.com/vinnoshiv",
                  cls: "gh",
                  icon: "fab fa-github",
                  label: "GitHub",
                },
              ].map((s) => (
                <a
                  key={s.cls}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`social-pill ${s.cls}`}
                >
                  <i className={s.icon}></i>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter-section">
        <div className="newsletter-inner">
          <div className="newsletter-badge">
            <i className="fas fa-envelope"></i> Newsletter
          </div>
          <h2 className="newsletter-title">Stay ahead with automation updates</h2>
          <p className="newsletter-sub">
            Get notified about new tools, exclusive discounts, and automation tips — straight to your inbox.
          </p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-input-wrap">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Enter your email address"
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                required
                disabled={subLoading}
              />
              <button type="submit" disabled={subLoading}>
                {subLoading
                  ? <i className="fas fa-circle-notch fa-spin"></i>
                  : "Subscribe"}
              </button>
            </div>
            {subMsg && (
              <div className={`newsletter-msg ${subMsg.ok ? "ok" : "err"}`}>
                <i className={`fas fa-${subMsg.ok ? "circle-check" : "circle-exclamation"}`}></i>
                {subMsg.text}
              </div>
            )}
          </form>
          <p className="newsletter-consent">
            By subscribing you consent to receive marketing emails. Unsubscribe anytime.
          </p>
          <div className="newsletter-perks">
            {[
              { icon: "fas fa-tag", text: "Exclusive discounts" },
              { icon: "fas fa-bolt", text: "New tool alerts" },
              { icon: "fas fa-shield-halved", text: "No spam, ever" },
            ].map(p => (
              <span key={p.text} className="newsletter-perk">
                <i className={p.icon}></i> {p.text}
              </span>
            ))}
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
                  style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }}
                />
                <span>Vinnoshiv</span>
              </div>
              <p className="footer-tagline">
                Your trusted automation partner in the AI era. Premium tools with
                full source code, one-time payment, lifetime updates.
              </p>
              <div className="footer-social">
                {[
                  { href: "https://telegram.me/shivamnox", icon: "fab fa-telegram" },
                  { href: "https://instagram.com/vinnoshiv", icon: "fab fa-instagram" },
                  { href: "https://youtube.com/@vinnoshiv", icon: "fab fa-youtube" },
                  { href: "https://github.com/vinnoshiv", icon: "fab fa-github" },
                ].map((s) => (
                  <a key={s.icon} href={s.href} target="_blank" rel="noreferrer">
                    <i className={s.icon}></i>
                  </a>
                ))}
              </div>
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
                <a href="https://telegram.me/shivamnox" target="_blank" rel="noreferrer">
                  Telegram Support
                </a>
                <a href="mailto:vinnoshiv.mail@gmail.com">Email Support</a>
                <Link to="/tools/automation">Documentation</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © {new Date().getFullYear()} Vinnoshiv. All rights reserved.
            </div>
            <div className="footer-bottom-links">
              <a href="#features">Privacy</a>
              <a href="#features">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}