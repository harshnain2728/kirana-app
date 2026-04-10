import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../config/axios";
import { useCart } from "../context/CartContext";

const CATEGORIES = ["All", "Fruits", "Vegetables", "Dairy", "Snacks", "Beverages", "Bakery", "Staples", "Personal Care"];
const SORT_OPTIONS = [
  { label: "Relevance",         value: ""           },
  { label: "Price: Low → High", value: "price_asc"  },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Name: A → Z",       value: "name_asc"   },
];

// ── 1. Stock helper functions ──
function getStockStatus(stock) {
  if (stock === undefined || stock === null) return null; // no stock info
  if (stock === 0)  return { type: "oos",     label: "Out of Stock"     };
  if (stock <= 3)   return { type: "critical", label: `Only ${stock} left!` };
  if (stock <= 10)  return { type: "low",      label: `Only ${stock} left`  };
  return { type: "ok", label: null };
}

export default function Products() {
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [sortBy, setSortBy]                 = useState("");
  const [sortOpen, setSortOpen]             = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  // ── 2. Track which product just got added (for animation) ──
  const [addedId, setAddedId]               = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const category = searchParams.get("category") || "";
  const search   = searchParams.get("search")   || "";

  useEffect(() => {
    setActiveCategory(category || "All");
  }, [category]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", { params: { category, search } });
      const raw = res.data?.content || res.data?.data || res.data || [];
      setProducts(Array.isArray(raw) ? raw : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price_asc")  return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "name_asc")   return a.name.localeCompare(b.name);
    return 0;
  });

  const handleCategoryClick = (cat) => {
    const params = {};
    if (cat !== "All") params.category = cat;
    if (search)        params.search   = search;
    setSearchParams(params);
  };

  const getQty = (id) => cart[id]?.quantity || 0;

  // ── 3. Production-ready addToCart with stock check ──
  const handleAddToCart = (p) => {
    const stock = p.stock ?? p.stockQuantity ?? null;
    const currentQty = getQty(p.id);

    // Prevent adding more than available stock
    if (stock !== null && currentQty >= stock) return;

    addToCart(p);

    // Flash "Added" animation
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 600);
  };

  // ── 4. Prevent increase beyond stock ──
  const handleIncrease = (p) => {
    const stock = p.stock ?? p.stockQuantity ?? null;
    const currentQty = getQty(p.id);
    if (stock !== null && currentQty >= stock) return;
    increaseQty(p.id);
  };

  const pageTitle = category
    ? category
    : search
    ? `Results for "${search}"`
    : "All Products";

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

        .kb-products-page {
          font-family: 'DM Sans', sans-serif;
          background: var(--kb-gray);
          min-height: 100vh;
          padding-bottom: 60px;
        }

        .kb-products-subheader {
          background: #fff;
          border-bottom: 1px solid var(--kb-border);
          padding: 14px 20px 0;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .kb-products-subheader-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        .kb-back-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          color: var(--kb-muted); cursor: pointer;
          padding: 6px 0; transition: color .15s;
        }
        .kb-back-btn:hover { color: var(--kb-green); }
        .kb-products-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800; color: var(--kb-text);
        }
        .kb-products-title-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          color: var(--kb-muted); margin-left: 8px;
        }
        .kb-sort-wrap { position: relative; }
        .kb-sort-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border: 1.5px solid var(--kb-border); border-radius: 10px;
          background: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: var(--kb-text);
          cursor: pointer; transition: border-color .2s; white-space: nowrap;
        }
        .kb-sort-btn:hover { border-color: var(--kb-green); }
        .kb-sort-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: #fff; border: 1px solid var(--kb-border);
          border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          min-width: 200px; padding: 6px; z-index: 100;
          animation: kb-fade-in .15s ease;
        }
        @keyframes kb-fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kb-sort-option {
          width: 100%; text-align: left; background: none; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          color: var(--kb-text); padding: 9px 12px; border-radius: 8px;
          cursor: pointer; transition: background .15s;
        }
        .kb-sort-option:hover  { background: var(--kb-gray); }
        .kb-sort-option.active { background: var(--kb-green-light); color: var(--kb-green); font-weight: 700; }

        .kb-cat-strip {
          display: flex; gap: 8px; overflow-x: auto;
          scrollbar-width: none; padding-bottom: 12px;
          max-width: 1200px; margin: 0 auto;
        }
        .kb-cat-strip::-webkit-scrollbar { display: none; }
        .kb-cat-chip {
          flex-shrink: 0; padding: 6px 16px; border-radius: 20px;
          border: 1.5px solid var(--kb-border); background: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          color: var(--kb-muted); cursor: pointer; transition: all .2s; white-space: nowrap;
        }
        .kb-cat-chip:hover { border-color: var(--kb-green); color: var(--kb-green); background: var(--kb-green-light); }
        .kb-cat-chip.active { background: var(--kb-green); color: #fff; border-color: var(--kb-green); }

        .kb-products-content {
          max-width: 1200px; margin: 0 auto; padding: 20px 16px 0;
        }
        .kb-active-filters {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 16px; flex-wrap: wrap;
        }
        .kb-filter-tag {
          display: flex; align-items: center; gap: 6px;
          background: var(--kb-green-light); color: var(--kb-green-dark);
          font-size: 12px; font-weight: 600;
          padding: 4px 10px; border-radius: 20px;
        }
        .kb-filter-tag button {
          background: none; border: none; color: var(--kb-green);
          cursor: pointer; font-size: 14px; line-height: 1; padding: 0;
        }

        .kb-products-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
        }
        @media (min-width: 640px)  { .kb-products-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .kb-products-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1280px) { .kb-products-grid { grid-template-columns: repeat(5, 1fr); } }

        /* ── Product card ── */
        .kb-p-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid var(--kb-border); padding: 12px;
          display: flex; flex-direction: column;
          transition: box-shadow .2s, transform .2s, border-color .2s;
          position: relative; overflow: hidden;
        }
        .kb-p-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.09);
          transform: translateY(-2px); border-color: #d1f0db;
        }
        /* ── 5. Out of stock card dimmed ── */
        .kb-p-card.oos {
          opacity: 0.7;
        }

        .kb-p-badge {
          position: absolute; top: 9px; left: 9px;
          font-size: 10px; font-weight: 700; padding: 2px 8px;
          border-radius: 20px; text-transform: uppercase; letter-spacing: 0.3px;
        }
        .kb-p-badge.fresh  { background: #dcfce7; color: #15803d; }
        .kb-p-badge.offer  { background: #fef9c3; color: #854d0e; }

        .kb-p-img-wrap {
          width: 100%; aspect-ratio: 1; border-radius: 12px;
          background: #f7f8fa; display: flex; align-items: center;
          justify-content: center; overflow: hidden; margin-bottom: 10px;
          font-size: 44px; transition: transform .3s;
        }
        .kb-p-card:hover .kb-p-img-wrap { transform: scale(1.03); }
        .kb-p-img-wrap img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }

        .kb-p-name {
          font-size: 13px; font-weight: 600; color: var(--kb-text);
          line-height: 1.35; margin-bottom: 2px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden; flex: 1;
        }
        .kb-p-unit { font-size: 11px; color: var(--kb-muted); margin-bottom: 4px; }

        /* ── 6. Stock indicator styles ── */
        .kb-p-stock {
          font-size: 11px; font-weight: 700;
          margin-bottom: 6px;
          display: flex; align-items: center; gap: 4px;
        }
        .kb-p-stock.critical { color: #ef4444; }
        .kb-p-stock.low      { color: #f59e0b; }

        .kb-p-price-row {
          display: flex; align-items: center; gap: 5px;
          margin-bottom: 10px; flex-wrap: wrap;
        }
        .kb-p-price { font-size: 15px; font-weight: 800; color: var(--kb-text); }
        .kb-p-mrp   { font-size: 11px; color: var(--kb-muted); text-decoration: line-through; }
        .kb-p-discount {
          font-size: 10px; font-weight: 700;
          background: #dcfce7; color: #15803d;
          padding: 1px 6px; border-radius: 6px;
        }

        /* ── 7. Add button with added animation ── */
        .kb-p-add-btn {
          width: 100%; padding: 8px;
          border: 2px solid var(--kb-green); border-radius: 10px;
          background: #fff; color: var(--kb-green);
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: background .15s, color .15s, transform .1s;
        }
        .kb-p-add-btn:hover  { background: var(--kb-green); color: #fff; }
        .kb-p-add-btn.added  {
          background: var(--kb-green); color: #fff;
          transform: scale(0.97);
        }
        /* ── Max stock reached — disable button ── */
        .kb-p-add-btn:disabled {
          border-color: #e5e7eb; color: #9ca3af;
          cursor: not-allowed; background: #f9fafb;
        }

        /* Stepper */
        .kb-p-stepper {
          width: 100%; display: flex; align-items: center;
          justify-content: space-between;
          background: var(--kb-green); border-radius: 10px; overflow: hidden;
        }
        .kb-p-step-btn {
          background: transparent; border: none; color: #fff;
          font-size: 20px; font-weight: 700; padding: 5px 14px;
          cursor: pointer; line-height: 1;
          font-family: 'DM Sans', sans-serif; transition: background .15s;
        }
        .kb-p-step-btn:hover { background: rgba(0,0,0,0.12); }
        /* ── 8. Max stock reached — dim + button ── */
        .kb-p-step-btn:disabled {
          opacity: 0.4; cursor: not-allowed;
        }
        .kb-p-step-count {
          color: #fff; font-size: 14px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
        }

        /* Out of stock */
        .kb-p-oos {
          width: 100%; padding: 8px; border-radius: 10px;
          background: #f3f4f6; color: #9ca3af;
          font-size: 12px; font-weight: 600;
          text-align: center; font-family: 'DM Sans', sans-serif;
        }

        .kb-p-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: kb-shimmer 1.4s infinite;
          border-radius: 16px; aspect-ratio: 0.75;
        }
        @keyframes kb-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .kb-empty { text-align: center; padding: 80px 24px; }
        .kb-empty-icon { font-size: 64px; margin-bottom: 16px; }
        .kb-empty h3 {
          font-family: 'Syne', sans-serif; font-size: 20px;
          font-weight: 800; color: var(--kb-text); margin: 0 0 8px;
        }
        .kb-empty p  { font-size: 14px; color: var(--kb-muted); margin: 0 0 24px; }
        .kb-empty-btn {
          background: var(--kb-green); color: #fff; border: none;
          padding: 12px 28px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background .2s;
        }
        .kb-empty-btn:hover { background: var(--kb-green-dark); }

        .kb-delivery-strip {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: var(--kb-green-dark);
          font-weight: 600; margin-top: 6px;
        }
      `}</style>

      <div className="kb-products-page" onClick={() => setSortOpen(false)}>

        {/* Sticky sub-header */}
        <div className="kb-products-subheader">
          <div className="kb-products-subheader-top">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="kb-back-btn" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <div>
                <span className="kb-products-title">{pageTitle}</span>
                {!loading && (
                  <span className="kb-products-title-count">
                    {sorted.length} items
                  </span>
                )}
              </div>
            </div>

            <div className="kb-sort-wrap" onClick={(e) => e.stopPropagation()}>
              <button className="kb-sort-btn" onClick={() => setSortOpen(!sortOpen)}>
                ↕ Sort
                {sortBy && <span style={{ color: "var(--kb-green)" }}>•</span>}
              </button>
              {sortOpen && (
                <div className="kb-sort-dropdown">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`kb-sort-option ${sortBy === opt.value ? "active" : ""}`}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="kb-cat-strip">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`kb-cat-chip ${(cat === "All" ? !category : category === cat) ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="kb-products-content">

          {(search || sortBy) && (
            <div className="kb-active-filters">
              {search && (
                <div className="kb-filter-tag">
                  🔍 "{search}"
                  <button onClick={() => setSearchParams(category ? { category } : {})}>×</button>
                </div>
              )}
              {sortBy && (
                <div className="kb-filter-tag">
                  ↕ {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                  <button onClick={() => setSortBy("")}>×</button>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="kb-products-grid">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="kb-p-skeleton" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="kb-empty">
              <div className="kb-empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try a different search or browse all categories.</p>
              <button className="kb-empty-btn" onClick={() => setSearchParams({})}>
                View All Products
              </button>
            </div>
          ) : (
            <div className="kb-products-grid">
              {sorted.map((p) => {
                const qty         = getQty(p.id);
                const hasDiscount = p.mrp && p.mrp > p.price;
                const stock       = p.stock ?? p.stockQuantity ?? null;
                const stockStatus = getStockStatus(stock);
                const isOos       = stockStatus?.type === "oos";
                // ── Is cart qty at max stock? ──
                const isMaxed     = stock !== null && qty >= stock;

                return (
                  <div
                    key={p.id}
                    className={`kb-p-card ${isOos ? "oos" : ""}`}
                  >
                    {/* Badge */}
                    {p.badge && (
                      <div className={`kb-p-badge ${p.badge === "Fresh" ? "fresh" : "offer"}`}>
                        {p.badge}
                      </div>
                    )}

                    {/* Image */}
                    <div className="kb-p-img-wrap">
                      {p.imageUrl || p.image || p.img
                        ? <img
                            src={p.imageUrl || p.image || p.img}
                            alt={p.name}
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        : "🛍️"
                      }
                    </div>

                    {/* Info */}
                    <div className="kb-p-name">{p.name}</div>
                    <div className="kb-p-unit">{p.unit || p.quantity || "1 pc"}</div>

                    {/* ── Stock indicator ── */}
                    {stockStatus && stockStatus.label && (
                      <div className={`kb-p-stock ${stockStatus.type}`}>
                        {stockStatus.type === "critical" ? "🔴" : "🟡"}
                        {stockStatus.label}
                      </div>
                    )}

                    {/* Price */}
                    <div className="kb-p-price-row">
                      <span className="kb-p-price">₹{p.price}</span>
                      {hasDiscount && (
                        <>
                          <span className="kb-p-mrp">₹{p.mrp}</span>
                          <span className="kb-p-discount">
                            {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% off
                          </span>
                        </>
                      )}
                    </div>

                    {/* ── CTA with stock validation ── */}
                    {isOos ? (
                      <div className="kb-p-oos">Out of Stock</div>
                    ) : qty === 0 ? (
                      <button
                        className={`kb-p-add-btn ${addedId === p.id ? "added" : ""}`}
                        onClick={() => handleAddToCart(p)}
                        disabled={isMaxed}
                      >
                        {addedId === p.id ? "✓ Added!" : "+ Add"}
                      </button>
                    ) : (
                      <>
                        <div className="kb-p-stepper">
                          <button
                            className="kb-p-step-btn"
                            onClick={() => decreaseQty(p.id)}
                          >
                            −
                          </button>
                          <span className="kb-p-step-count">{qty}</span>
                          {/* ── Disable + when max stock reached ── */}
                          <button
                            className="kb-p-step-btn"
                            onClick={() => handleIncrease(p)}
                            disabled={isMaxed}
                            title={isMaxed ? "Maximum stock reached" : ""}
                          >
                            +
                          </button>
                        </div>
                        {/* ── Show max reached message ── */}
                        {isMaxed && (
                          <div style={{
                            fontSize: 11, color: "#f59e0b",
                            fontWeight: 600, marginTop: 4,
                            textAlign: "center"
                          }}>
                            Max stock reached
                          </div>
                        )}
                      </>
                    )}

                    <div className="kb-delivery-strip">⚡ 10 min delivery</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}