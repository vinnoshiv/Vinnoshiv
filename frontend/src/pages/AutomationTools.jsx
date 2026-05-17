// AutomationTools.jsx
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/AutomationTools.css";

/* ── helpers ── */
function formatPrice(raw) {
  if (!raw) return "₹0";
  const cleaned = String(raw)
    .replace(/₹|Rs\.?|INR|inr/gi, "")
    .replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return "₹0";
  return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function computeDiscount(oldRaw, curRaw) {
  if (!oldRaw || !curRaw) return null;
  const old = parseFloat(String(oldRaw).replace(/[^0-9.]/g, ""));
  const cur = parseFloat(String(curRaw).replace(/[^0-9.]/g, ""));
  if (!old || !cur || old <= cur) return null;
  return `${Math.round(((old - cur) / old) * 100)}%`;
}

function computeSavings(oldRaw, curRaw) {
  if (!oldRaw || !curRaw) return null;
  const old = parseFloat(String(oldRaw).replace(/[^0-9.]/g, ""));
  const cur = parseFloat(String(curRaw).replace(/[^0-9.]/g, ""));
  if (!old || !cur || old <= cur) return null;
  return `₹${(old - cur).toLocaleString("en-IN")}`;
}

const CATEGORY_ICONS = {
  automation: "fas fa-robot",
  bot: "fab fa-telegram",
  scraper: "fas fa-spider",
  downloader: "fas fa-download",
  tool: "fas fa-wrench",
};

function getCategoryIcon(cat) {
  if (!cat) return "fas fa-cube";
  const k = cat.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_ICONS)) {
    if (k.includes(key)) return val;
  }
  return "fas fa-cube";
}

const TRUST_ITEMS = [
  { icon: "fas fa-code", label: "Full Source Code", color: "#0284c7" },
  { icon: "fas fa-rotate", label: "Lifetime Updates", color: "#059669" },
  { icon: "fas fa-bolt", label: "Instant Delivery", color: "#f59e0b" },
  { icon: "fab fa-telegram", label: "Telegram Support", color: "#8b5cf6" },
];

/* ════════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════════ */
export default function AutomationTools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggle } = useTheme();
  const ref = searchParams.get("ref");
  const detailRef = useRef(null);

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeCat, setActiveCat] = useState("all");

  useEffect(() => {
    fetch("/api/tools")
      .then((r) => r.json())
      .then((data) =>
        setTools(
          Array.isArray(data)
            ? data.filter((t) => t.status !== "Inactive")
            : [],
        ),
      )
      .catch(() => setTools([]))
      .finally(() => setLoading(false));
  }, []);

  const product = ref ? tools.find((t) => t.ref === ref) : null;

  useEffect(() => {
    document.title = product
      ? `${product.name} — Vinnoshiv Tool Store`
      : "Vinnoshiv — Automation Tool Store";
  }, [product]);

  useEffect(() => {
    if (product)
      fetch(`/api/tools/${product._id}/view`, { method: "POST" }).catch(
        () => {},
      );
  }, [product?._id]);

  const categories = useMemo(() => {
    const set = new Set(tools.map((t) => t.category || "automation"));
    return ["all", ...Array.from(set)];
  }, [tools]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return tools.filter((t) => {
      const matchQ =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q);
      const matchC =
        activeCat === "all" ||
        (t.category || "automation").toLowerCase() === activeCat.toLowerCase();
      return matchQ && matchC;
    });
  }, [tools, query, activeCat]);

  const select = useCallback(
    (toolRef) => {
      setSearchParams({ ref: toolRef });
      if (window.innerWidth < 1024 && detailRef.current) {
        setTimeout(
          () => detailRef.current?.scrollIntoView({ behavior: "smooth" }),
          50,
        );
      }
    },
    [setSearchParams],
  );

  const handleShare = () => {
    const url = product
      ? `${window.location.origin}${window.location.pathname}?ref=${product.ref}`
      : window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className={`at-root ${theme === "dark" ? "at-dark" : ""}`}>
      <Topbar
        theme={theme}
        toggleTheme={toggle}
        query={query}
        setQuery={setQuery}
      />

      <div className="at-layout">
        <Sidebar
          categories={categories}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          tools={filtered}
          loading={loading}
          selectedRef={ref}
          onSelect={select}
        />
        <main className="at-main" ref={detailRef}>
          {product ? (
            <ProductDetail
              tool={product}
              onShare={handleShare}
              copied={copied}
              onBack={() => setSearchParams({})}
            />
          ) : (
            <EmptyState
              tools={filtered}
              total={tools.length}
              loading={loading}
              onSelect={select}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TOP BAR
════════════════════════════════════════════════════════════════ */
function Topbar({ theme, toggleTheme, query, setQuery }) {
  return (
    <header className="at-topbar">
      {/* Brand */}
      <div className="at-brand">
        <div className="at-brand-icon">
          <i className="fas fa-bolt"></i>
        </div>
        <div className="at-brand-text">
          <span className="at-brand-name">Vinnoshiv</span>
          <span className="at-brand-sub">Tool Store</span>
        </div>
      </div>

      {/* Search */}
      <div className="at-search-wrap">
        <i className="fas fa-magnifying-glass at-search-ico"></i>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, categories…"
          className="at-search-input"
          aria-label="Search tools"
        />
        {query ? (
          <button
            className="at-search-clear"
            onClick={() => setQuery("")}
            aria-label="Clear"
          >
            <i className="fas fa-xmark"></i>
          </button>
        ) : (
          <kbd className="at-search-kbd">⌘K</kbd>
        )}
      </div>

      {/* Actions */}
      <div className="at-topbar-actions">
        <button className="at-icon-btn at-notif-btn" aria-label="Notifications">
          <i className="fas fa-bell"></i>
          <span className="at-notif-dot"></span>
        </button>
        <button
          className="at-icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
        </button>
        {/*<div className="at-avatar">VS</div>*/}
      </div>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════════════════════════════ */
function Sidebar({
  categories,
  activeCat,
  setActiveCat,
  tools,
  loading,
  selectedRef,
  onSelect,
}) {
  return (
    <aside className="at-sidebar">
      {/* Header */}
      <div className="at-sb-head">
        <div className="at-sb-head-row">
          <div className="at-sb-title-wrap">
            <span className="at-sb-title">Products</span>
            <span className="at-sb-count">{tools.length}</span>
          </div>
          <button className="at-sb-menu-btn">
            <i className="fas fa-ellipsis"></i>
          </button>
        </div>
        {/* Category tabs */}
        <div className="at-cat-tabs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`at-cat-tab ${activeCat === c ? "active" : ""}`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="at-sb-list">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : tools.length === 0 ? (
          <div className="at-sb-empty">
            <div className="at-sb-empty-icon">
              <i className="fas fa-magnifying-glass"></i>
            </div>
            <p>No tools match your search</p>
          </div>
        ) : (
          tools.map((t) => (
            <SidebarRow
              key={t._id}
              tool={t}
              active={selectedRef === t.ref}
              onClick={() => onSelect(t.ref)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="at-sb-foot">
        <div className="at-sb-foot-left">
          <i className="fas fa-shield-halved" style={{ color: "#10b981" }}></i>
          <span>Secure · Trusted</span>
        </div>
        <span className="at-sb-version">v2.4</span>
      </div>
    </aside>
  );
}

function SidebarRow({ tool, active, onClick }) {
  const disc = computeDiscount(tool.oldPrice, tool.price);
  return (
    <button className={`at-sb-row ${active ? "active" : ""}`} onClick={onClick}>
      {active && <span className="at-sb-row-bar"></span>}
      <div
        className="at-sb-row-icon"
        style={{
          background: `linear-gradient(135deg, ${tool.color}, ${tool.color}99)`,
        }}
      >
        <i className={tool.icon}></i>
      </div>
      <div className="at-sb-row-info">
        <div className={`at-sb-row-name ${active ? "active" : ""}`}>
          {tool.name}
        </div>
        <div className="at-sb-row-meta">
          <span className="at-sb-row-cat">
            <i className={getCategoryIcon(tool.category)}></i>
            {tool.category || "tool"}
          </span>
          {tool.features?.length > 0 && (
            <span className="at-sb-row-feats">{tool.features.length}</span>
          )}
        </div>
      </div>
      <div className="at-sb-row-right">
        <div className="at-sb-row-price">{formatPrice(tool.price)}</div>
        {disc && <div className="at-sb-row-disc">{disc} OFF</div>}
      </div>
    </button>
  );
}

function SkeletonRow() {
  return (
    <div className="at-skel-row">
      <div className="at-skel-icon"></div>
      <div className="at-skel-info">
        <div className="at-skel-line at-skel-long"></div>
        <div className="at-skel-line at-skel-short"></div>
      </div>
      <div className="at-skel-price"></div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════════════════════════════ */
function EmptyState({ tools, total, loading, onSelect }) {
  const totalSavings = tools.reduce((acc, t) => {
    const s = computeSavings(t.oldPrice, t.price);
    if (!s) return acc;
    return acc + parseFloat(s.replace(/[^0-9.]/g, ""));
  }, 0);
  const discountedCount = tools.filter((t) =>
    computeDiscount(t.oldPrice, t.price),
  ).length;

  const stats = [
    {
      label: "Total Tools",
      value: String(total),
      icon: "fas fa-cube",
      grad: "at-grad-blue",
      trend: "+2 this week",
    },
    {
      label: "Active Deals",
      value: String(discountedCount),
      icon: "fas fa-fire",
      grad: "at-grad-orange",
      trend: "Limited time",
    },
    {
      label: "Max Savings",
      value: `₹${totalSavings.toLocaleString("en-IN")}`,
      icon: "fas fa-piggy-bank",
      grad: "at-grad-green",
      trend: "Across all deals",
    },
    {
      label: "Happy Users",
      value: "12.4K",
      icon: "fas fa-users",
      grad: "at-grad-purple",
      trend: "+18% growth",
    },
  ];

  return (
    <div className="at-empty-wrap">
      {/* Hero banner */}
      <div className="at-hero">
        <div className="at-hero-blob at-hero-blob-1"></div>
        <div className="at-hero-blob at-hero-blob-2"></div>
        <div className="at-hero-inner">
          <div className="at-hero-live-badge">
            <span className="at-hero-dot"></span>
            LIVE · {total} Tools Available
          </div>
          <h1 className="at-hero-title">
            Welcome to the
            <br />
            <span className="at-hero-gradient-text">Vinnoshiv Tool Store</span>
          </h1>
          <p className="at-hero-sub">
            Professional automation tools, bots &amp; scripts crafted for
            developers, marketers &amp; creators. One-time payment · lifetime
            access.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="at-stats-grid">
        {stats.map((s) => (
          <div className="at-stat-card" key={s.label}>
            <div className={`at-stat-icon ${s.grad}`}>
              <i className={s.icon}></i>
            </div>
            <div className="at-stat-label">{s.label}</div>
            <div className="at-stat-value">{s.value}</div>
            <div className="at-stat-trend">{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Browse tools */}
      <div className="at-browse-section">
        <div className="at-browse-header">
          <div>
            <h2 className="at-browse-title">Browse All Tools</h2>
            <p className="at-browse-sub">Click any card to view full details</p>
          </div>
          <span className="at-browse-count">{tools.length} available</span>
        </div>

        {loading ? (
          <div className="at-tools-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="at-tools-grid">
            {tools.map((t) => (
              <ToolCard key={t._id} tool={t} onClick={() => onSelect(t.ref)} />
            ))}
          </div>
        )}
      </div>

      {/* Trust row */}
      <div className="at-trust-row">
        {TRUST_ITEMS.map((tr) => (
          <div className="at-trust-item" key={tr.label}>
            <div
              className="at-trust-icon"
              style={{ color: tr.color, background: `${tr.color}18` }}
            >
              <i className={tr.icon}></i>
            </div>
            <span className="at-trust-label">{tr.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolCard({ tool, onClick }) {
  const disc = computeDiscount(tool.oldPrice, tool.price);
  return (
    <button className="at-tool-card" onClick={onClick}>
      {disc && (
        <span className="at-card-badge at-card-badge-green">{disc} OFF</span>
      )}
      {tool.status === "Coming Soon" && (
        <span className="at-card-badge at-card-badge-amber">SOON</span>
      )}

      <div
        className="at-card-icon"
        style={{
          background: `linear-gradient(135deg, ${tool.color}, ${tool.color}aa)`,
          boxShadow: `0 8px 20px -6px ${tool.color}60`,
        }}
      >
        <i className={tool.icon}></i>
      </div>

      <div className="at-card-cat">{tool.category || "tool"}</div>
      <h3 className="at-card-name">{tool.name}</h3>

      <div className="at-card-footer">
        <div className="at-card-pricing">
          <div className="at-card-price-row">
            <span className="at-card-price">{formatPrice(tool.price)}</span>
            {tool.oldPrice && (
              <span className="at-card-old">{formatPrice(tool.oldPrice)}</span>
            )}
          </div>
          <div className="at-card-note">One-time · Lifetime</div>
        </div>
        <i className="fas fa-arrow-right at-card-arrow"></i>
      </div>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="at-skel-card">
      <div className="at-skel-card-icon"></div>
      <div
        className="at-skel-line at-skel-long"
        style={{ marginBottom: "0.5rem" }}
      ></div>
      <div className="at-skel-line at-skel-short"></div>
      <div className="at-skel-card-footer">
        <div className="at-skel-price-big"></div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PRODUCT DETAIL
════════════════════════════════════════════════════════════════ */
function ProductDetail({ tool, onShare, copied, onBack }) {
  const disc = computeDiscount(tool.oldPrice, tool.price);
  const savings = computeSavings(tool.oldPrice, tool.price);

  return (
    <div className="at-detail-wrap">
      {/* Breadcrumb */}
      <div className="at-bc">
        <button className="at-bc-back" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          All Tools
        </button>
        <i className="fas fa-chevron-right at-bc-sep"></i>
        <span className="at-bc-cat">{tool.category}</span>
        <i className="fas fa-chevron-right at-bc-sep"></i>
        <span className="at-bc-cur">{tool.name}</span>
      </div>

      {/* Hero Card */}
      <div className="at-prod-card">
        {/* Accent top bar */}
        <div
          className="at-prod-accent"
          style={{
            background: `linear-gradient(90deg, ${tool.color}, ${tool.color}22)`,
          }}
        ></div>
        {/* Glow blob */}
        <div className="at-prod-glow" style={{ background: tool.color }}></div>

        <div className="at-prod-top">
          {/* Icon */}
          <div className="at-prod-icon-wrap">
            <div
              className="at-prod-icon"
              style={{
                background: `linear-gradient(135deg, ${tool.color}, ${tool.color}aa)`,
                boxShadow: `0 20px 40px -10px ${tool.color}60`,
              }}
            >
              <i className={tool.icon}></i>
            </div>
            {tool.status === "Coming Soon" && (
              <span className="at-prod-soon">SOON</span>
            )}
          </div>

          {/* Meta */}
          <div className="at-prod-meta">
            <div className="at-prod-chips">
              {disc && (
                <span className="at-chip at-chip-green">
                  <i className="fas fa-fire"></i> {disc} OFF
                </span>
              )}
              <span className="at-chip at-chip-slate">
                <i
                  className={getCategoryIcon(tool.category)}
                  style={{ color: "#0ea5e9" }}
                ></i>
                {tool.category}
              </span>
            </div>
            <h1 className="at-prod-name">{tool.name}</h1>
            <div className="at-prod-stats">
              {tool.views > 0 && (
                <span>
                  <i className="fas fa-eye"></i>
                  {tool.views.toLocaleString("en-IN")} views
                </span>
              )}
              {tool.features?.length > 0 && (
                <span>
                  <i className="fas fa-list-check"></i>
                  {tool.features.length} features
                </span>
              )}
              <span>
                <i className="fas fa-bolt"></i>Instant delivery
              </span>
            </div>
          </div>
        </div>

        {/* Price block */}
        <div className="at-price-block">
          <div className="at-price-left">
            {tool.oldPrice && (
              <div className="at-price-old-row">
                <span className="at-price-old">
                  {formatPrice(tool.oldPrice)}
                </span>
                {disc && <span className="at-price-off-tag">{disc} off</span>}
              </div>
            )}
            <div className="at-price-main">
              <span className="at-price-big">{formatPrice(tool.price)}</span>
              <span className="at-price-inr">INR</span>
            </div>
            <div className="at-price-note">
              <i className="fas fa-infinity"></i>
              One-time · Lifetime access
            </div>
          </div>
          {savings && (
            <div className="at-savings-box">
              <i className="fas fa-piggy-bank"></i>
              <div>
                <div className="at-savings-label">You save</div>
                <div className="at-savings-val">{savings}</div>
              </div>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="at-cta-row">
          <a
            href={tool.buyLink || "https://telegram.me/shivamnox"}
            target="_blank"
            rel="noreferrer"
            className="at-btn-buy"
          >
            <i className="fab fa-telegram"></i>
            Buy on Telegram
          </a>
          {tool.demoUrl && (
            <a
              href={tool.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="at-btn-secondary"
            >
              <i className="fas fa-play"></i>
              Demo
            </a>
          )}
          <button
            onClick={onShare}
            className={`at-btn-secondary ${copied ? "at-btn-copied" : ""}`}
          >
            <i className={copied ? "fas fa-check" : "fas fa-link"}></i>
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* Description */}
      {tool.description && (
        <SectionCard
          icon="fas fa-align-left"
          iconColor="#0284c7"
          title="About This Tool"
        >
          <div
            className="at-desc-html"
            dangerouslySetInnerHTML={{ __html: tool.description }}
          />
        </SectionCard>
      )}

      {/* Features */}
      {tool.features?.length > 0 && (
        <SectionCard
          icon="fas fa-circle-check"
          iconColor="#059669"
          title="What's Included"
          badge={`${tool.features.length} features`}
        >
          <div className="at-features-grid">
            {tool.features.map((f, i) => (
              <div className="at-feature-item" key={i}>
                <div className="at-feature-check">
                  <i className="fas fa-check"></i>
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Trust */}
      <div className="at-trust-row">
        {TRUST_ITEMS.map((tr) => (
          <div className="at-trust-item at-trust-item-col" key={tr.label}>
            <div
              className="at-trust-icon"
              style={{ color: tr.color, background: `${tr.color}18` }}
            >
              <i className={tr.icon}></i>
            </div>
            <span className="at-trust-label">{tr.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="at-det-footer">
        <button className="at-det-back" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          All Tools
        </button>
        <div className="at-det-footer-right">
          <span className="at-det-help">Need help?</span>
          <a
            href="https://telegram.me/shivamnox"
            target="_blank"
            rel="noreferrer"
            className="at-tg-btn"
          >
            <i className="fab fa-telegram"></i>
            @shivamnox
          </a>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ icon, iconColor, title, badge, children }) {
  return (
    <div className="at-section-card">
      <div className="at-section-head">
        <div
          className="at-section-icon"
          style={{ color: iconColor, background: `${iconColor}18` }}
        >
          <i className={icon}></i>
        </div>
        <h2 className="at-section-title">{title}</h2>
        {badge && <span className="at-section-badge">{badge}</span>}
      </div>
      <div className="at-section-content">{children}</div>
    </div>
  );
}
