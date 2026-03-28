import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .kb-footer {
          font-family: 'DM Sans', sans-serif;
          background: #111827;
          color: #9ca3af;
          padding: 48px 24px 24px;
          margin-top: auto;
        }
        .kb-footer-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .kb-footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        @media (max-width: 768px) {
          .kb-footer-top { grid-template-columns: 1fr 1fr; gap: 28px; }
        }
        @media (max-width: 480px) {
          .kb-footer-top { grid-template-columns: 1fr; }
        }

        /* Brand col */
        .kb-footer-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
          cursor: pointer;
        }
        .kb-footer-brand-tag {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 14px;
        }
        .kb-footer-brand-desc {
          font-size: 13px;
          line-height: 1.7;
          color: #6b7280;
          margin-bottom: 18px;
          max-width: 240px;
        }
        .kb-footer-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .kb-footer-badge {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          color: #d1d5db;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Link cols */
        .kb-footer-col h4 {
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 16px;
        }
        .kb-footer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .kb-footer-link {
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
          transition: color .15s;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .kb-footer-link:hover { color: #22c55e; }

        /* Divider */
        .kb-footer-divider {
          height: 1px;
          background: #1f2937;
          margin-bottom: 20px;
        }

        /* Bottom */
        .kb-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .kb-footer-copy {
          font-size: 12px;
          color: #4b5563;
        }
        .kb-footer-copy span { color: #22c55e; }
        .kb-footer-socials {
          display: flex;
          gap: 8px;
        }
        .kb-footer-social-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: #1f2937;
          border: 1px solid #374151;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          cursor: pointer;
          transition: background .15s, border-color .15s;
        }
        .kb-footer-social-btn:hover { background: #374151; border-color: #4b5563; }

        /* Delivery strip */
        .kb-footer-strip {
          background: #1f2937;
          border-radius: 12px;
          padding: 14px 20px;
          margin-bottom: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .kb-footer-strip-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #d1d5db;
        }
        .kb-footer-strip-item span { font-size: 18px; }
      `}</style>

      <footer className="kb-footer">
        <div className="kb-footer-inner">

          {/* Perks strip */}
          <div className="kb-footer-strip">
            {[
              { icon: "⚡", text: "10-Min Delivery" },
              { icon: "🌿", text: "100% Fresh" },
              { icon: "↩️", text: "Easy Returns" },
              { icon: "🔒", text: "Secure Payments" },
              { icon: "🎧", text: "24/7 Support" },
            ].map((p) => (
              <div className="kb-footer-strip-item" key={p.text}>
                <span>{p.icon}</span> {p.text}
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="kb-footer-top">

            {/* Brand */}
            <div>
              <div className="kb-footer-brand-name" onClick={() => navigate("/")}>
                KiranaBazaar
              </div>
              <div className="kb-footer-brand-tag">Groceries in 10 minutes</div>
              <div className="kb-footer-brand-desc">
                Your neighbourhood kirana store, now delivering fresh groceries
                to your doorstep in under 10 minutes.
              </div>
              <div className="kb-footer-badges">
                <div className="kb-footer-badge"><span>📱</span> App coming soon</div>
                <div className="kb-footer-badge"><span>🛡️</span> Trusted store</div>
              </div>
            </div>

            {/* Shop */}
            <div className="kb-footer-col">
              <h4>Shop</h4>
              <div className="kb-footer-links">
                {["Fruits & Vegetables", "Dairy & Eggs", "Snacks", "Beverages", "Staples", "Personal Care"].map((l) => (
                  <button key={l} className="kb-footer-link"
                    onClick={() => navigate(`/products?category=${l}`)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Account */}
            <div className="kb-footer-col">
              <h4>Account</h4>
              <div className="kb-footer-links">
                {[
                  { label: "My Profile",    path: "/profile"  },
                  { label: "My Orders",     path: "/orders"   },
                  { label: "My Cart",       path: "/cart"     },
                  { label: "Login",         path: "/login"    },
                  { label: "Register",      path: "/register" },
                ].map((l) => (
                  <button key={l.label} className="kb-footer-link"
                    onClick={() => navigate(l.path)}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="kb-footer-col">
              <h4>Help</h4>
              <div className="kb-footer-links">
                {["Track Order", "Return Policy", "FAQ", "Contact Us", "Privacy Policy", "Terms of Service"].map((l) => (
                  <button key={l} className="kb-footer-link">{l}</button>
                ))}
              </div>
            </div>

          </div>

          <div className="kb-footer-divider" />

          {/* Bottom */}
          <div className="kb-footer-bottom">
            <div className="kb-footer-copy">
              © {new Date().getFullYear()} <span>KiranaBazaar</span>. All rights reserved. Made with ❤️ in India
            </div>
            <div className="kb-footer-socials">
              {["📘", "📸", "🐦", "▶️"].map((icon, i) => (
                <div key={i} className="kb-footer-social-btn">{icon}</div>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}