import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [message, setMessage]           = useState("");
  const [isError, setIsError]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(""); // clear alert on type
  };

  // Password strength
  const getStrength = (p) => {
    if (!p) return { score: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 6)                    score++;
    if (p.length >= 10)                   score++;
    if (/[A-Z]/.test(p))                  score++;
    if (/[0-9]/.test(p))                  score++;
    if (/[^A-Za-z0-9]/.test(p))           score++;
    if (score <= 1) return { score, label: "Weak",   color: "#ef4444" };
    if (score <= 3) return { score, label: "Medium", color: "#f59e0b" };
    return            { score, label: "Strong", color: "#22c55e" };
  };
  const strength = getStrength(form.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.name.trim().length < 2) {
      setIsError(true); setMessage("Enter your full name"); return;
    }
    if (form.password.length < 6) {
      setIsError(true); setMessage("Password must be at least 6 characters"); return;
    }
    if (form.password !== form.confirmPassword) {
      setIsError(true); setMessage("Passwords do not match"); return;
    }

    setLoading(true);
    try {
      const res = await api.post("/users/register", {
        name: form.name, email: form.email, password: form.password,
      });
      const response = res.data;
      if (response.success) {
        setIsError(false);
        setSuccess(true);
        setMessage("Account created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setIsError(true);
        setMessage(response.message || "Registration failed. Try again.");
      }
    } catch {
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

        .kb-reg-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #fff;
        }
        @media (max-width: 768px) {
          .kb-reg-page { grid-template-columns: 1fr; }
          .kb-reg-left { display: none; }
        }

        /* ── Left panel ── */
        .kb-reg-left {
          background: linear-gradient(160deg, #0d5c9e 0%, #1a7ee3 55%, #38bdf8 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }
        .kb-reg-left::before {
          content: '';
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          top: -80px; right: -60px;
        }
        .kb-reg-left::after {
          content: '';
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          bottom: -30px; left: -30px;
        }
        .kb-reg-brand {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
          position: relative; z-index: 1;
        }
        .kb-reg-brand-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          margin-bottom: 44px;
          position: relative; z-index: 1;
        }
        .kb-reg-illustration {
          font-size: 96px;
          line-height: 1;
          margin-bottom: 36px;
          position: relative; z-index: 1;
          animation: kb-float 3.2s ease-in-out infinite;
        }
        @keyframes kb-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        .kb-reg-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative; z-index: 1;
          width: 100%;
          max-width: 280px;
        }
        .kb-reg-step {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px 16px;
        }
        .kb-reg-step-num {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .kb-reg-step-text strong { display: block; font-size: 13px; font-weight: 700; color: #fff; }
        .kb-reg-step-text span   { font-size: 11px; color: rgba(255,255,255,0.7); }

        /* ── Right panel ── */
        .kb-reg-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: #fafafa;
          overflow-y: auto;
        }
        .kb-reg-form-wrap {
          width: 100%;
          max-width: 400px;
        }

        /* Header */
        .kb-reg-header { margin-bottom: 28px; }
        .kb-reg-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 6px;
        }
        .kb-reg-header p { font-size: 14px; color: #6b7280; margin: 0; }

        /* Alert */
        .kb-reg-alert {
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
        .kb-reg-alert.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .kb-reg-alert.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

        /* Fields */
        .kb-reg-field { margin-bottom: 14px; }
        .kb-reg-field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .kb-reg-input-wrap {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 0 14px;
          transition: border-color .2s, box-shadow .2s;
        }
        .kb-reg-input-wrap:focus-within {
          border-color: #1a7ee3;
          box-shadow: 0 0 0 3px rgba(26,126,227,0.1);
        }
        .kb-reg-input-wrap.match:focus-within {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
        }
        .kb-reg-input-wrap.mismatch {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
        }
        .kb-reg-input-icon { font-size: 15px; opacity: 0.45; margin-right: 10px; flex-shrink: 0; }
        .kb-reg-input-wrap input {
          flex: 1;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a1a;
          padding: 12px 0;
          background: transparent;
        }
        .kb-reg-input-wrap input::placeholder { color: #9ca3af; }
        .kb-show-btn {
          background: none; border: none; font-size: 15px;
          cursor: pointer; opacity: 0.45; transition: opacity .15s;
          padding: 0; flex-shrink: 0;
        }
        .kb-show-btn:hover { opacity: 1; }

        /* Password strength */
        .kb-strength-wrap { margin-top: 7px; }
        .kb-strength-bar-track {
          height: 4px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .kb-strength-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width .35s ease, background .35s;
        }
        .kb-strength-label {
          font-size: 11px;
          font-weight: 600;
        }

        /* Password match indicator */
        .kb-match-hint {
          font-size: 11px;
          font-weight: 600;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Terms */
        .kb-terms {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 18px;
          line-height: 1.5;
        }
        .kb-terms span { color: #1a7ee3; cursor: pointer; font-weight: 600; }
        .kb-terms span:hover { text-decoration: underline; }

        /* Submit */
        .kb-reg-submit {
          width: 100%;
          padding: 14px;
          background: #1a7ee3;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 16px rgba(26,126,227,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          letter-spacing: 0.2px;
        }
        .kb-reg-submit:hover:not(:disabled)  { background: #1565c0; box-shadow: 0 6px 22px rgba(26,126,227,0.38); }
        .kb-reg-submit:active:not(:disabled) { transform: scale(0.98); }
        .kb-reg-submit:disabled              { background: #9ca3af; box-shadow: none; cursor: not-allowed; }
        .kb-reg-submit.done                  { background: #22c55e; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }

        .kb-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: kb-spin .7s linear infinite;
        }
        @keyframes kb-spin { to { transform: rotate(360deg); } }

        /* Footer */
        .kb-reg-footer { text-align: center; font-size: 14px; color: #6b7280; }
        .kb-reg-footer span { font-weight: 700; color: #1a7ee3; cursor: pointer; }
        .kb-reg-footer span:hover { text-decoration: underline; }

        /* Divider */
        .kb-reg-divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
        }
        .kb-reg-divider::before,
        .kb-reg-divider::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }
        .kb-reg-divider span { font-size: 12px; color: #9ca3af; font-weight: 500; white-space: nowrap; }

        /* Social */
        .kb-reg-social {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;
        }
        .kb-reg-social-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px; border: 1.5px solid #e5e7eb; border-radius: 10px;
          background: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; color: #374151; cursor: pointer; transition: border-color .2s, background .2s;
        }
        .kb-reg-social-btn:hover { border-color: #d1d5db; background: #f9fafb; }
      `}</style>

      <div className="kb-reg-page">

        {/* ── Left: Brand panel ── */}
        <div className="kb-reg-left">
          <div className="kb-reg-brand">KiranaBazaar</div>
          <div className="kb-reg-brand-sub">Groceries in 10 minutes</div>
          <div className="kb-reg-illustration">🛍️</div>
          <div className="kb-reg-steps">
            {[
              { n: "1", title: "Create account",   sub: "Takes less than a minute" },
              { n: "2", title: "Browse products",  sub: "1000+ items available" },
              { n: "3", title: "Get it delivered", sub: "In just 10 minutes" },
            ].map((s) => (
              <div className="kb-reg-step" key={s.n}>
                <div className="kb-reg-step-num">{s.n}</div>
                <div className="kb-reg-step-text">
                  <strong>{s.title}</strong>
                  <span>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div className="kb-reg-right">
          <div className="kb-reg-form-wrap">

            <div className="kb-reg-header">
              <h2>Create account 🎉</h2>
              <p>Join KiranaBazaar and get groceries in 10 minutes</p>
            </div>

            {/* Alert */}
            {message && (
              <div className={`kb-reg-alert ${isError ? "error" : "success"}`}>
                <span>{isError ? "⚠" : "✓"}</span> {message}
              </div>
            )}

            <form onSubmit={handleRegister}>

              {/* Name */}
              <div className="kb-reg-field">
                <label>Full Name</label>
                <div className="kb-reg-input-wrap">
                  <span className="kb-reg-input-icon">👤</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="kb-reg-field">
                <label>Email Address</label>
                <div className="kb-reg-input-wrap">
                  <span className="kb-reg-input-icon">✉️</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="kb-reg-field">
                <label>Password</label>
                <div className="kb-reg-input-wrap">
                  <span className="kb-reg-input-icon">🔒</span>
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" className="kb-show-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* Strength meter */}
                {form.password && (
                  <div className="kb-strength-wrap">
                    <div className="kb-strength-bar-track">
                      <div
                        className="kb-strength-bar-fill"
                        style={{
                          width: `${(strength.score / 5) * 100}%`,
                          background: strength.color,
                        }}
                      />
                    </div>
                    <div className="kb-strength-label" style={{ color: strength.color }}>
                      {strength.label} password
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="kb-reg-field">
                <label>Confirm Password</label>
                <div className={`kb-reg-input-wrap
                  ${form.confirmPassword && form.password === form.confirmPassword ? "match" : ""}
                  ${form.confirmPassword && form.password !== form.confirmPassword ? "mismatch" : ""}
                `}>
                  <span className="kb-reg-input-icon">🔒</span>
                  <input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" className="kb-show-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* Match hint */}
                {form.confirmPassword && (
                  <div className="kb-match-hint" style={{
                    color: form.password === form.confirmPassword ? "#22c55e" : "#ef4444"
                  }}>
                    {form.password === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="kb-terms">
                By registering, you agree to our{" "}
                <span>Terms of Service</span> and <span>Privacy Policy</span>.
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`kb-reg-submit ${success ? "done" : ""}`}
                disabled={loading || success}
              >
                {loading
                  ? <><div className="kb-spinner" /> Creating account...</>
                  : success
                  ? "✓ Account Created!"
                  : "Create My Account →"
                }
              </button>

            </form>

            {/* Divider */}
            <div className="kb-reg-divider"><span>or sign up with</span></div>

            {/* Social */}
            <div className="kb-reg-social">
              <button className="kb-reg-social-btn"><span>🌐</span> Google</button>
              <button className="kb-reg-social-btn"><span>📱</span> OTP</button>
            </div>

            {/* Footer */}
            <div className="kb-reg-footer">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}