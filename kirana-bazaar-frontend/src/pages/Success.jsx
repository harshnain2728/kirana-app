import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [visible, setVisible] = useState(false);

  // Entry animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown === 0) { navigate("/"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  // Estimated delivery time (now + 10 mins)
  const deliveryTime = new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Random order ID
  const orderId = `KB${Date.now().toString().slice(-6)}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .kb-success-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(160deg, #f0fdf4 0%, #dcfce7 40%, #f7f8fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        .kb-success-card {
          background: #fff;
          border-radius: 24px;
          border: 1.5px solid #e5e7eb;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          max-width: 480px;
          width: 100%;
          padding: 40px 36px;
          text-align: center;
          opacity: 0;
          transform: translateY(24px) scale(0.97);
          transition: opacity .5s ease, transform .5s ease;
        }
        .kb-success-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ── Checkmark animation ── */
        .kb-success-icon-wrap {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a9e3f, #34d058);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 28px rgba(26,158,63,0.3);
          animation: kb-icon-pop .5s cubic-bezier(.36,.07,.19,.97) .2s both;
        }
        @keyframes kb-icon-pop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .kb-success-check {
          font-size: 42px;
          line-height: 1;
          animation: kb-check-in .4s ease .6s both;
        }
        @keyframes kb-check-in {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* Title */
        .kb-success-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 8px;
        }
        .kb-success-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 28px;
          line-height: 1.5;
        }

        /* ── Delivery ETA card ── */
        .kb-eta-card {
          background: linear-gradient(135deg, #1a9e3f, #0d7a30);
          border-radius: 16px;
          padding: 18px 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .kb-eta-left { text-align: left; }
        .kb-eta-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .kb-eta-time {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .kb-eta-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.72);
          margin-top: 3px;
        }
        .kb-eta-icon {
          font-size: 48px;
          animation: kb-ride 1.2s ease-in-out infinite alternate;
        }
        @keyframes kb-ride {
          from { transform: translateX(-4px); }
          to   { transform: translateX(4px); }
        }

        /* ── Order info rows ── */
        .kb-info-rows {
          background: #f7f8fa;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: left;
        }
        .kb-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding: 6px 0;
          border-bottom: 1px solid #eee;
        }
        .kb-info-row:last-child { border-bottom: none; }
        .kb-info-row-label { color: #6b7280; font-weight: 500; }
        .kb-info-row-value { font-weight: 700; color: #1a1a1a; }
        .kb-info-row-value.green { color: #1a9e3f; }

        /* ── Progress tracker ── */
        .kb-tracker {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 0;
          margin-bottom: 28px;
          padding: 0 8px;
        }
        .kb-tracker-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }
        .kb-tracker-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 14px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #e5e7eb;
          z-index: 0;
        }
        .kb-tracker-step.done:not(:last-child)::after { background: #1a9e3f; }
        .kb-tracker-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          position: relative;
          z-index: 1;
          margin-bottom: 6px;
          transition: background .3s;
        }
        .kb-tracker-step.done  .kb-tracker-dot { background: #1a9e3f; color: #fff; }
        .kb-tracker-step.active .kb-tracker-dot {
          background: #fff;
          border: 2px solid #1a9e3f;
          animation: kb-pulse 1.2s ease-in-out infinite;
        }
        @keyframes kb-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(26,158,63,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(26,158,63,0); }
        }
        .kb-tracker-label {
          font-size: 10px;
          font-weight: 600;
          color: #9ca3af;
          text-align: center;
          line-height: 1.3;
        }
        .kb-tracker-step.done   .kb-tracker-label { color: #1a9e3f; }
        .kb-tracker-step.active .kb-tracker-label { color: #1a1a1a; }

        /* ── Action buttons ── */
        .kb-success-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .kb-btn-primary {
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
          box-shadow: 0 4px 14px rgba(26,158,63,0.28);
        }
        .kb-btn-primary:hover { background: #127a30; box-shadow: 0 6px 20px rgba(26,158,63,0.36); }
        .kb-btn-primary:active { transform: scale(0.98); }

        .kb-btn-secondary {
          width: 100%;
          padding: 13px;
          background: #fff;
          color: #1a1a1a;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .kb-btn-secondary:hover { border-color: #1a9e3f; background: #f0fdf4; }

        /* Countdown */
        .kb-countdown {
          margin-top: 16px;
          font-size: 12px;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .kb-countdown-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #f3f4f6;
          font-weight: 700;
          font-size: 11px;
          color: #374151;
        }
      `}</style>

      <div className="kb-success-page">
        <div className={`kb-success-card ${visible ? "visible" : ""}`}>

          {/* Checkmark */}
          <div className="kb-success-icon-wrap">
            <span className="kb-success-check">✓</span>
          </div>

          <h2 className="kb-success-title">Order Placed! 🎉</h2>
          <p className="kb-success-subtitle">
            Your order has been confirmed and is being prepared.
            We'll deliver it fresh to your door!
          </p>

          {/* ETA */}
          <div className="kb-eta-card">
            <div className="kb-eta-left">
              <div className="kb-eta-label">Estimated delivery</div>
              <div className="kb-eta-time">{deliveryTime}</div>
              <div className="kb-eta-sub">⚡ In about 10 minutes</div>
            </div>
            <div className="kb-eta-icon">🛵</div>
          </div>

          {/* Order info */}
          <div className="kb-info-rows">
            <div className="kb-info-row">
              <span className="kb-info-row-label">Order ID</span>
              <span className="kb-info-row-value">#{orderId}</span>
            </div>
            <div className="kb-info-row">
              <span className="kb-info-row-label">Status</span>
              <span className="kb-info-row-value green">✓ Confirmed</span>
            </div>
            <div className="kb-info-row">
              <span className="kb-info-row-label">Payment</span>
              <span className="kb-info-row-value">Cash on Delivery</span>
            </div>
          </div>

          {/* Order tracker */}
          <div className="kb-tracker">
            {[
              { label: "Order\nPlaced",   icon: "✓",  state: "done"   },
              { label: "Being\nPrepared", icon: "👨‍🍳", state: "active" },
              { label: "Out for\nDelivery", icon: "🛵", state: ""      },
              { label: "Delivered",       icon: "🏠", state: ""        },
            ].map((step) => (
              <div key={step.label} className={`kb-tracker-step ${step.state}`}>
                <div className="kb-tracker-dot">{step.icon}</div>
                <div className="kb-tracker-label">{step.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="kb-success-actions">
            <button className="kb-btn-primary" onClick={() => navigate("/orders")}>
              Track My Order
            </button>
            <button className="kb-btn-secondary" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
          </div>

          {/* Countdown */}
          <div className="kb-countdown">
            Redirecting to home in <span className="kb-countdown-num">{countdown}</span>
          </div>

        </div>
      </div>
    </>
  );
}