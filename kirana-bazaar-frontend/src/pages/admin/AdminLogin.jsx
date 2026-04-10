import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      const response = res.data;
      if (response.success) {
        const user = response.data;
        if (user.role !== "ADMIN") {
          setMessage("Access denied. Admin accounts only.");
          setLoading(false);
          return;
        }
        localStorage.setItem("token",    user.token || response.token || "");
        localStorage.setItem("user",     JSON.stringify(user));
        localStorage.setItem("userName", user.name || user.email);
        navigate("/admin");
      } else {
        setMessage(response.message || "Invalid credentials");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .ka-login-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #fff;
        }
        @media (max-width: 768px) {
          .ka-login-page { grid-template-columns: 1fr; }
          .ka-login-left { display: none; }
        }

        .ka-login-left {
          background: linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #334155 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 40px; position: relative; overflow: hidden;
        }
        .ka-login-left::before {
          content: ''; position: absolute;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(99,102,241,0.1);
          top: -80px; left: -60px;
        }
        .ka-login-left::after {
          content: ''; position: absolute;
          width: 200px; height: 200px; border-radius: 50%;
          background: rgba(99,102,241,0.07);
          bottom: -40px; right: -30px;
        }
        .ka-brand {
          font-family: 'Syne', sans-serif;
          font-size: 28px; font-weight: 800; color: #fff;
          margin-bottom: 4px; position: relative; z-index: 1;
        }
        .ka-brand-sub {
          font-size: 12px; color: #94a3b8; font-weight: 500;
          margin-bottom: 44px; letter-spacing: 1px;
          text-transform: uppercase; position: relative; z-index: 1;
        }
        .ka-illustration {
          font-size: 88px; line-height: 1; margin-bottom: 36px;
          position: relative; z-index: 1;
          animation: ka-float 3s ease-in-out infinite;
        }
        @keyframes ka-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .ka-feature-list {
          display: flex; flex-direction: column; gap: 12px;
          position: relative; z-index: 1; width: 100%; max-width: 280px;
        }
        .ka-feature {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 12px 16px;
        }
        .ka-feature-icon { font-size: 20px; }
        .ka-feature-text strong { display: block; font-size: 13px; font-weight: 700; color: #e2e8f0; }
        .ka-feature-text span   { font-size: 11px; color: #64748b; }

        /* Right */
        .ka-login-right {
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px; background: #f8fafc;
        }
        .ka-form-wrap { width: 100%; max-width: 400px; }

        .ka-form-header { margin-bottom: 28px; }
        .ka-form-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 6px;
        }
        .ka-form-header p { font-size: 14px; color: #64748b; margin: 0; }

        .ka-alert {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500; margin-bottom: 20px;
          background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;
          animation: ka-alert-in .2s ease;
        }
        @keyframes ka-alert-in {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ka-field { margin-bottom: 14px; }
        .ka-field label {
          display: block; font-size: 11px; font-weight: 700;
          color: #475569; text-transform: uppercase;
          letter-spacing: 0.5px; margin-bottom: 5px;
        }
        .ka-input-wrap {
          display: flex; align-items: center;
          background: #fff; border: 1.5px solid #e2e8f0;
          border-radius: 12px; padding: 0 14px;
          transition: border-color .2s, box-shadow .2s;
        }
        .ka-input-wrap:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .ka-input-icon { font-size: 15px; opacity: 0.4; margin-right: 10px; flex-shrink: 0; }
        .ka-input-wrap input {
          flex: 1; border: none; outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #0f172a; padding: 12px 0; background: transparent;
        }
        .ka-input-wrap input::placeholder { color: #94a3b8; }
        .ka-show-btn {
          background: none; border: none; font-size: 15px;
          cursor: pointer; opacity: 0.4; transition: opacity .15s; padding: 0;
        }
        .ka-show-btn:hover { opacity: 1; }

        .ka-submit {
          width: 100%; padding: 14px; margin-top: 8px;
          background: #4f46e5; color: #fff; border: none;
          border-radius: 12px; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 800; cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 16px rgba(79,70,229,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 20px;
        }
        .ka-submit:hover:not(:disabled) { background: #4338ca; }
        .ka-submit:active:not(:disabled) { transform: scale(0.98); }
        .ka-submit:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; }

        .ka-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: ka-spin .7s linear infinite;
        }
        @keyframes ka-spin { to { transform: rotate(360deg); } }

        .ka-back-link {
          text-align: center; font-size: 13px; color: #64748b;
        }
        .ka-back-link span {
          color: #4f46e5; font-weight: 700; cursor: pointer;
        }
        .ka-back-link span:hover { text-decoration: underline; }
      `}</style>

      <div className="ka-login-page">
        <div className="ka-login-left">
          <div className="ka-brand">KiranaBazaar</div>
          <div className="ka-brand-sub">Admin Panel</div>
          <div className="ka-illustration">🛡️</div>
          <div className="ka-feature-list">
            {[
              { icon: "📦", title: "Manage Products",  sub: "Add, edit, delete items" },
              { icon: "🧾", title: "Handle Orders",    sub: "Update order statuses" },
              { icon: "📊", title: "View Analytics",   sub: "Revenue & order stats" },
            ].map((f) => (
              <div className="ka-feature" key={f.title}>
                <span className="ka-feature-icon">{f.icon}</span>
                <div className="ka-feature-text">
                  <strong>{f.title}</strong>
                  <span>{f.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ka-login-right">
          <div className="ka-form-wrap">
            <div className="ka-form-header">
              <h2>Admin Login 🛡️</h2>
              <p>Sign in to manage your KiranaBazaar store</p>
            </div>

            {message && (
              <div className="ka-alert">⚠ {message}</div>
            )}

            <form onSubmit={handleLogin}>
              <div className="ka-field">
                <label>Admin Email</label>
                <div className="ka-input-wrap">
                  <span className="ka-input-icon">✉️</span>
                  <input type="email" placeholder="admin@kiranabazaar.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="ka-field">
                <label>Password</label>
                <div className="ka-input-wrap">
                  <span className="ka-input-icon">🔒</span>
                  <input type={showPass ? "text" : "password"} placeholder="Admin password"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className="ka-show-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" className="ka-submit" disabled={loading}>
                {loading ? <><div className="ka-spinner" /> Signing in...</> : "Sign In to Dashboard →"}
              </button>
            </form>

            <div className="ka-back-link">
              Not an admin?{" "}
              <span onClick={() => navigate("/")}>Back to store</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}