import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "My Account";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Inject styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --kb-green: #1a9e3f;
          --kb-green-dark: #127a30;
          --kb-green-light: #e6f7ec;
          --kb-yellow: #f5c842;
          --kb-gray: #f4f4f4;
          --kb-text: #1a1a1a;
          --kb-muted: #6b7280;
        }

        .kb-header {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
          background: #fff;
          box-shadow: 0 1px 0 #e5e7eb, 0 4px 16px rgba(0,0,0,0.06);
        }

        /* ── Top bar ── */
        .kb-topbar {
          background: var(--kb-green);
          padding: 5px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(255,255,255,0.88);
          letter-spacing: 0.3px;
        }
        .kb-topbar a {
          color: rgba(255,255,255,0.72);
          text-decoration: none;
          margin-left: 16px;
          transition: color .2s;
        }
        .kb-topbar a:hover { color: #fff; }

        /* ── Main row ── */
        .kb-main {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 24px;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        /* Logo */
        .kb-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: var(--kb-green);
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: -0.5px;
          line-height: 1;
          display: flex;
          flex-direction: column;
        }
        .kb-logo span {
          font-size: 9px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          color: var(--kb-muted);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 1px;
        }

        /* Location pill */
        .kb-location {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: border-color .2s, background .2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .kb-location:hover { border-color: var(--kb-green); background: var(--kb-green-light); }
        .kb-location-pin { font-size: 16px; }
        .kb-location-text { font-size: 12px; line-height: 1.2; }
        .kb-location-text strong { display: block; font-weight: 600; font-size: 13px; color: var(--kb-text); }
        .kb-location-text em { font-style: normal; color: var(--kb-muted); font-size: 11px; }
        .kb-location-chevron { color: var(--kb-muted); font-size: 12px; margin-left: 2px; }

        /* Search */
        .kb-search {
          flex: 1;
          position: relative;
          min-width: 0;
        }
        .kb-search form { display: flex; }
        .kb-search-input {
          width: 100%;
          padding: 10px 16px 10px 42px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--kb-text);
          outline: none;
          background: var(--kb-gray);
          transition: border-color .2s, background .2s, box-shadow .2s;
          box-sizing: border-box;
        }
        .kb-search-input::placeholder { color: #9ca3af; }
        .kb-search-input:focus {
          border-color: var(--kb-green);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(26,158,63,0.12);
        }
        .kb-search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          font-size: 16px;
        }
        .kb-search-btn {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--kb-green);
          color: #fff;
          border: none;
          padding: 6px 14px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background .2s;
        }
        .kb-search-btn:hover { background: var(--kb-green-dark); }

        /* Right actions */
        .kb-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* Auth buttons */
        .kb-btn-ghost {
          padding: 8px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--kb-text);
          cursor: pointer;
          transition: border-color .2s, background .2s;
          white-space: nowrap;
        }
        .kb-btn-ghost:hover { border-color: var(--kb-green); background: var(--kb-green-light); color: var(--kb-green); }

        .kb-btn-solid {
          padding: 8px 16px;
          border: none;
          border-radius: 10px;
          background: var(--kb-green);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background .2s, transform .1s;
          white-space: nowrap;
        }
        .kb-btn-solid:hover { background: var(--kb-green-dark); }
        .kb-btn-solid:active { transform: scale(0.97); }

        /* Account dropdown */
        .kb-account {
          position: relative;
        }
        .kb-account-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--kb-text);
          transition: border-color .2s, background .2s;
        }
        .kb-account-btn:hover { border-color: var(--kb-green); background: var(--kb-green-light); }
        .kb-account-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--kb-green);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kb-account-name {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .kb-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          min-width: 200px;
          padding: 6px;
          animation: kb-dropdown-in .15s ease;
          z-index: 200;
        }
        @keyframes kb-dropdown-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .kb-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: var(--kb-text);
          transition: background .15s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .kb-dropdown-item:hover { background: var(--kb-gray); }
        .kb-dropdown-item.danger { color: #ef4444; }
        .kb-dropdown-item.danger:hover { background: #fef2f2; }
        .kb-dropdown-divider { height: 1px; background: #f0f0f0; margin: 4px 6px; }

        /* Cart button */
        .kb-cart-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 18px;
          background: var(--kb-green);
          color: #fff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 2px 8px rgba(26,158,63,0.25);
          position: relative;
        }
        .kb-cart-btn:hover { background: var(--kb-green-dark); box-shadow: 0 4px 14px rgba(26,158,63,0.35); }
        .kb-cart-btn:active { transform: scale(0.97); }
        .kb-cart-icon { font-size: 18px; line-height: 1; }
        .kb-cart-info { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.1; }
        .kb-cart-label { font-size: 10px; font-weight: 400; opacity: 0.85; letter-spacing: 0.3px; }
        .kb-cart-count { font-size: 15px; font-weight: 700; }
        .kb-cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--kb-yellow);
          color: #1a1a1a;
          font-size: 10px;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #fff;
          animation: kb-badge-pop .25s cubic-bezier(.36,.07,.19,.97);
        }
        @keyframes kb-badge-pop {
          0%   { transform: scale(0.4); }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        /* Delivery banner */
        .kb-delivery-banner {
          background: var(--kb-green-light);
          border-top: 1px solid rgba(26,158,63,0.15);
          padding: 7px 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .kb-delivery-banner::-webkit-scrollbar { display: none; }
        .kb-delivery-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: var(--kb-green-dark);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .kb-delivery-chip span { font-size: 14px; }

        /* Responsive */
        @media (max-width: 768px) {
          .kb-main { padding: 10px 14px; gap: 10px; }
          .kb-location { display: none; }
          .kb-topbar { display: none; }
          .kb-delivery-banner { display: none; }
          .kb-account-name { display: none; }
          .kb-cart-info { display: none; }
          .kb-cart-btn { padding: 10px 14px; }
          .kb-logo span { display: none; }
        }
      `}</style>

      <header className="kb-header">

        {/* Top bar */}
        <div className="kb-topbar">
          <span>🚀 Delivery in <strong style={{color:"#fff"}}>10 minutes</strong></span>
          <div>
            <a href="#">Help</a>
            <a href="#">Track Order</a>
          </div>
        </div>

        {/* Main row */}
        <div className="kb-main">

          {/* Logo */}
          <div className="kb-logo" onClick={() => navigate("/")}>
            KiranaBazaar
            <span>Grocery in minutes</span>
          </div>

          {/* Delivery location */}
          <div className="kb-location" onClick={() => navigate("/profile")}>
            <span className="kb-location-pin">📍</span>
            <div className="kb-location-text">
              <strong>Home</strong>
              <em>Delhi, India</em>
            </div>
            <span className="kb-location-chevron">▾</span>
          </div>

          {/* Search */}
          <div className="kb-search">
            <form onSubmit={handleSearch}>
              <span className="kb-search-icon">🔍</span>
              <input
                className="kb-search-input"
                type="text"
                placeholder='Search "atta", "dal", "milk"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="kb-search-btn">Search</button>
            </form>
          </div>

          {/* Actions */}
          <div className="kb-actions">

            {!token ? (
              <>
                <button className="kb-btn-ghost" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="kb-btn-solid" onClick={() => navigate("/register")}>
                  Register
                </button>
              </>
            ) : (
              <div className="kb-account" ref={dropdownRef}>
                <button
                  className="kb-account-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="kb-account-avatar">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="kb-account-name">{userName.split(" ")[0]}</span>
                  <span>▾</span>
                </button>

                {dropdownOpen && (
                  <div className="kb-dropdown">
                    <button
                      className="kb-dropdown-item"
                      onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                    >
                      👤 My Profile
                    </button>
                    <button
                      className="kb-dropdown-item"
                      onClick={() => { navigate("/orders"); setDropdownOpen(false); }}
                    >
                      📦 My Orders
                    </button>
                    <button
                      className="kb-dropdown-item"
                      onClick={() => { navigate("/cart"); setDropdownOpen(false); }}
                    >
                      🛒 My Cart
                    </button>
                    <div className="kb-dropdown-divider" />
                    <button className="kb-dropdown-item danger" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            <button className="kb-cart-btn" onClick={() => navigate("/cart")}>
              <span className="kb-cart-icon">🛒</span>
              <div className="kb-cart-info">
                <span className="kb-cart-label">My Cart</span>
                <span className="kb-cart-count">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </span>
              </div>
              {cartCount > 0 && (
                <span className="kb-cart-badge" key={cartCount}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Delivery perks banner */}
        <div className="kb-delivery-banner">
          <div className="kb-delivery-chip"><span>⚡</span> 10-min delivery</div>
          <div className="kb-delivery-chip"><span>🆓</span> Free delivery on ₹199+</div>
          <div className="kb-delivery-chip"><span>↩️</span> Easy returns</div>
          <div className="kb-delivery-chip"><span>✅</span> 100% fresh products</div>
          <div className="kb-delivery-chip"><span>💳</span> UPI & card accepted</div>
        </div>

      </header>
    </>
  );
}
