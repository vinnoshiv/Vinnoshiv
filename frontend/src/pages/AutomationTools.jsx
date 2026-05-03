import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../styles/AutomationTools.css';

const PRODUCTS = {
  animeflix: {
    icon: 'fas fa-dragon',
    iconClass: 'animeflix',
    accentColor: '#8b5cf6',
    accentSecondary: '#6366f1',
    title: 'AnimeFlix Auto Scraper',
    subtitle: 'Telegram Auto Uploader Bot',
    priceOld: '₹1,999',
    price: '799',
    savings: '₹1,200',
    discount: '60%',
    buyUrl: 'https://telegram.me/shivamnox',
    demoUrl: 'https://t.me/YourAnimeFlixDemoChannel',
    features: [
      'Auto scrape anime releases 24/7',
      'DriveSeed bypass included',
      'Direct upload to Telegram channel',
      '480p, 720p, 1080p quality support',
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
    accentColor: '#ef4444',
    accentSecondary: '#dc2626',
    title: 'YouTube Downloader Bot',
    subtitle: 'Telegram YouTube Bot — NodeJS, no cookies required',
    priceOld: '₹3,499',
    price: '999',
    savings: '₹2,500',
    discount: '71%',
    buyUrl: 'https://telegram.me/shivamnox',
    demoUrl: 'https://t.me/YoutubeDRM_Bot',
    features: [
      'Download any YouTube video',
      'MP3 audio extraction',
      '144p to 4K quality support',
      'Playlist download support',
      'Shorts download support',
      'Fast download speed',
      'No cookies required',
      'Full source code',
      'Free lifetime updates',
      'Telegram support',
    ],
  },
  instagram: {
    icon: 'fab fa-instagram',
    iconClass: 'instagram',
    accentColor: '#f59e0b',
    accentSecondary: '#ec4899',
    title: 'Instagram Auto DM Bot',
    subtitle: 'Auto DM & Follower Growth Tool',
    priceOld: '₹1,499',
    price: '699',
    savings: '₹800',
    discount: '53%',
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
    accentColor: '#0ea5e9',
    accentSecondary: '#0284c7',
    title: 'Telegram Channel Bot',
    subtitle: 'Auto-post, Schedule & Manage Your Channel',
    priceOld: '₹999',
    price: '599',
    savings: '₹400',
    discount: '40%',
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

export default function AutomationTools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ref = searchParams.get('ref');
  const product = ref && PRODUCTS[ref] ? PRODUCTS[ref] : null;

  useEffect(() => {
    document.title = product
      ? `${product.title} - Buy Now`
      : 'Automation Tools - Buy Now';
  }, [product]);

  const handleProductClick = (key) => {
    setSearchParams({ ref: key });
  };

  const accent = product ? product.accentColor : '#8b5cf6';

  return (
    <div className="at-page">
      <div className="at-container">

        {/* ── Price Card ── */}
        <div className="at-price-card" style={{ '--accent': accent }}>
          {/* Product Icon */}
          <div
            className="at-product-icon"
            style={{
              background: product
                ? `linear-gradient(135deg, ${product.accentColor}, ${product.accentSecondary})`
                : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            }}
          >
            <i className={product ? product.icon : 'fas fa-tools'}></i>
          </div>

          {/* Badge */}
          {product && (
            <div className="at-badge">🔥 {product.discount} OFF — Limited Time</div>
          )}

          {/* Title */}
          <h1 className="at-title">
            {product ? product.title : 'Automation Tools'}
          </h1>
          <p className="at-subtitle">
            {product ? product.subtitle : 'Select a tool below to view details & pricing'}
          </p>

          {/* Price Wrapper */}
          {product && (
            <div className="at-price-wrapper">
              <div className="at-price-old">{product.priceOld}</div>
              <div className="at-price">
                <sup>₹</sup>{product.price}
              </div>
              <div className="at-price-note">One-time payment • Lifetime access</div>
              <div className="at-savings">You save {product.savings}!</div>
            </div>
          )}

          {/* Buttons */}
          {product && (
            <div className="at-buttons">
              <a
                href={product.buyUrl}
                className="at-buy-btn"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: `linear-gradient(135deg, ${product.accentColor}, ${product.accentSecondary})`,
                }}
              >
                <i className="fab fa-telegram"></i> Buy Now
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
          )}
        </div>

        {/* ── Features Card ── */}
        {product && (
          <div className="at-features-card" style={{ '--accent': product.accentColor }}>
            <div className="at-features-title">
              <i className="fas fa-star"></i> What's Included
            </div>
            <ul className="at-features">
              {product.features.map((f, i) => (
                <li key={i}>
                  <i className="fas fa-check-circle"></i> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── All Products ── */}
        <div className="at-all-products">
          <div className="at-all-products-title">All Tools</div>
          <div className="at-product-grid">
            {Object.entries(PRODUCTS).map(([key, p]) => (
              <div
                key={key}
                className={`at-product-item ${ref === key ? 'active' : ''}`}
                onClick={() => handleProductClick(key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleProductClick(key)}
              >
                <div className={`at-product-item-icon ${p.iconClass}`}>
                  <i className={p.icon}></i>
                </div>
                <div className="at-product-item-info">
                  <h4>{p.title}</h4>
                  <p>{p.subtitle}</p>
                </div>
                <div className="at-product-item-right">
                  <div className="at-product-item-price">
                    <div className="old">{p.priceOld}</div>
                    <div className="current">₹{p.price}</div>
                  </div>
                  {p.demoUrl && (
                    <a
                      href={p.demoUrl}
                      className="at-product-demo-btn"
                      target="_blank"
                      rel="noreferrer"
                      title="View Demo"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fas fa-play"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="at-footer">
          <p>Questions? Contact us</p>
          <a
            href="https://telegram.me/shivamnox"
            className="at-contact-link"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-telegram"></i> @shivamnox
          </a>
        </div>

      </div>
    </div>
  );
}
