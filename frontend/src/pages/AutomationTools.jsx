import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/AutomationTools.css';

const PRODUCTS = {
  animeflix: {
    icon: 'fas fa-dragon',
    iconClass: 'animeflix',
    accent: '#7c3aed',
    accentB: '#6d28d9',
    title: 'AnimeFlix Auto Scraper',
    sub: 'Telegram Auto Uploader Bot',
    priceOld: '₹1,999',
    price: '799',
    savings: '₹1,200',
    discount: '60% OFF',
    buyUrl: 'https://telegram.me/shivamnox',
    demoUrl: 'https://t.me/YourAnimeFlixDemoChannel',
    features: [
      'Auto scrape anime releases 24/7',
      'DriveSeed bypass included',
      'Direct upload to Telegram channel',
      '480p, 720p, 1080p quality',
      'Movies & Series both supported',
      'Auto thumbnail & caption',
      'Inline button support',
      'Full source code',
      'Free lifetime updates',
      'Telegram support',
    ],
  },
  youtube: {
    icon: 'fab fa-youtube',
    iconClass: 'youtube',
    accent: '#ef4444',
    accentB: '#dc2626',
    title: 'YouTube Downloader Bot',
    sub: 'NodeJS Telegram Bot — no cookies required',
    priceOld: '₹3,499',
    price: '999',
    savings: '₹2,500',
    discount: '71% OFF',
    buyUrl: 'https://telegram.me/shivamnox',
    demoUrl: 'https://t.me/YoutubeDRM_Bot',
    features: [
      'Download any YouTube video',
      'MP3 audio extraction',
      '144p to 4K quality',
      'Playlist download support',
      'Shorts download support',
      'No cookies required',
      'Fast download speed',
      'Full source code',
      'Free lifetime updates',
      'Telegram support',
    ],
  },
  instagram: {
    icon: 'fab fa-instagram',
    iconClass: 'instagram',
    accent: '#f59e0b',
    accentB: '#ec4899',
    title: 'Instagram Auto DM Bot',
    sub: 'Auto DM & Follower Growth Tool',
    priceOld: '₹1,499',
    price: '699',
    savings: '₹800',
    discount: '53% OFF',
    buyUrl: 'https://telegram.me/shivamnox',
    demoUrl: '',
    features: [
      'Auto DM new followers',
      'Scheduled story reactions',
      'Comment automation',
      'Hashtag targeting',
      'Safe rate-limiting built-in',
      'Multi-account support',
      'Full source code',
      'Free lifetime updates',
      'Telegram support',
    ],
  },
  telegram: {
    icon: 'fab fa-telegram',
    iconClass: 'telegram',
    accent: '#0ea5e9',
    accentB: '#0284c7',
    title: 'Telegram Channel Bot',
    sub: 'Auto-post, Schedule & Manage Your Channel',
    priceOld: '₹999',
    price: '599',
    savings: '₹400',
    discount: '40% OFF',
    buyUrl: 'https://telegram.me/shivamnox',
    demoUrl: '',
    features: [
      'Scheduled auto-posting',
      'RSS feed to channel',
      'Image & video support',
      'Inline buttons on posts',
      'Member count tracker',
      'Custom caption templates',
      'Full source code',
      'Free lifetime updates',
      'Telegram support',
    ],
  },
};

const ICON_STYLES = {
  animeflix: { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' },
  youtube:   { background: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  instagram: { background: 'linear-gradient(135deg, #f59e0b, #ec4899)' },
  telegram:  { background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
};

export default function AutomationTools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggle } = useTheme();
  const ref = searchParams.get('ref');
  const product = ref && PRODUCTS[ref] ? PRODUCTS[ref] : null;

  useEffect(() => {
    document.title = product ? `${product.title} — Vinnoshiv Tool Store` : 'Tool Store — Vinnoshiv';
  }, [product]);

  const select = (key) => setSearchParams({ ref: key });

  return (
    <div className="at-page">
      {/* Top bar */}
      <div className="at-topbar">
        <Link to="/" className="at-topbar-back">
          <i className="fas fa-arrow-left"></i> Home
        </Link>
        <span style={{ color: 'var(--border)', userSelect: 'none' }}>/</span>
        <span className="at-topbar-title">Tool Store</span>
        <div className="at-topbar-actions">
          <button className="at-theme-btn" onClick={toggle} aria-label="Toggle theme">
            <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
        </div>
      </div>

      <div className="at-layout">
        {/* ── Sidebar: product list ── */}
        <div className="at-sidebar">
          <div className="at-sidebar-header">
            <div className="at-sidebar-label">All Products</div>
            <div className="at-search">
              <i className="fas fa-magnifying-glass"></i>
              <input className="at-search-input" type="text" placeholder="Search store…" readOnly />
            </div>
          </div>
          <div className="at-product-list">
            {Object.entries(PRODUCTS).map(([key, p]) => (
              <div
                key={key}
                className={`at-product-row${ref === key ? ' active' : ''}`}
                onClick={() => select(key)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && select(key)}
              >
                <div className="at-row-icon" style={ICON_STYLES[key]}>
                  <i className={p.icon}></i>
                </div>
                <div className="at-row-info">
                  <div className="at-row-name">{p.title}</div>
                  <div className="at-row-sub">{p.sub}</div>
                </div>
                <div className="at-row-right">
                  <div className="at-row-price">₹{p.price}</div>
                  <div className="at-row-old">{p.priceOld}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div className="at-detail">
          {!product ? (
            <div className="at-empty-state">
              <div className="at-empty-icon"><i className="fas fa-store"></i></div>
              <h3>Browse the Tool Store</h3>
              <p>Select any product from the list to view pricing, features, and purchase options.</p>
            </div>
          ) : (
            <div className="at-detail-inner">
              {/* Header card */}
              <div
                className="at-product-header"
                style={{ '--header-accent': `linear-gradient(90deg, ${product.accent}, ${product.accentB})` }}
              >
                <div className="at-product-top">
                  <div
                    className="at-product-icon"
                    style={{ background: `linear-gradient(135deg, ${product.accent}, ${product.accentB})` }}
                  >
                    <i className={product.icon}></i>
                  </div>
                  <div className="at-product-meta">
                    <div className="at-discount-chip">
                      <i className="fas fa-fire"></i> {product.discount} — Limited Time
                    </div>
                    <div className="at-product-name">{product.title}</div>
                    <div className="at-product-sub">{product.sub}</div>
                  </div>
                </div>

                {/* Price block */}
                <div className="at-price-block">
                  <div className="at-price-left">
                    <div className="at-price-old">{product.priceOld}</div>
                    <div className="at-price-current">₹{product.price}</div>
                    <div className="at-price-note">One-time payment · Lifetime access</div>
                  </div>
                  <div className="at-price-right">
                    <div className="at-savings-badge">
                      <span className="save-label">You save</span>
                      <span className="save-amount">{product.savings}</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="at-cta-row">
                  <a
                    href={product.buyUrl}
                    className="at-buy-btn"
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: `linear-gradient(135deg, ${product.accent}, ${product.accentB})` }}
                  >
                    <i className="fab fa-telegram"></i> Buy Now on Telegram
                  </a>
                  {product.demoUrl && (
                    <a
                      href={product.demoUrl}
                      className="at-demo-btn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="fas fa-play"></i> Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="at-features-card">
                <div className="at-features-header">
                  <i className="fas fa-circle-check" style={{ color: 'var(--green)', fontSize: '0.875rem' }}></i>
                  <h3>What's Included</h3>
                  <span className="at-features-count">{product.features.length} features</span>
                </div>
                <div className="at-features-grid">
                  {product.features.map((f, i) => (
                    <div className="at-feature-item" key={i}>
                      <i className="fas fa-check"></i> {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust row */}
              <div className="at-trust-row">
                {[
                  { icon: 'fas fa-code', label: 'Full source code' },
                  { icon: 'fas fa-rotate', label: 'Lifetime updates' },
                  { icon: 'fas fa-bolt', label: 'Instant delivery' },
                  { icon: 'fas fa-headset', label: 'Telegram support' },
                ].map(t => (
                  <div className="at-trust-item" key={t.label}>
                    <i className={t.icon}></i> {t.label}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="at-footer">
                <span className="at-footer-text">Questions before buying?</span>
                <a
                  href="https://telegram.me/shivamnox"
                  className="at-footer-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fab fa-telegram"></i> Chat @shivamnox
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
