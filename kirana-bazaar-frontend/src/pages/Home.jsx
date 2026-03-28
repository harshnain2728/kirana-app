import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../config/axios";

const categories = [
  { name: "Fruits",      emoji: "🍎", color: "#fff5f5", accent: "#ff6b6b" },
  { name: "Vegetables",  emoji: "🥦", color: "#f0fdf4", accent: "#22c55e" },
  { name: "Dairy",       emoji: "🥛", color: "#eff6ff", accent: "#3b82f6" },
  { name: "Snacks",      emoji: "🍿", color: "#fffbeb", accent: "#f59e0b" },
  { name: "Beverages",   emoji: "🧃", color: "#fdf4ff", accent: "#a855f7" },
  { name: "Bakery",      emoji: "🍞", color: "#fff7ed", accent: "#f97316" },
  { name: "Staples",     emoji: "🌾", color: "#f7fee7", accent: "#84cc16" },
  { name: "Personal Care", emoji: "🧴", color: "#fef2f2", accent: "#ef4444" },
];

const offers = [
  {
    id: 1,
    title: "⚡ 10-Min Delivery",
    subtitle: "Fresh groceries at your doorstep",
    tag: "Always on time",
    bg: "linear-gradient(135deg, #1a9e3f 0%, #0d7a30 100%)",
    emoji: "🛵",
  },
  {
    id: 2,
    title: "🆓 Free Delivery",
    subtitle: "On orders above ₹199",
    tag: "Save ₹30",
    bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    emoji: "🎁",
  },
  {
    id: 3,
    title: "🥬 Farm Fresh",
    subtitle: "Vegetables picked daily",
    tag: "100% fresh",
    bg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    emoji: "🌱",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();
  const [search, setSearch] = useState("");
  const [activeBanner, setActiveBanner] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % offers.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Fetch trending products from backend
  useEffect(() => {
    api.get("/products?page=0&size=8")
      .then((res) => {
        // handle both paginated {content:[]} and plain array responses
        const data = res.data?.content || res.data || [];
        setTrendingProducts(data.slice(0, 8));
      })
      .catch(() => setTrendingProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const getQty = (id) => cart[id]?.quantity || 0;

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

        .kb-home {
          font-family: 'DM Sans', sans-serif;
          background: var(--kb-gray);
          min-height: 100vh;
          padding-bottom: 48px;
        }

        /* ── Hero search ── */
        .kb-hero {
          background: linear-gradient(160deg, #0d7a30 0%, #1a9e3f 60%, #22c55e 100%);
          padding: 32px 20px 48px;
          position: relative;
          overflow: hidden;
        }
        .kb-hero::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 28px;
          background: var(--kb-gray);
          border-radius: 28px 28px 0 0;
        }
        .kb-hero-bg-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          pointer-events: none;
        }

        .kb-hero-greeting {
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          margin-bottom: 4px;
          letter-spacing: 0.3px;
        }
        .kb-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .kb-hero-title span { color: #f5c842; }

        .kb-search-bar {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 14px;
          padding: 4px 4px 4px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          max-width: 600px;
        }
        .kb-search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--kb-text);
          background: transparent;
          padding: 8px 0;
        }
        .kb-search-bar input::placeholder { color: #9ca3af; }
        .kb-search-submit {
          background: var(--kb-green);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 9px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s;
          white-space: nowrap;
        }
        .kb-search-submit:hover { background: var(--kb-green-dark); }

        /* ── Section wrapper ── */
        .kb-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .kb-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: var(--kb-text);
          margin: 28px 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .kb-section-title a {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--kb-green);
          text-decoration: none;
          cursor: pointer;
        }
        .kb-section-title a:hover { text-decoration: underline; }

        /* ── Banner carousel ── */
        .kb-banner-wrap {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 16px;
          margin-top: -8px;
        }
        .kb-banner {
          border-radius: 18px;
          padding: 24px 28px;
          min-height: 130px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          position: relative;
          transition: opacity .4s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          cursor: pointer;
        }
        .kb-banner-left {}
        .kb-banner-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          background: rgba(255,255,255,0.2);
          color: #fff;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .kb-banner-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
        }
        .kb-banner-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.82);
          font-weight: 500;
        }
        .kb-banner-emoji {
          font-size: 64px;
          line-height: 1;
          opacity: 0.9;
        }
        .kb-banner-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
        }
        .kb-banner-dot {
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.4);
          transition: width .3s, background .3s;
          cursor: pointer;
          border: none;
          padding: 0;
        }
        .kb-banner-dot.active {
          width: 20px;
          background: #fff;
        }

        /* ── Categories ── */
        .kb-cats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 480px) {
          .kb-cats-grid { grid-template-columns: repeat(4, 1fr); gap: 8px; }
        }
        .kb-cat-card {
          border-radius: 14px;
          padding: 14px 8px 10px;
          text-align: center;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
          border: 1.5px solid transparent;
        }
        .kb-cat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.09);
        }
        .kb-cat-emoji {
          font-size: 32px;
          margin-bottom: 6px;
          display: block;
          transition: transform .2s;
        }
        .kb-cat-card:hover .kb-cat-emoji { transform: scale(1.15); }
        .kb-cat-name {
          font-size: 11px;
          font-weight: 600;
          color: var(--kb-text);
        }

        /* ── Perks strip ── */
        .kb-perks {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 28px;
        }
        @media (max-width: 500px) { .kb-perks { grid-template-columns: 1fr; } }
        .kb-perk {
          background: #fff;
          border-radius: 14px;
          border: 1.5px solid var(--kb-border);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .kb-perk-icon {
          font-size: 28px;
          flex-shrink: 0;
        }
        .kb-perk-text strong {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: var(--kb-text);
          margin-bottom: 2px;
        }
        .kb-perk-text span {
          font-size: 12px;
          color: var(--kb-muted);
        }

        /* ── Product row (trending) ── */
        .kb-products-scroll {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .kb-products-scroll::-webkit-scrollbar { display: none; }

        .kb-mini-card {
          flex-shrink: 0;
          width: 160px;
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid var(--kb-border);
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow .2s, transform .2s;
          cursor: pointer;
        }
        .kb-mini-card:hover {
          box-shadow: 0 6px 20px rgba(0,0,0,0.09);
          transform: translateY(-2px);
        }
        .kb-mini-img {
          width: 90px;
          height: 90px;
          border-radius: 10px;
          object-fit: cover;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin-bottom: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .kb-mini-img img { width: 100%; height: 100%; object-fit: cover; }
        .kb-mini-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--kb-text);
          text-align: center;
          margin-bottom: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
          width: 100%;
        }
        .kb-mini-unit { font-size: 11px; color: var(--kb-muted); margin-bottom: 6px; }
        .kb-mini-price {
          font-size: 15px;
          font-weight: 800;
          color: var(--kb-text);
          margin-bottom: 10px;
        }

        /* Mini add button */
        .kb-mini-add {
          width: 100%;
          padding: 7px;
          background: #fff;
          border: 2px solid var(--kb-green);
          border-radius: 9px;
          color: var(--kb-green);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .15s, color .15s;
        }
        .kb-mini-add:hover { background: var(--kb-green); color: #fff; }

        /* Mini stepper */
        .kb-mini-stepper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--kb-green);
          border-radius: 9px;
          overflow: hidden;
        }
        .kb-mini-step-btn {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          padding: 5px 12px;
          cursor: pointer;
          transition: background .15s;
          line-height: 1;
          font-family: 'DM Sans', sans-serif;
        }
        .kb-mini-step-btn:hover { background: rgba(0,0,0,0.15); }
        .kb-mini-step-count {
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
        }

        /* Skeleton loader */
        .kb-skeleton {
          flex-shrink: 0;
          width: 160px;
          height: 220px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: kb-shimmer 1.4s infinite;
          border-radius: 16px;
        }
        @keyframes kb-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── App promo strip ── */
        .kb-app-strip {
          background: linear-gradient(135deg, #0d7a30 0%, #1a9e3f 100%);
          border-radius: 18px;
          padding: 20px 24px;
          margin-top: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .kb-app-strip-text strong {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
        }
        .kb-app-strip-text span {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }
        .kb-app-strip-btn {
          background: #fff;
          color: var(--kb-green);
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: transform .15s;
        }
        .kb-app-strip-btn:hover { transform: scale(1.03); }
      `}</style>

      <div className="kb-home">

        {/* ── Hero ── */}
        <div className="kb-hero">
          <div className="kb-hero-bg-circle" style={{ width: 200, height: 200, top: -60, right: -40 }} />
          <div className="kb-hero-bg-circle" style={{ width: 120, height: 120, bottom: 20, right: 120 }} />

          <div className="kb-section" style={{ position: "relative", zIndex: 1 }}>
            <div className="kb-hero-greeting">👋 Good morning!</div>
            <div className="kb-hero-title">
              Groceries in <span>10 mins</span>,<br />delivered fresh
            </div>

            <form className="kb-search-bar" onSubmit={handleSearch}>
              <span style={{ fontSize: 16, marginRight: 8 }}>🔍</span>
              <input
                type="text"
                placeholder='Search "atta", "milk", "dal"...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="kb-search-submit">Search</button>
            </form>
          </div>
        </div>

        {/* ── Banner carousel ── */}
        <div className="kb-banner-wrap">
          <div
            className="kb-banner"
            style={{ background: offers[activeBanner].bg }}
            onClick={() => navigate("/products")}
          >
            <div className="kb-banner-left">
              <div className="kb-banner-tag">{offers[activeBanner].tag}</div>
              <div className="kb-banner-title">{offers[activeBanner].title}</div>
              <div className="kb-banner-sub">{offers[activeBanner].subtitle}</div>
            </div>
            <div className="kb-banner-emoji">{offers[activeBanner].emoji}</div>
            <div className="kb-banner-dots">
              {offers.map((_, i) => (
                <button
                  key={i}
                  className={`kb-banner-dot ${i === activeBanner ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setActiveBanner(i); }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="kb-section">

          {/* ── Categories ── */}
          <div className="kb-section-title">
            Shop by Category
            <span onClick={() => navigate("/products")} className="a" style={{ fontSize: 13, fontWeight: 600, color: "var(--kb-green)", cursor: "pointer" }}>
              See all →
            </span>
          </div>
          <div className="kb-cats-grid">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="kb-cat-card"
                style={{ background: cat.color, border: `1.5px solid ${cat.accent}22` }}
                onClick={() => navigate(`/products?category=${cat.name}`)}
              >
                <span className="kb-cat-emoji">{cat.emoji}</span>
                <div className="kb-cat-name">{cat.name}</div>
              </div>
            ))}
          </div>

          {/* ── Perks ── */}
          <div className="kb-perks">
            {[
              { icon: "⚡", title: "10-Min Delivery", sub: "Fastest in your area" },
              { icon: "🌿", title: "100% Fresh",      sub: "Farm to doorstep daily" },
              { icon: "↩️", title: "Easy Returns",    sub: "No questions asked" },
            ].map((p) => (
              <div className="kb-perk" key={p.title}>
                <span className="kb-perk-icon">{p.icon}</span>
                <div className="kb-perk-text">
                  <strong>{p.title}</strong>
                  <span>{p.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Trending products ── */}
          <div className="kb-section-title">
            🔥 Trending Now
            <span onClick={() => navigate("/products")} style={{ fontSize: 13, fontWeight: 600, color: "var(--kb-green)", cursor: "pointer" }}>
              View all →
            </span>
          </div>

          <div className="kb-products-scroll">
            {loadingProducts
              ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="kb-skeleton" />)
              : trendingProducts.length > 0
                ? trendingProducts.map((product) => {
                    const qty = getQty(product.id);
                    return (
                      <div className="kb-mini-card" key={product.id}>
                        <div className="kb-mini-img" onClick={() => navigate(`/products`)}>
                          {product.imageUrl || product.img
                            ? <img src={product.imageUrl || product.img} alt={product.name} />
                            : "🛍️"
                          }
                        </div>
                        <div className="kb-mini-name">{product.name}</div>
                        <div className="kb-mini-unit">{product.unit || "1 pc"}</div>
                        <div className="kb-mini-price">₹{product.price}</div>
                        {qty === 0 ? (
                          <button className="kb-mini-add" onClick={() => addToCart(product)}>
                            + Add
                          </button>
                        ) : (
                          <div className="kb-mini-stepper">
                            <button className="kb-mini-step-btn" onClick={() => decreaseQty(product.id)}>−</button>
                            <span className="kb-mini-step-count">{qty}</span>
                            <button className="kb-mini-step-btn" onClick={() => increaseQty(product.id)}>+</button>
                          </div>
                        )}
                      </div>
                    );
                  })
                : (
                  // Fallback if no products yet
                  <div style={{ color: "var(--kb-muted)", fontSize: 14, padding: "20px 0" }}>
                    No products yet — add some from the admin panel!
                  </div>
                )
            }
          </div>

          {/* ── App promo ── */}
          <div className="kb-app-strip">
            <div className="kb-app-strip-text">
              <strong>📱 Get the KiranaBazaar app</strong>
              <span>Exclusive app-only deals & faster checkout</span>
            </div>
            <button className="kb-app-strip-btn">Download →</button>
          </div>

        </div>
      </div>
    </>
  );
}