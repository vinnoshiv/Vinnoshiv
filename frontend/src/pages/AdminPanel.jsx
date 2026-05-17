import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "../styles/AdminPanel.css";

const NAV = [
  { icon: "fas fa-gauge", label: "Overview", id: "overview" },
  { icon: "fas fa-store", label: "Tools", id: "tools" },
  { icon: "fas fa-chart-bar", label: "Analytics", id: "analytics" },
  { icon: "fas fa-envelope", label: "Messages", id: "messages", badge: 2 },
  { icon: "fas fa-bell", label: "Subscribers", id: "subscribers" },
  { icon: "fas fa-inbox", label: "Inbox", id: "inbox" },
  { icon: "fas fa-user-circle", label: "Profile", id: "profile" },
  { icon: "fas fa-circle-info", label: "Settings", id: "info" },
];

const ACTIVITY = [
  {
    icon: "fas fa-user-plus",
    color: "var(--green)",
    text: "New customer via AnimeFlix",
    time: "2m ago",
  },
  {
    icon: "fas fa-store",
    color: "var(--accent)",
    text: "Tool Store visited",
    time: "18m ago",
  },
  {
    icon: "fas fa-envelope",
    color: "#0ea5e9",
    text: "New message received",
    time: "1h ago",
  },
];

const MESSAGES = [
  {
    name: "Rahul M.",
    avatar: "R",
    subject: "Bot query",
    preview: "Does it support...",
    time: "5m",
    unread: true,
  },
  {
    name: "Sneha K.",
    avatar: "S",
    subject: "Payment done",
    preview: "I completed...",
    time: "42m",
    unread: true,
  },
  {
    name: "Arjun D.",
    avatar: "A",
    subject: "Help needed",
    preview: "Getting error...",
    time: "2h",
    unread: false,
  },
];

const PIE_COLORS = ["#0284c7", "#94a3b8"];

const EMPTY_FORM = {
  name: "",
  price: "",
  oldPrice: "",
  icon: "fas fa-tools",
  color: "#0284c7",
  ref: "",
  description: "",
  category: "automation",
  buyLink: "",
  demoUrl: "",
  features: [],
  status: "Active",
};

const stripHtml = (html) =>
  html ? html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="admin-clock">
      {now.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
      {now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
}

function RichEditor({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || "";
  }, []);

  const exec = (cmd, arg = null) => {
    ref.current.focus();
    document.execCommand(cmd, false, arg);
    if (onChange) onChange(ref.current.innerHTML);
  };

  return (
    <div className="rich-editor-wrap">
      <div className="rich-toolbar">
        {[
          { cmd: "bold", icon: "fas fa-bold", title: "Bold" },
          { cmd: "italic", icon: "fas fa-italic", title: "Italic" },
          { cmd: "underline", icon: "fas fa-underline", title: "Underline" },
        ].map(({ cmd, icon, title }) => (
          <button
            key={cmd}
            type="button"
            title={title}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(cmd);
            }}
          >
            <i className={icon}></i>
          </button>
        ))}
        <span className="toolbar-sep" />
        <button
          type="button"
          title="Bullet List"
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertUnorderedList");
          }}
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <button
          type="button"
          title="Numbered List"
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertOrderedList");
          }}
        >
          <i className="fas fa-list-ol"></i>
        </button>
        <span className="toolbar-sep" />
        <button
          type="button"
          title="Align Left"
          onMouseDown={(e) => {
            e.preventDefault();
            exec("justifyLeft");
          }}
        >
          <i className="fas fa-align-left"></i>
        </button>
        <button
          type="button"
          title="Center"
          onMouseDown={(e) => {
            e.preventDefault();
            exec("justifyCenter");
          }}
        >
          <i className="fas fa-align-center"></i>
        </button>
        <span className="toolbar-sep" />
        <button
          type="button"
          title="Clear Formatting"
          onMouseDown={(e) => {
            e.preventDefault();
            exec("removeFormat");
          }}
        >
          <i className="fas fa-text-slash"></i>
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="rich-content"
        onInput={() => onChange && onChange(ref.current.innerHTML)}
        onBlur={() => onChange && onChange(ref.current.innerHTML)}
      />
    </div>
  );
}

// ✅ Avatar component with color
function EmailAvatar({ name, email, color, initials, size = "md" }) {
  return (
    <div
      className={`email-avatar email-avatar--${size}`}
      style={{ background: color || "#0284c7" }}
      title={name || email}
    >
      {initials || (name || email || "?").charAt(0).toUpperCase()}
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const username =
    localStorage.getItem("vinnoshiv_admin_username") || "Admin";
  const fileInputRef = useRef(null);

  const [verified, setVerified] = useState(null);
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [openMsg, setOpenMsg] = useState(null);

  const [tools, setTools] = useState([]);
  const [toolsLoading, setToolsLoading] = useState(false);
  const [toolModal, setToolModal] = useState(null);
  const [toolForm, setToolForm] = useState(EMPTY_FORM);
  const [toolSaving, setToolSaving] = useState(false);
  const [toolError, setToolError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [featureInput, setFeatureInput] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [subscribers, setSubscribers] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subSearch, setSubSearch] = useState("");
  const [emailModal, setEmailModal] = useState(false);
  const [emailTarget, setEmailTarget] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [emailMode, setEmailMode] = useState("raw");
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState(null);

  const [inboxEmails, setInboxEmails] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxConfigured, setInboxConfigured] = useState(false);
  const [inboxError, setInboxError] = useState("");
  const [openEmail, setOpenEmail] = useState(null);

  const authHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem(
        "vinnoshiv_admin_token"
      )}`,
    }),
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("vinnoshiv_admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => {
        setVerified(true);
        fetchTools();
        fetchProfile();
        fetchSubscribers();
      })
      .catch(() => {
        localStorage.removeItem("vinnoshiv_admin_token");
        navigate("/admin/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (!verified) return;
    if (active === "inbox") fetchInbox();
  }, [verified, active]);

  const safeJson = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    const text = await res.text();
    throw new Error(
      `Non-JSON response (${res.status}): ${text.slice(0, 120)}`
    );
  };

  const fetchTools = async () => {
    setToolsLoading(true);
    try {
      const res = await fetch("/api/tools");
      const data = await safeJson(res);
      setTools(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchTools:", err.message);
    } finally {
      setToolsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/admin/profile", {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await safeJson(res);
        setProfile({
          name: data.name || "",
          email: data.email || "",
          profilePicture: data.profilePicture || "",
        });
      }
    } catch (err) {
      console.error("fetchProfile:", err.message);
    }
  };

  const fetchSubscribers = async () => {
    setSubsLoading(true);
    try {
      const res = await fetch("/api/subscribers", {
        headers: authHeaders(),
      });
      const data = await safeJson(res);
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchSubscribers:", err.message);
    } finally {
      setSubsLoading(false);
    }
  };

  const fetchInbox = async () => {
    setInboxLoading(true);
    setOpenEmail(null);
    try {
      const res = await fetch("/api/admin/inbox", {
        headers: authHeaders(),
      });
      const data = await safeJson(res);
      setInboxEmails(data.emails || []);
      setInboxConfigured(data.configured || false);
      setInboxError(data.error || "");
    } catch (err) {
      console.error("fetchInbox:", err.message);
      setInboxError(err.message);
    } finally {
      setInboxLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("vinnoshiv_admin_token");
    localStorage.removeItem("vinnoshiv_admin_username");
    navigate("/admin/login");
  };

  const copyText = useCallback((text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  }, []);

  const handleNavClick = (id) => {
    setActive(id);
    setSidebarOpen(false);
  };

  const openAddModal = () => {
    setToolForm(EMPTY_FORM);
    setFeatureInput("");
    setToolError("");
    setToolModal("add");
  };

  const openEditModal = (tool) => {
    setToolForm({
      name: tool.name,
      price: tool.price,
      oldPrice: tool.oldPrice || "",
      icon: tool.icon,
      color: tool.color,
      ref: tool.ref,
      description: tool.description || "",
      category: tool.category || "automation",
      buyLink: tool.buyLink || "",
      demoUrl: tool.demoUrl || "",
      features: Array.isArray(tool.features) ? [...tool.features] : [],
      status: tool.status || "Active",
    });
    setFeatureInput("");
    setToolError("");
    setToolModal(tool);
  };

  const closeModal = () => {
    setToolModal(null);
    setToolError("");
  };

  const handleToolFormChange = (e) => {
    const { name, value } = e.target;
    setToolForm((prev) => ({ ...prev, [name]: value }));
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setToolForm((prev) => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()],
    }));
    setFeatureInput("");
  };

  const removeFeature = (idx) => {
    setToolForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveTool = async () => {
    if (
      !toolForm.name.trim() ||
      !toolForm.price.trim() ||
      !toolForm.ref.trim()
    ) {
      setToolError("Name, price and ref are required.");
      return;
    }
    setToolSaving(true);
    setToolError("");
    try {
      const isEdit = toolModal !== "add";
      const url = isEdit ? `/api/tools/${toolModal._id}` : "/api/tools";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(toolForm),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        setToolError(data.message || "Failed to save tool.");
        return;
      }
      await fetchTools();
      closeModal();
    } catch (err) {
      setToolError(
        err.message.startsWith("Non-JSON")
          ? "Server error."
          : err.message || "Network error."
      );
    } finally {
      setToolSaving(false);
    }
  };

  const handleDeleteTool = async (id) => {
    try {
      await fetch(`/api/tools/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      await fetchTools();
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setProfile((p) => ({ ...p, profilePicture: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(profile),
      });
      setProfileMsg(
        res.ok ? "Profile saved successfully!" : "Failed to save. Try again."
      );
    } catch {
      setProfileMsg("Network error. Try again.");
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(""), 3000);
    }
  };

  const openEmailModal = (target = null) => {
    setEmailTarget(target);
    setEmailSubject("");
    setEmailContent("");
    setEmailResult(null);
    setEmailModal(true);
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      setEmailResult({
        ok: false,
        msg: "Subject and content are required.",
      });
      return;
    }
    setEmailSending(true);
    setEmailResult(null);
    try {
      const body = { subject: emailSubject, html: emailContent };
      if (emailTarget) body.recipientIds = [emailTarget._id];
      const res = await fetch("/api/subscribers/send-email", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await safeJson(res);
      setEmailResult({
        ok: res.ok,
        msg: data.message || (res.ok ? "Sent!" : "Failed."),
      });
      if (res.ok) {
        setTimeout(() => {
          setEmailModal(false);
          setEmailResult(null);
        }, 2500);
      }
    } catch (err) {
      setEmailResult({ ok: false, msg: err.message });
    } finally {
      setEmailSending(false);
    }
  };

  const handleToggleSub = async (id) => {
    try {
      await fetch(`/api/subscribers/${id}/toggle`, {
        method: "PUT",
        headers: authHeaders(),
      });
      fetchSubscribers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSub = async (id) => {
    try {
      await fetch(`/api/subscribers/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      fetchSubscribers();
    } catch (err) {
      console.error(err);
    }
  };

  if (verified === null) {
    return (
      <div className="admin-loading">
        <i className="fas fa-circle-notch fa-spin"></i>
      </div>
    );
  }

  const totalViews = tools.reduce((s, t) => s + (t.views || 0), 0);
  const activeSubs = subscribers.filter((s) => s.active).length;
  const filteredSubs = subscribers.filter((s) =>
    s.email.toLowerCase().includes(subSearch.toLowerCase())
  );
  const unreadCount = inboxEmails.filter((e) => !e.seen).length;

  const viewsChartData = tools.map((t) => ({
    name: t.name.length > 12 ? t.name.slice(0, 12) + "…" : t.name,
    Views: t.views || 0,
    fill: t.color || "#0284c7",
  }));

  const subPieData = [
    { name: "Active", value: activeSubs },
    { name: "Inactive", value: subscribers.length - activeSubs },
  ];

  const getWeeklyData = () => {
    const now = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      last7Days.push(d);
    }
    return last7Days.map((date, idx) => {
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const baseVisits =
        Math.floor(totalViews / 7) + Math.floor(Math.random() * 20);
      const baseSales =
        Math.floor(tools.length / 2) + Math.floor(Math.random() * 3);
      return {
        day: dayName,
        date: date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        visits: baseVisits + idx * 5,
        sales: baseSales + (idx % 3),
      };
    });
  };

  const WEEKLY = getWeeklyData();

  return (
    <div className="admin-layout">
      {/* ── EMAIL COMPOSE MODAL ── */}
      {emailModal && (
        <div
          className="ap-modal-overlay"
          onClick={() => setEmailModal(false)}
        >
          <div
            className="ap-modal ap-email-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ap-modal-header">
              <h2>
                <i className="fas fa-paper-plane"></i> Compose Email
              </h2>
              <button
                className="ap-modal-close"
                onClick={() => setEmailModal(false)}
              >
                <i className="fas fa-xmark"></i>
              </button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-email-to-label">
                <i className="fas fa-users"></i>
                To:{" "}
                <strong>
                  {emailTarget
                    ? emailTarget.email
                    : `All active subscribers (${activeSubs})`}
                </strong>
              </div>
              <div className="ap-form-group">
                <label className="ap-form-label">Subject *</label>
                <input
                  className="ap-form-input"
                  placeholder="Email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div className="ap-form-group">
                <div className="ap-editor-mode-row">
                  <label className="ap-form-label" style={{ margin: 0 }}>
                    Content *
                  </label>
                  <div className="ap-mode-toggle">
                    <button
                      type="button"
                      className={`ap-mode-btn ${
                        emailMode === "rich" ? "active" : ""
                      }`}
                      onClick={() => setEmailMode("rich")}
                    >
                      <i className="fas fa-pen-nib"></i> Rich Text
                    </button>
                    <button
                      type="button"
                      className={`ap-mode-btn ${
                        emailMode === "raw" ? "active" : ""
                      }`}
                      onClick={() => setEmailMode("raw")}
                    >
                      <i className="fas fa-code"></i> Raw HTML
                    </button>
                  </div>
                </div>
                {emailMode === "raw" ? (
                  <textarea
                    className="ap-form-input ap-raw-html-area"
                    placeholder="Paste your full HTML email template here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={12}
                    spellCheck={false}
                  />
                ) : (
                  <RichEditor
                    key={`${emailTarget ? emailTarget._id : "all"}-rich`}
                    value={emailContent}
                    onChange={setEmailContent}
                  />
                )}
                {emailMode === "raw" && (
                  <p className="ap-raw-hint">
                    <i className="fas fa-circle-info"></i> HTML is sent as-is
                    — full templates with &lt;!DOCTYPE&gt;, inline styles, and
                    tables are supported.
                  </p>
                )}
              </div>
              {emailResult && (
                <div
                  className={`ap-form-error ${
                    emailResult.ok ? "ap-form-success" : ""
                  }`}
                >
                  <i
                    className={`fas fa-${
                      emailResult.ok
                        ? "check-circle"
                        : "triangle-exclamation"
                    }`}
                  ></i>{" "}
                  {emailResult.msg}
                </div>
              )}
            </div>
            <div className="ap-modal-footer">
              <button
                className="ap-btn-secondary"
                onClick={() => setEmailModal(false)}
              >
                Cancel
              </button>
              <button
                className="ap-btn-primary"
                onClick={handleSendEmail}
                disabled={emailSending}
              >
                {emailSending ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i> Sending…
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOOL MODAL ── */}
      {toolModal && (
        <div className="ap-modal-overlay" onClick={closeModal}>
          <div
            className="ap-modal ap-tool-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ap-modal-header">
              <h2>
                {toolModal === "add" ? "Add New Tool" : "Edit Tool"}
              </h2>
              <button className="ap-modal-close" onClick={closeModal}>
                <i className="fas fa-xmark"></i>
              </button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label className="ap-form-label">Tool Name *</label>
                  <input
                    className="ap-form-input"
                    name="name"
                    value={toolForm.name}
                    onChange={handleToolFormChange}
                    placeholder="e.g. YouTube Downloader Bot"
                  />
                </div>
                <div className="ap-form-group">
                  <label className="ap-form-label">Ref / Slug *</label>
                  <input
                    className="ap-form-input"
                    name="ref"
                    value={toolForm.ref}
                    onChange={handleToolFormChange}
                    placeholder="e.g. youtube-bot"
                  />
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label className="ap-form-label">Sale Price *</label>
                  <input
                    className="ap-form-input"
                    name="price"
                    value={toolForm.price}
                    onChange={handleToolFormChange}
                    placeholder="e.g. ₹799"
                  />
                </div>
                <div className="ap-form-group">
                  <label className="ap-form-label">Original Price</label>
                  <input
                    className="ap-form-input"
                    name="oldPrice"
                    value={toolForm.oldPrice}
                    onChange={handleToolFormChange}
                    placeholder="e.g. ₹1,999"
                  />
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-group ap-icon-group">
                  <label className="ap-form-label">Icon Class</label>
                  <div className="ap-icon-input-wrap">
                    <input
                      className="ap-form-input"
                      name="icon"
                      value={toolForm.icon}
                      onChange={handleToolFormChange}
                      placeholder="e.g. fab fa-telegram"
                    />
                    <span
                      className="ap-icon-preview"
                      style={{ color: toolForm.color }}
                    >
                      <i className={toolForm.icon}></i>
                    </span>
                  </div>
                </div>
                <div className="ap-form-group">
                  <label className="ap-form-label">Accent Color</label>
                  <div className="ap-color-wrap">
                    <input
                      type="color"
                      className="ap-color-input"
                      name="color"
                      value={toolForm.color}
                      onChange={handleToolFormChange}
                    />
                    <span className="ap-color-value">{toolForm.color}</span>
                  </div>
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label className="ap-form-label">Buy Link</label>
                  <input
                    className="ap-form-input"
                    name="buyLink"
                    value={toolForm.buyLink}
                    onChange={handleToolFormChange}
                    placeholder="https://t.me/shivamnox"
                  />
                </div>
                <div className="ap-form-group">
                  <label className="ap-form-label">Demo Link</label>
                  <input
                    className="ap-form-input"
                    name="demoUrl"
                    value={toolForm.demoUrl}
                    onChange={handleToolFormChange}
                    placeholder="https://t.me/demo"
                  />
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label className="ap-form-label">Category</label>
                  <input
                    className="ap-form-input"
                    name="category"
                    value={toolForm.category}
                    onChange={handleToolFormChange}
                    placeholder="e.g. automation"
                  />
                </div>
                <div className="ap-form-group">
                  <label className="ap-form-label">Status</label>
                  <select
                    className="ap-form-input"
                    name="status"
                    value={toolForm.status}
                    onChange={handleToolFormChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
              </div>
              <div className="ap-form-group">
                <label className="ap-form-label">
                  Description (Rich Text)
                </label>
                <RichEditor
                  key={toolModal === "add" ? "new-tool" : toolModal._id}
                  value={toolForm.description}
                  onChange={(html) =>
                    setToolForm((p) => ({ ...p, description: html }))
                  }
                />
              </div>
              <div className="ap-form-group">
                <label className="ap-form-label">
                  Features{" "}
                  <span className="ap-label-hint">— what's included</span>
                </label>
                <div className="ap-feature-input-row">
                  <input
                    className="ap-form-input"
                    placeholder="Add a feature and press Enter or +"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addFeature())
                    }
                  />
                  <button
                    type="button"
                    className="ap-btn-secondary ap-add-feat-btn"
                    onClick={addFeature}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {toolForm.features && toolForm.features.length > 0 && (
                  <div className="ap-features-tags">
                    {toolForm.features.map((f, i) => (
                      <span className="ap-feat-tag" key={i}>
                        <i className="fas fa-check"></i> {f}
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                        >
                          <i className="fas fa-xmark"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {toolError && (
                <div className="ap-form-error">
                  <i className="fas fa-triangle-exclamation"></i> {toolError}
                </div>
              )}
            </div>
            <div className="ap-modal-footer">
              <button className="ap-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="ap-btn-primary"
                onClick={handleSaveTool}
                disabled={toolSaving}
              >
                {toolSaving ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i> Saving…
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>{" "}
                    {toolModal === "add" ? "Add Tool" : "Save Changes"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div
          className="ap-modal-overlay"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="ap-modal ap-modal-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ap-modal-header">
              <h2>Delete Tool</h2>
              <button
                className="ap-modal-close"
                onClick={() => setDeleteConfirm(null)}
              >
                <i className="fas fa-xmark"></i>
              </button>
            </div>
            <div className="ap-modal-body">
              <p className="ap-delete-msg">
                Are you sure you want to delete{" "}
                <strong>{deleteConfirm.name}</strong>? This cannot be undone.
              </p>
            </div>
            <div className="ap-modal-footer">
              <button
                className="ap-btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="ap-btn-danger"
                onClick={() => handleDeleteTool(deleteConfirm._id)}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="admin-header">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="header-brand">
          <img src="/logo.png" alt="Logo" />
          <span>Vinnoshiv</span>
        </div>
        <div className="header-center">
          <Clock />
        </div>
        <div className="header-actions">
          <div className="user-badge">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="avatar"
                className="header-avatar-img"
              />
            ) : (
              <i className="fas fa-user-shield"></i>
            )}
            <span>{profile.name || username}</span>
          </div>
          <button className="icon-btn" onClick={toggle} title="Theme">
            <i
              className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}
            ></i>
          </button>
          <button className="logout-btn" onClick={logout} title="Logout">
            <i className="fas fa-power-off"></i>
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          <div className="nav-group">
            <div className="nav-label">Navigation</div>
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`nav-item ${active === n.id ? "active" : ""}`}
                onClick={() => handleNavClick(n.id)}
              >
                <i className={n.icon}></i>
                <span>{n.label}</span>
                {n.id === "subscribers" && subscribers.length > 0 && (
                  <span className="nav-badge">{subscribers.length}</span>
                )}
                {n.id === "inbox" && unreadCount > 0 && (
                  <span className="nav-badge">{unreadCount}</span>
                )}
                {n.badge &&
                  n.id !== "subscribers" &&
                  n.id !== "inbox" && (
                    <span className="nav-badge">{n.badge}</span>
                  )}
              </button>
            ))}
          </div>
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot"></span>
          <span>All Systems Online</span>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="admin-main">
        {/* ══════════════════════════════════
            OVERVIEW
        ══════════════════════════════════ */}
        {active === "overview" && (
          <div className="page-content">
            <div className="page-header">
              <h1>Welcome back, {profile.name || username}</h1>
              <p>Here's what's happening with your business</p>
            </div>
            <div className="stats-container">
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(2,132,199,0.1)",
                    color: "#0284c7",
                  }}
                >
                  <i className="fas fa-tools"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Tools</span>
                  <span className="stat-value">{tools.length}</span>
                  <span className="stat-note">In store</span>
                </div>
              </div>
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "var(--green)",
                  }}
                >
                  <i className="fas fa-eye"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Views</span>
                  <span className="stat-value">{totalViews}</span>
                  <span className="stat-note">Across all tools</span>
                </div>
              </div>
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(14,165,233,0.1)",
                    color: "#0ea5e9",
                  }}
                >
                  <i className="fas fa-bell"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Subscribers</span>
                  <span className="stat-value">{subscribers.length}</span>
                  <span className="stat-note">{activeSubs} active</span>
                </div>
              </div>
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "var(--green)",
                  }}
                >
                  <i className="fas fa-server"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Status</span>
                  <span className="stat-value">● Online</span>
                  <span className="stat-note">All systems up</span>
                </div>
              </div>
            </div>

            <div className="grid-2col">
              <div className="card">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-bolt"></i> Quick Actions
                  </h2>
                </div>
                <div className="card-body">
                  <div className="action-grid">
                    <button
                      className="action-link"
                      onClick={() => handleNavClick("tools")}
                    >
                      <i className="fas fa-store"></i> Tools
                    </button>
                    <button
                      className="action-link"
                      onClick={() => handleNavClick("analytics")}
                    >
                      <i className="fas fa-chart-bar"></i> Analytics
                    </button>
                    <button
                      className="action-link"
                      onClick={() => handleNavClick("subscribers")}
                    >
                      <i className="fas fa-bell"></i> Subscribers
                    </button>
                    <button
                      className="action-link"
                      onClick={() => handleNavClick("inbox")}
                    >
                      <i className="fas fa-inbox"></i> Inbox
                    </button>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-info-circle"></i> System Info
                  </h2>
                </div>
                <div className="card-body">
                  <div className="info-list">
                    <div className="info-row">
                      <span>Server</span>
                      <span className="status-live">● Online</span>
                    </div>
                    <div className="info-row">
                      <span>Session</span>
                      <span>Active</span>
                    </div>
                    <div className="info-row">
                      <span>Theme</span>
                      <span>{theme}</span>
                    </div>
                    <div className="info-row">
                      <span>Version</span>
                      <span>v2.0.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>
                  <i className="fas fa-clock"></i> Recent Activity
                </h2>
                <span className="badge-live">LIVE</span>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="activity-item">
                      <div
                        className="activity-icon"
                        style={{ color: a.color }}
                      >
                        <i className={a.icon}></i>
                      </div>
                      <div className="activity-content">
                        <span className="activity-text">{a.text}</span>
                        <span className="activity-time">{a.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            TOOLS
        ══════════════════════════════════ */}
        {active === "tools" && (
          <div className="page-content">
            <div className="page-header ap-tools-header">
              <div>
                <h1>Tool Store</h1>
                <p>Manage and publish your products</p>
              </div>
              <button className="ap-btn-primary" onClick={openAddModal}>
                <i className="fas fa-plus"></i> Add New Tool
              </button>
            </div>

            {toolsLoading ? (
              <div className="ap-loading-state">
                <i className="fas fa-circle-notch fa-spin"></i>
                <span>Loading tools…</span>
              </div>
            ) : tools.length === 0 ? (
              <div className="ap-empty-state">
                <i className="fas fa-store-slash"></i>
                <p>No tools yet. Add your first tool!</p>
                <button className="ap-btn-primary" onClick={openAddModal}>
                  <i className="fas fa-plus"></i> Add Tool
                </button>
              </div>
            ) : (
              <div className="products-container">
                {tools.map((p) => (
                  <div
                    key={p._id}
                    className="product-card"
                    style={{ borderTopColor: p.color }}
                  >
                    <div className="product-header">
                      <div
                        className="product-icon"
                        style={{
                          background: p.color + "20",
                          color: p.color,
                        }}
                      >
                        <i className={p.icon}></i>
                      </div>
                      <span className="product-status">
                        {p.status || "Active"}
                      </span>
                    </div>
                    <h3>{p.name}</h3>
                    {p.description && (
                      <p className="product-desc">
                        {stripHtml(p.description).slice(0, 80)}
                        {stripHtml(p.description).length > 80 ? "…" : ""}
                      </p>
                    )}
                    <div className="product-pricing">
                      <span className="price">{p.price}</span>
                      {p.oldPrice && (
                        <span className="old-price">{p.oldPrice}</span>
                      )}
                    </div>
                    <div className="product-stats">
                      <span>
                        <i className="fas fa-eye"></i> {p.views || 0} views
                      </span>
                      <span>
                        <i className="fas fa-users"></i> {p.sales} sales
                      </span>
                      {p.features && p.features.length > 0 && (
                        <span>
                          <i className="fas fa-list-check"></i>{" "}
                          {p.features.length} features
                        </span>
                      )}
                    </div>
                    {p.buyLink && (
                      <div className="product-buy-link">
                        <i className="fas fa-link"></i>
                        <a
                          href={p.buyLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Buy Link ↗
                        </a>
                      </div>
                    )}
                    <div className="product-actions">
                      <button
                        className="btn-link"
                        onClick={() => openEditModal(p)}
                        title="Edit"
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                      <button
                        className="btn-link btn-link-copy"
                        onClick={() =>
                          copyText(
                            `${window.location.origin}/tools/automation?ref=${p.ref}`,
                            p.ref
                          )
                        }
                        title="Copy link"
                      >
                        <i
                          className={
                            copied === p.ref
                              ? "fas fa-check"
                              : "fas fa-copy"
                          }
                        ></i>
                      </button>
                      <button
                        className="btn-link btn-link-danger"
                        onClick={() => setDeleteConfirm(p)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tools.length > 0 && (
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <div className="card-header">
                  <h2>
                    <i className="fas fa-eye"></i> Views Overview
                  </h2>
                </div>
                <div className="card-body">
                  {tools.map((p) => (
                    <div key={p._id} className="sales-row">
                      <span className="sales-name">
                        <i
                          className={p.icon}
                          style={{ color: p.color }}
                        ></i>{" "}
                        {p.name}
                      </span>
                      <div className="sales-bar">
                        <div
                          className="bar"
                          style={{
                            width: `${Math.min(
                              ((p.views || 0) /
                                Math.max(
                                  1,
                                  Math.max(
                                    ...tools.map((t) => t.views || 0)
                                  )
                                )) *
                                100,
                              100
                            )}%`,
                            background: p.color,
                          }}
                        ></div>
                      </div>
                      <span className="sales-count">{p.views || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════
            ANALYTICS
        ══════════════════════════════════ */}
        {active === "analytics" && (
          <div className="page-content">
            <div className="page-header">
              <h1>Analytics</h1>
              <p>Real-time performance metrics from your database</p>
            </div>

            <div className="stats-container">
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(2,132,199,0.1)",
                    color: "#0284c7",
                  }}
                >
                  <i className="fas fa-eye"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Views</span>
                  <span className="stat-value">{totalViews}</span>
                  <span className="stat-note">Across all tools</span>
                </div>
              </div>
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "var(--green)",
                  }}
                >
                  <i className="fas fa-store"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Tools</span>
                  <span className="stat-value">{tools.length}</span>
                  <span className="stat-note">Published</span>
                </div>
              </div>
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(14,165,233,0.1)",
                    color: "#0ea5e9",
                  }}
                >
                  <i className="fas fa-bell"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Subscribers</span>
                  <span className="stat-value">{activeSubs}</span>
                  <span className="stat-note">Active</span>
                </div>
              </div>
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    color: "#f59e0b",
                  }}
                >
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Avg Views</span>
                  <span className="stat-value">
                    {tools.length
                      ? Math.round(totalViews / tools.length)
                      : 0}
                  </span>
                  <span className="stat-note">Per tool</span>
                </div>
              </div>
            </div>

            <div className="analytics-charts-grid">
              <div className="chart-card chart-card-wide">
                <div className="chart-card-header">
                  <h3>
                    <i className="fas fa-chart-area"></i> Tool Views
                    Distribution
                  </h3>
                </div>
                <div className="chart-body">
                  {viewsChartData.length === 0 ? (
                    <div className="chart-empty">
                      <i className="fas fa-chart-bar"></i>
                      <p>No tools yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart
                        data={viewsChartData}
                        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorViews"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#0284c7"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#0284c7"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(148,163,184,0.1)"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                          labelStyle={{
                            color: "var(--text)",
                            fontWeight: 600,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Views"
                          stroke="#0284c7"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorViews)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="chart-card chart-card-wide">
                <div className="chart-card-header">
                  <h3>
                    <i className="fas fa-calendar-week"></i> 7-Day Performance
                    Trend
                  </h3>
                </div>
                <div className="chart-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={WEEKLY}
                      margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148,163,184,0.1)"
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{
                          color: "var(--text)",
                          fontWeight: 600,
                        }}
                        formatter={(value, name) => [
                          value,
                          name === "visits" ? "Visits" : "Sales",
                        ]}
                        labelFormatter={(label, payload) =>
                          payload[0]?.payload?.date || label
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="visits"
                        stroke="#0284c7"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#0284c7",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#059669",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 7 }}
                      />
                      <Legend
                        formatter={(value) =>
                          value === "visits" ? "Visits" : "Sales"
                        }
                        wrapperStyle={{ paddingTop: "10px" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-card-header">
                  <h3>
                    <i className="fas fa-users"></i> Subscriber Status
                  </h3>
                </div>
                <div className="chart-body chart-body-pie">
                  {subscribers.length === 0 ? (
                    <div className="chart-empty">
                      <i className="fas fa-users"></i>
                      <p>No subscribers yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={subPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {subPieData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                          }}
                        />
                        <Legend
                          formatter={(v) => (
                            <span style={{ color: "var(--text)" }}>{v}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-card-header">
                  <h3>
                    <i className="fas fa-trophy"></i> Top Tools by Views
                  </h3>
                </div>
                <div className="chart-body">
                  {tools.length === 0 ? (
                    <div className="chart-empty">
                      <i className="fas fa-store"></i>
                      <p>No tools yet</p>
                    </div>
                  ) : (
                    <div className="top-tools-list">
                      {[...tools]
                        .sort((a, b) => (b.views || 0) - (a.views || 0))
                        .slice(0, 5)
                        .map((t, i) => (
                          <div key={t._id} className="top-tool-row">
                            <span
                              className="top-tool-rank"
                              style={{
                                color:
                                  i === 0
                                    ? "#f59e0b"
                                    : i === 1
                                    ? "#94a3b8"
                                    : i === 2
                                    ? "#cd7f32"
                                    : "var(--text-4)",
                              }}
                            >
                              #{i + 1}
                            </span>
                            <div
                              className="top-tool-icon"
                              style={{ color: t.color }}
                            >
                              <i className={t.icon}></i>
                            </div>
                            <div className="top-tool-info">
                              <span className="top-tool-name">{t.name}</span>
                              <span className="top-tool-cat">
                                {t.category}
                              </span>
                            </div>
                            <div className="top-tool-views">
                              <span>{t.views || 0}</span>
                              <span className="top-tool-label">views</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            MESSAGES
        ══════════════════════════════════ */}
        {active === "messages" && (
          <div className="page-content">
            <div className="page-header">
              <h1>Messages</h1>
              <p>Customer inquiries and support requests</p>
            </div>
            <div className="messages-list">
              {MESSAGES.map((m, i) => (
                <div
                  key={i}
                  className={`message-card ${m.unread ? "unread" : ""} ${
                    openMsg === i ? "open" : ""
                  }`}
                  onClick={() => setOpenMsg(openMsg === i ? null : i)}
                >
                  <div className="message-avatar">{m.avatar}</div>
                  <div className="message-body">
                    <div className="message-top">
                      <span className="message-name">{m.name}</span>
                      <span className="message-time">{m.time}</span>
                    </div>
                    <div className="message-subject">{m.subject}</div>
                    <div className="message-preview">
                      {openMsg === i
                        ? "Full message content would appear here..."
                        : m.preview}
                    </div>
                  </div>
                  {m.unread && <span className="unread-dot"></span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            SUBSCRIBERS
        ══════════════════════════════════ */}
        {active === "subscribers" && (
          <div className="page-content">
            <div className="page-header">
              <div>
                <h1>Subscribers</h1>
                <p>
                  {subscribers.length} total · {activeSubs} active
                </p>
              </div>
              <button
                className="ap-btn-primary"
                onClick={() => openEmailModal(null)}
              >
                <i className="fas fa-paper-plane"></i> Send to All
              </button>
            </div>

            <div className="sub-search-bar">
              <i className="fas fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search by email…"
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
              />
              {subSearch && (
                <button onClick={() => setSubSearch("")}>
                  <i className="fas fa-xmark"></i>
                </button>
              )}
            </div>

            {subsLoading ? (
              <div className="ap-loading-state">
                <i className="fas fa-circle-notch fa-spin"></i>
                <span>Loading subscribers…</span>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="ap-empty-state">
                <i className="fas fa-bell-slash"></i>
                <p>
                  No subscribers yet. Add the newsletter to your home page.
                </p>
              </div>
            ) : (
              <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                  <div className="sub-table-wrap">
                    <table className="sub-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Email</th>
                          <th>Subscribed</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubs.map((s, i) => (
                          <tr key={s._id}>
                            <td className="sub-num">{i + 1}</td>
                            <td className="sub-email">
                              <i className="fas fa-envelope"></i> {s.email}
                            </td>
                            <td className="sub-date">
                              {new Date(s.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td>
                              <span
                                className={`sub-status-badge ${
                                  s.active ? "active" : "inactive"
                                }`}
                              >
                                {s.active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="sub-actions">
                              <button
                                className="ap-sub-action-btn"
                                title="Send Email"
                                onClick={() => openEmailModal(s)}
                              >
                                <i className="fas fa-paper-plane"></i>
                              </button>
                              <button
                                className="ap-sub-action-btn"
                                title={
                                  s.active ? "Deactivate" : "Activate"
                                }
                                onClick={() => handleToggleSub(s._id)}
                              >
                                <i
                                  className={`fas fa-${
                                    s.active ? "ban" : "check"
                                  }`}
                                ></i>
                              </button>
                              <button
                                className="ap-sub-action-btn ap-sub-del-btn"
                                title="Delete"
                                onClick={() => handleDeleteSub(s._id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════
            ✅ INBOX — FIXED SIDE PANEL
        ══════════════════════════════════ */}
        {active === "inbox" && (
          <div className="page-content inbox-page">
            {/* Header */}
            <div className="page-header inbox-page-header">
              <div>
                <h1>
                  Inbox{" "}
                  {unreadCount > 0 && (
                    <span className="inbox-unread-badge">{unreadCount}</span>
                  )}
                </h1>
                <p>Your Gmail inbox</p>
              </div>
              <button
                className="ap-btn-secondary"
                onClick={fetchInbox}
                disabled={inboxLoading}
              >
                <i
                  className={`fas fa-${
                    inboxLoading ? "circle-notch fa-spin" : "rotate"
                  }`}
                ></i>{" "}
                Refresh
              </button>
            </div>

            {/* Setup Banner */}
            {!inboxConfigured && !inboxLoading && (
              <div className="inbox-setup-banner">
                <i className="fas fa-triangle-exclamation"></i>
                <div>
                  <strong>Gmail not configured</strong>
                  <p>
                    {inboxError ||
                      "Set GMAIL_USER and GMAIL_PASS in your .env file"}
                  </p>
                  <p className="inbox-setup-hint">
                    <i className="fas fa-circle-info"></i> Enable IMAP in
                    Gmail Settings → Forwarding and POP/IMAP → Enable IMAP.
                    Use an App Password.
                  </p>
                </div>
              </div>
            )}

            {inboxLoading ? (
              <div className="ap-loading-state">
                <i className="fas fa-circle-notch fa-spin"></i>
                <span>Connecting to Gmail…</span>
              </div>
            ) : inboxConfigured && inboxEmails.length === 0 ? (
              <div className="ap-empty-state">
                <i className="fas fa-inbox"></i>
                <p>Inbox is empty.</p>
              </div>
            ) : inboxConfigured ? (
              /* ✅ SIDE-BY-SIDE LAYOUT — email list + detail panel */
              <div className="inbox-layout">
                {/* ━━━ LEFT: EMAIL LIST ━━━ */}
                <div className="inbox-sidebar">
                  <div className="inbox-sidebar-header">
                    <h3>
                      <i className="fas fa-inbox"></i> All Mail
                    </h3>
                    <span className="inbox-count">{inboxEmails.length}</span>
                  </div>
                  <div className="inbox-list">
                    {inboxEmails.map((email, i) => (
                      <div
                        key={i}
                        className={`inbox-item ${
                          !email.seen ? "unread" : ""
                        } ${openEmail === i ? "active" : ""}`}
                        onClick={() => setOpenEmail(i)}
                      >
                        {/* ✅ Colored avatar */}
                        <div
                          className="inbox-avatar"
                          style={{
                            background:
                              email.avatarColor || "#0284c7",
                          }}
                        >
                          {email.initials ||
                            (email.fromName || email.from || "?")
                              .charAt(0)
                              .toUpperCase()}
                        </div>

                        <div className="inbox-body">
                          <div className="inbox-top">
                            <span className="inbox-from">
                              {email.fromName || email.from || "Unknown"}
                            </span>
                            <span className="inbox-date">
                              {email.date
                                ? new Date(email.date).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                    }
                                  )
                                : ""}
                            </span>
                          </div>
                          <div className="inbox-subject">
                            {email.subject || "(No Subject)"}
                          </div>
                          <div className="inbox-preview">
                            {email.textPlain
                              ? email.textPlain.substring(0, 55).trim() +
                                "…"
                              : email.html
                              ? stripHtml(email.html)
                                  .substring(0, 55)
                                  .trim() + "…"
                              : "No content"}
                          </div>
                        </div>

                        {/* ✅ Unread dot only for unread */}
                        {!email.seen && (
                          <span className="unread-dot"></span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ━━━ RIGHT: EMAIL DETAIL ━━━ */}
                <div className="inbox-detail">
                  {openEmail === null ? (
                    <div className="inbox-empty-detail">
                      <div className="inbox-empty-icon">
                        <i className="fas fa-envelope-open-text"></i>
                      </div>
                      <h3>Select an email</h3>
                      <p>Choose a message from the list to read it</p>
                    </div>
                  ) : (
                    <div className="email-view">
                      {/* ✅ Email Header */}
                      <div className="email-header">
                        <div
                          className="email-sender-avatar"
                          style={{
                            background:
                              inboxEmails[openEmail].avatarColor ||
                              "#0284c7",
                          }}
                        >
                          {inboxEmails[openEmail].initials ||
                            (
                              inboxEmails[openEmail].fromName ||
                              inboxEmails[openEmail].from ||
                              "?"
                            )
                              .charAt(0)
                              .toUpperCase()}
                        </div>
                        <div className="email-meta">
                          <h2 className="email-subject-title">
                            {inboxEmails[openEmail].subject ||
                              "(No Subject)"}
                          </h2>
                          <div className="email-sender-info">
                            <span className="email-sender-name">
                              {inboxEmails[openEmail].fromName ||
                                "Unknown Sender"}
                            </span>
                            <span className="email-sender-addr">
                              &lt;{inboxEmails[openEmail].from}&gt;
                            </span>
                          </div>
                          <div className="email-date-row">
                            <i className="fas fa-clock"></i>
                            {inboxEmails[openEmail].date
                              ? new Date(
                                  inboxEmails[openEmail].date
                                ).toLocaleString("en-IN", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Date unknown"}
                          </div>
                          {inboxEmails[openEmail].hasAttachments && (
                            <div className="email-attachment-badge">
                              <i className="fas fa-paperclip"></i>
                              {inboxEmails[openEmail].attachmentCount}{" "}
                              attachment
                              {inboxEmails[openEmail].attachmentCount !== 1
                                ? "s"
                                : ""}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="email-divider"></div>

                      {/* ✅ Email Body */}
                      <div className="email-body">
                        {inboxEmails[openEmail].html ? (
                          <div
                            className="email-html-content"
                            dangerouslySetInnerHTML={{
                              __html: inboxEmails[openEmail].html,
                            }}
                          />
                        ) : inboxEmails[openEmail].textPlain ? (
                          <div className="email-text-content">
                            {inboxEmails[openEmail].textPlain}
                          </div>
                        ) : (
                          <div className="email-empty-body">
                            <i className="fas fa-file-slash"></i>
                            <p>No displayable content</p>
                          </div>
                        )}
                      </div>

                      {/* ✅ Email Footer */}
                      <div className="email-footer">
                        <button className="email-action-btn email-action-reply">
                          <i className="fas fa-reply"></i> Reply
                        </button>
                        <button className="email-action-btn email-action-forward">
                          <i className="fas fa-share"></i> Forward
                        </button>
                        <button className="email-action-btn email-action-delete">
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ══════════════════════════════════
            PROFILE
        ══════════════════════════════════ */}
        {active === "profile" && (
          <div className="page-content">
            <div className="page-header">
              <h1>Admin Profile</h1>
              <p>Manage your account information</p>
            </div>
            <div className="grid-2col">
              <div className="card">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-user-circle"></i> Personal Info
                  </h2>
                </div>
                <div className="card-body">
                  <div className="profile-avatar-wrap">
                    <div
                      className="profile-avatar"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="avatar" />
                      ) : (
                        <i className="fas fa-user-circle"></i>
                      )}
                      <div className="avatar-overlay">
                        <i className="fas fa-camera"></i>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleProfilePicChange}
                    />
                    <span className="avatar-hint">Click to change photo</span>
                  </div>
                  <div className="ap-form-group">
                    <label className="ap-form-label">Display Name</label>
                    <input
                      className="ap-form-input"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Admin name"
                    />
                  </div>
                  <div className="ap-form-group">
                    <label className="ap-form-label">Email</label>
                    <input
                      className="ap-form-input"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          email: e.target.value,
                        }))
                      }
                      placeholder="admin@email.com"
                    />
                  </div>
                  {profileMsg && (
                    <div
                      className={`ap-form-error ${
                        profileMsg.includes("success")
                          ? "ap-form-success"
                          : ""
                      }`}
                    >
                      {profileMsg}
                    </div>
                  )}
                  <button
                    className="ap-btn-primary"
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    style={{ marginTop: "1rem" }}
                  >
                    {profileSaving ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin"></i>{" "}
                        Saving…
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check"></i> Save Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-shield"></i> Account Security
                  </h2>
                </div>
                <div className="card-body">
                  <div className="info-list">
                    <div className="info-row">
                      <span>Username</span>
                      <span>{username}</span>
                    </div>
                    <div className="info-row">
                      <span>Role</span>
                      <span>Super Admin</span>
                    </div>
                    <div className="info-row">
                      <span>Auth</span>
                      <span>JWT Token</span>
                    </div>
                    <div className="info-row">
                      <span>Session</span>
                      <span className="status-live">● Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            SETTINGS
        ══════════════════════════════════ */}
        {active === "info" && (
          <div className="page-content">
            <div className="page-header">
              <h1>Settings & Info</h1>
              <p>Store configuration and environment status</p>
            </div>
            <div className="grid-2col">
              <div className="card">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-store"></i> Store Info
                  </h2>
                </div>
                <div className="card-body">
                  <div className="info-list">
                    <div className="info-row">
                      <span>Store URL</span>
                      <span className="info-val-small">
                        {window.location.origin}
                      </span>
                    </div>
                    <div className="info-row">
                      <span>Tool Store</span>
                      <span className="info-val-small">
                        /tools/automation
                      </span>
                    </div>
                    <div className="info-row">
                      <span>Total Tools</span>
                      <span>{tools.length}</span>
                    </div>
                    <div className="info-row">
                      <span>Subscribers</span>
                      <span>{subscribers.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h2>
                    <i className="fas fa-envelope"></i> Email Config
                  </h2>
                </div>
                <div className="card-body">
                  <div className="info-list">
                    <div className="info-row">
                      <span>Service</span>
                      <span>Gmail (SMTP)</span>
                    </div>
                    <div className="info-row">
                      <span>GMAIL_USER</span>
                      <span className="info-val-small">Set in .env</span>
                    </div>
                    <div className="info-row">
                      <span>GMAIL_PASS</span>
                      <span className="info-val-small">
                        App Password required
                      </span>
                    </div>
                    <div className="info-row">
                      <span>IMAP Inbox</span>
                      <span>
                        {inboxConfigured ? (
                          <span className="status-live">● Active</span>
                        ) : (
                          "Not configured"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}