import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage]   = useState("");
  const [isError, setIsError]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      const response = res.data;
      if (response.success) {
        login(response.data, response.data.token);
        setIsError(false);
        navigate("/");
      } else {
        setIsError(true);
        setMessage(response.message || "Invalid credentials");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .kb-login-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #fff;
        }
        @media (max-width: 768px) {
          .kb-login-page { grid-template-columns: 1fr; }
          .kb-login-left  { display: none; }
        }

        /* ── Left panel ── */
        .kb-login-left {
          background: linear-gradient(160deg, #0d7a30 0%, #1a9e3f 55%, #34d058 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }
        .kb-login-left::before {
          content: '';
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          top: -80px; left: -80px;
        }
        .kb-login-left::after {
          content: '';
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          bottom: -40px; right: -40px;
        }
        .kb-login-brand {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 6px;
          position: relative;
          z-index: 1;
        }
        .kb-login-brand-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
          letter-spacing: 0.3px;
        }
        .kb-login-illustration {
          font-size: 96px;
          line-height: 1;
          margin-bottom: 36px;
          position: relative;
          z-index: 1;
          animation: kb-float 3s ease-in-out infinite;
        }
        @keyframes kb-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        .kb-login-perks {
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 280px;
        }
        .kb-login-perk {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px 16px;
          backdrop-filter: blur(4px);
        }
        .kb-login-perk-icon { font-size: 22px; }
        .kb-login-perk-text strong {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
        }
        .kb-login-perk-text span {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
        }

        /* ── Right panel ── */
        .kb-login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: #fafafa;
        }
        .kb-login-form-wrap {
          width: 100%;
          max-width: 400px;
        }

        /* Header */
        .kb-login-form-header {
          margin-bottom: 32px;
        }
        .kb-login-form-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 6px;
        }
        .kb-login-form-header p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        /* Alert */
        .kb-login-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
          animation: kb-alert-in .2s ease;
        }
        @keyframes kb-alert-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kb-login-alert.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        .kb-login-alert.success {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        /* Fields */
        .kb-login-field {
          margin-bottom: 16px;
        }
        .kb-login-field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .kb-login-input-wrap {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 0 14px;
          transition: border-color .2s, box-shadow .2s;
        }
        .kb-login-input-wrap:focus-within {
          border-color: #1a9e3f;
          box-shadow: 0 0 0 3px rgba(26,158,63,0.1);
        }
        .kb-login-input-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-right: 10px;
          opacity: 0.5;
        }
        .kb-login-input-wrap input {
          flex: 1;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          padding: 12px 0;
          background: transparent;
        }
        .kb-login-input-wrap input::placeholder { color: #9ca3af; }
        .kb-show-pass-btn {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          padding: 0;
          opacity: 0.5;
          transition: opacity .15s;
          flex-shrink: 0;
        }
        .kb-show-pass-btn:hover { opacity: 1; }

        /* Forgot */
        .kb-login-forgot {
          text-align: right;
          margin-bottom: 24px;
        }
        .kb-login-forgot span {
          font-size: 13px;
          font-weight: 600;
          color: #1a9e3f;
          cursor: pointer;
        }
        .kb-login-forgot span:hover { text-decoration: underline; }

        /* Submit */
        .kb-login-submit {
          width: 100%;
          padding: 14px;
          background: #1a9e3f;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 16px rgba(26,158,63,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
          letter-spacing: 0.2px;
        }
        .kb-login-submit:hover:not(:disabled) {
          background: #127a30;
          box-shadow: 0 6px 22px rgba(26,158,63,0.38);
        }
        .kb-login-submit:active:not(:disabled) { transform: scale(0.98); }
        .kb-login-submit:disabled { background: #9ca3af; box-shadow: none; cursor: not-allowed; }

        .kb-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: kb-spin .7s linear infinite;
        }
        @keyframes kb-spin { to { transform: rotate(360deg); } }

        /* Divider */
        .kb-login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .kb-login-divider::before,
        .kb-login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }
        .kb-login-divider span {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
          white-space: nowrap;
        }

        /* Social buttons */
        .kb-social-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
        }
        .kb-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .kb-social-btn:hover { border-color: #d1d5db; background: #f9fafb; }

        /* Footer */
        .kb-login-footer {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }
        .kb-login-footer span {
          font-weight: 700;
          color: #1a9e3f;
          cursor: pointer;
        }
        .kb-login-footer span:hover { text-decoration: underline; }
      `}</style>

      <div className="kb-login-page">

        {/* ── Left: Brand panel ── */}
        <div className="kb-login-left">
          <div className="kb-login-brand">KiranaBazaar</div>
          <div className="kb-login-brand-sub">Groceries in 10 minutes</div>
          <div className="kb-login-illustration">🛵</div>
          <div className="kb-login-perks">
            {[
              { icon: "⚡", title: "10-Min Delivery",  sub: "Fastest in your area" },
              { icon: "🌿", title: "100% Fresh",        sub: "Farm to doorstep daily" },
              { icon: "💳", title: "Secure Payments",   sub: "UPI, card & COD" },
            ].map((p) => (
              <div className="kb-login-perk" key={p.title}>
                <span className="kb-login-perk-icon">{p.icon}</span>
                <div className="kb-login-perk-text">
                  <strong>{p.title}</strong>
                  <span>{p.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div className="kb-login-right">
          <div className="kb-login-form-wrap">

            <div className="kb-login-form-header">
              <h2>Welcome back 👋</h2>
              <p>Login to continue shopping on KiranaBazaar</p>
            </div>

            {/* Alert */}
            {message && (
              <div className={`kb-login-alert ${isError ? "error" : "success"}`}>
                <span>{isError ? "⚠" : "✓"}</span>
                {message}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="kb-login-field">
                <label>Email Address</label>
                <div className="kb-login-input-wrap">
                  <span className="kb-login-input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="kb-login-field">
                <label>Password</label>
                <div className="kb-login-input-wrap">
                  <span className="kb-login-input-icon">🔒</span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="kb-show-pass-btn"
                    onClick={() => setShowPass(!showPass)}
                    title={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="kb-login-forgot">
                <span>Forgot password?</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="kb-login-submit"
                disabled={loading}
              >
                {loading
                  ? <><div className="kb-spinner" /> Logging in...</>
                  : "Login to KiranaBazaar →"
                }
              </button>
            </form>

            {/* Divider */}
            <div className="kb-login-divider">
              <span>or continue with</span>
            </div>

            {/* Social (UI only — wire up later) */}
            <div className="kb-social-row">
              <button className="kb-social-btn">
                <span>🌐</span> Google
              </button>
              <button className="kb-social-btn">
                <span>📱</span> OTP
              </button>
            </div>

            {/* Footer */}
            <div className="kb-login-footer">
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")}>Register free</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}