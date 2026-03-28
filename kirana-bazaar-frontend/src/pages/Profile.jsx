import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState("");
  const [isError, setIsError]     = useState(false);
  const [form, setForm]           = useState({ name: "", email: "", phone: "" });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    api.get("/users/profile")
      .then((res) => {
        const data = res.data?.data || res.data;
        setProfile(data);
        setForm({ name: data.name || "", email: data.email || "", phone: data.phone || "" });
      })
      .catch(() => {
        // fallback to localStorage data
        if (user) {
          setProfile(user);
          setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await api.put("/users/profile", form);
      setProfile({ ...profile, ...form });
      localStorage.setItem("userName", form.name);
      setIsError(false);
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch {
      setIsError(true);
      setMessage("Failed to update profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (profile?.name || user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        :root {
          --kb-green: #1a9e3f;
          --kb-green-dark: #127a30;
          --kb-green-light: #e6f7ec;
          --kb-gray: #f7f8fa;
          --kb-border: #e5e7eb;
          --kb-text: #1a1a1a;
          --kb-muted: #6b7280;
        }

        .kb-profile-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--kb-gray);
          padding: 28px 16px 60px;
        }
        .kb-profile-wrap {
          max-width: 800px;
          margin: 0 auto;
        }

        /* ── Page title ── */
        .kb-profile-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--kb-text);
          margin-bottom: 20px;
        }

        /* ── Hero card ── */
        .kb-profile-hero {
          background: linear-gradient(135deg, #0d7a30, #1a9e3f);
          border-radius: 20px;
          padding: 28px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }
        .kb-profile-hero::after {
          content: '';
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          top: -50px; right: -30px;
          pointer-events: none;
        }
        .kb-profile-avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: 3px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          flex-shrink: 0;
          backdrop-filter: blur(4px);
        }
        .kb-profile-hero-info { flex: 1; z-index: 1; }
        .kb-profile-hero-name {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 3px;
        }
        .kb-profile-hero-email {
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          margin-bottom: 10px;
        }
        .kb-profile-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.15);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }
        .kb-profile-edit-btn {
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.3);
          color: #fff;
          border-radius: 10px;
          padding: 8px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s;
          flex-shrink: 0;
          z-index: 1;
        }
        .kb-profile-edit-btn:hover { background: rgba(255,255,255,0.25); }

        /* ── Tabs ── */
        .kb-profile-tabs {
          display: flex;
          gap: 0;
          background: #fff;
          border-radius: 14px;
          border: 1.5px solid var(--kb-border);
          padding: 5px;
          margin-bottom: 20px;
        }
        .kb-profile-tab {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 10px;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--kb-muted);
          cursor: pointer;
          transition: background .2s, color .2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .kb-profile-tab.active {
          background: var(--kb-green-light);
          color: var(--kb-green);
        }

        /* ── Card ── */
        .kb-card {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid var(--kb-border);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .kb-card-head {
          padding: 14px 20px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .kb-card-head-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .kb-card-head-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: var(--kb-green-light);
          color: var(--kb-green);
          font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .kb-card-head h3 {
          font-size: 14px;
          font-weight: 700;
          color: var(--kb-text);
          margin: 0;
        }
        .kb-card-body { padding: 20px; }

        /* Alert */
        .kb-alert {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          margin-bottom: 16px;
          animation: kb-alert-in .2s ease;
        }
        @keyframes kb-alert-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kb-alert.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .kb-alert.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

        /* Form */
        .kb-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .kb-form-grid .full { grid-column: 1 / -1; }
        @media (max-width: 500px) {
          .kb-form-grid { grid-template-columns: 1fr; }
          .kb-form-grid .full { grid-column: 1; }
        }
        .kb-field { display: flex; flex-direction: column; gap: 5px; }
        .kb-field label {
          font-size: 11px;
          font-weight: 700;
          color: var(--kb-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .kb-field input {
          padding: 10px 13px;
          border: 1.5px solid var(--kb-border);
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--kb-text);
          outline: none;
          background: #fff;
          transition: border-color .2s, box-shadow .2s;
        }
        .kb-field input:focus {
          border-color: var(--kb-green);
          box-shadow: 0 0 0 3px rgba(26,158,63,0.1);
        }
        .kb-field input:disabled {
          background: var(--kb-gray);
          color: var(--kb-muted);
          cursor: not-allowed;
        }

        /* Action row */
        .kb-form-actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }
        .kb-btn-save {
          padding: 11px 24px;
          background: var(--kb-green);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s;
          display: flex; align-items: center; gap: 7px;
        }
        .kb-btn-save:hover:not(:disabled) { background: var(--kb-green-dark); }
        .kb-btn-save:disabled { background: #9ca3af; cursor: not-allowed; }
        .kb-btn-cancel {
          padding: 11px 20px;
          border: 1.5px solid var(--kb-border);
          border-radius: 10px;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: var(--kb-muted);
          cursor: pointer;
          transition: border-color .2s;
        }
        .kb-btn-cancel:hover { border-color: #9ca3af; }

        .kb-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: kb-spin .7s linear infinite;
        }
        @keyframes kb-spin { to { transform: rotate(360deg); } }

        /* ── Info rows (read mode) ── */
        .kb-info-rows { display: flex; flex-direction: column; gap: 0; }
        .kb-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 13px 0;
          border-bottom: 1px solid #f3f4f6;
          gap: 12px;
        }
        .kb-info-row:last-child { border-bottom: none; }
        .kb-info-row-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--kb-muted);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          flex-shrink: 0;
        }
        .kb-info-row-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--kb-text);
          text-align: right;
        }

        /* ── Quick links ── */
        .kb-quick-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .kb-quick-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border: 1.5px solid var(--kb-border);
          border-radius: 14px;
          background: #fff;
          cursor: pointer;
          transition: border-color .2s, background .2s, transform .15s;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .kb-quick-link:hover {
          border-color: var(--kb-green);
          background: var(--kb-green-light);
          transform: translateY(-1px);
        }
        .kb-quick-link-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: var(--kb-gray);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          transition: background .2s;
        }
        .kb-quick-link:hover .kb-quick-link-icon { background: rgba(26,158,63,0.15); }
        .kb-quick-link-text strong {
          display: block; font-size: 13px; font-weight: 700; color: var(--kb-text);
        }
        .kb-quick-link-text span {
          font-size: 11px; color: var(--kb-muted);
        }

        /* ── Danger zone ── */
        .kb-danger-zone {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #fecaca;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .kb-danger-zone-text strong { display: block; font-size: 14px; font-weight: 700; color: #dc2626; }
        .kb-danger-zone-text span   { font-size: 12px; color: var(--kb-muted); }
        .kb-logout-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px;
          background: #fef2f2;
          border: 1.5px solid #fecaca;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #dc2626;
          cursor: pointer;
          transition: background .2s;
          flex-shrink: 0;
        }
        .kb-logout-btn:hover { background: #fee2e2; }

        /* Skeleton */
        .kb-skeleton-block {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: kb-shimmer 1.4s infinite;
          border-radius: 12px;
        }
        @keyframes kb-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="kb-profile-page">
        <div className="kb-profile-wrap">
          <div className="kb-profile-title">👤 My Account</div>

          {loading ? (
            <>
              <div className="kb-skeleton-block" style={{ height: 130, marginBottom: 20 }} />
              <div className="kb-skeleton-block" style={{ height: 220 }} />
            </>
          ) : (
            <>
              {/* Hero */}
              <div className="kb-profile-hero">
                <div className="kb-profile-avatar">{initials}</div>
                <div className="kb-profile-hero-info">
                  <div className="kb-profile-hero-name">{profile?.name || "User"}</div>
                  <div className="kb-profile-hero-email">{profile?.email}</div>
                  <div className="kb-profile-hero-badge">
                    ✓ Verified Account
                  </div>
                </div>
                <button
                  className="kb-profile-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Edit
                </button>
              </div>

              {/* Tabs */}
              <div className="kb-profile-tabs">
                {[
                  { id: "profile", label: "Profile",    icon: "👤" },
                  { id: "quick",   label: "Quick Links", icon: "🔗" },
                ].map((t) => (
                  <button
                    key={t.id}
                    className={`kb-profile-tab ${activeTab === t.id ? "active" : ""}`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* ── Profile tab ── */}
              {activeTab === "profile" && (
                <>
                  {message && (
                    <div className={`kb-alert ${isError ? "error" : "success"}`}>
                      {isError ? "⚠" : "✓"} {message}
                    </div>
                  )}

                  <div className="kb-card">
                    <div className="kb-card-head">
                      <div className="kb-card-head-left">
                        <div className="kb-card-head-icon">📋</div>
                        <h3>Personal Information</h3>
                      </div>
                      {!editing && (
                        <button
                          style={{
                            background: "none", border: "none",
                            color: "var(--kb-green)", fontSize: 13,
                            fontWeight: 700, cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif"
                          }}
                          onClick={() => setEditing(true)}
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </div>
                    <div className="kb-card-body">
                      {!editing ? (
                        <div className="kb-info-rows">
                          {[
                            { label: "Full Name", value: profile?.name || "—" },
                            { label: "Email",     value: profile?.email || "—" },
                            { label: "Phone",     value: profile?.phone || "Not added" },
                            { label: "Role",      value: profile?.role  || "Customer" },
                          ].map((row) => (
                            <div className="kb-info-row" key={row.label}>
                              <span className="kb-info-row-label">{row.label}</span>
                              <span className="kb-info-row-value">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className="kb-form-grid">
                            <div className="kb-field full">
                              <label>Full Name</label>
                              <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                            </div>
                            <div className="kb-field">
                              <label>Email</label>
                              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                            </div>
                            <div className="kb-field">
                              <label>Phone</label>
                              <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} />
                            </div>
                          </div>
                          <div className="kb-form-actions">
                            <button className="kb-btn-save" onClick={handleSave} disabled={saving}>
                              {saving ? <><div className="kb-spinner" /> Saving...</> : "💾 Save Changes"}
                            </button>
                            <button className="kb-btn-cancel" onClick={() => { setEditing(false); setMessage(""); }}>
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── Quick links tab ── */}
              {activeTab === "quick" && (
                <div className="kb-card">
                  <div className="kb-card-head">
                    <div className="kb-card-head-left">
                      <div className="kb-card-head-icon">🔗</div>
                      <h3>Quick Access</h3>
                    </div>
                  </div>
                  <div className="kb-card-body">
                    <div className="kb-quick-links">
                      {[
                        { icon: "📦", label: "My Orders",      sub: "View order history",    path: "/orders"   },
                        { icon: "🛒", label: "My Cart",        sub: "Review your cart",      path: "/cart"     },
                        { icon: "🏠", label: "Home",           sub: "Back to shopping",      path: "/"         },
                        { icon: "🛍️", label: "Products",       sub: "Browse all items",      path: "/products" },
                      ].map((l) => (
                        <div className="kb-quick-link" key={l.label} onClick={() => navigate(l.path)}>
                          <div className="kb-quick-link-icon">{l.icon}</div>
                          <div className="kb-quick-link-text">
                            <strong>{l.label}</strong>
                            <span>{l.sub}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Danger zone */}
              <div className="kb-danger-zone">
                <div className="kb-danger-zone-text">
                  <strong>Sign out of KiranaBazaar</strong>
                  <span>You'll need to login again to place orders</span>
                </div>
                <button className="kb-logout-btn" onClick={logout}>
                  🚪 Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}