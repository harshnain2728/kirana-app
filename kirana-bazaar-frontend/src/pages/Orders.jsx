import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const STATUS_CONFIG = {
  PENDING:    { label: "Pending",    color: "#f59e0b", bg: "#fffbeb", icon: "🕐" },
  CONFIRMED:  { label: "Confirmed",  color: "#3b82f6", bg: "#eff6ff", icon: "✅" },
  PREPARING:  { label: "Preparing",  color: "#8b5cf6", bg: "#f5f3ff", icon: "👨‍🍳" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "#f97316", bg: "#fff7ed", icon: "🛵" },
  DELIVERED:  { label: "Delivered",  color: "#1a9e3f", bg: "#e6f7ec", icon: "✓"  },
  CANCELLED:  { label: "Cancelled",  color: "#ef4444", bg: "#fef2f2", icon: "✗"  },
};

function getStatus(status) {
  return STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.PENDING;
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter]         = useState("ALL");

  useEffect(() => {
    api.get("/orders/my")
      .then((res) => {
        const data = res.data?.data || res.data?.content || res.data || [];
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL"
    ? orders
    : orders.filter((o) => o.status?.toUpperCase() === filter);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

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

        .kb-orders-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--kb-gray);
          padding: 28px 16px 60px;
        }
        .kb-orders-wrap { max-width: 800px; margin: 0 auto; }

        /* Header row */
        .kb-orders-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .kb-orders-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--kb-text);
        }
        .kb-orders-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          background: var(--kb-green-light);
          color: var(--kb-green);
          padding: 3px 10px;
          border-radius: 20px;
          margin-left: 8px;
        }

        /* Filter chips */
        .kb-orders-filters {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          margin-bottom: 20px;
          padding-bottom: 2px;
        }
        .kb-orders-filters::-webkit-scrollbar { display: none; }
        .kb-filter-chip {
          flex-shrink: 0;
          padding: 6px 16px;
          border-radius: 20px;
          border: 1.5px solid var(--kb-border);
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--kb-muted);
          cursor: pointer;
          transition: all .2s;
          white-space: nowrap;
        }
        .kb-filter-chip:hover  { border-color: var(--kb-green); color: var(--kb-green); }
        .kb-filter-chip.active { background: var(--kb-green); color: #fff; border-color: var(--kb-green); }

        /* ── Order card ── */
        .kb-order-card {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid var(--kb-border);
          margin-bottom: 14px;
          overflow: hidden;
          transition: box-shadow .2s;
        }
        .kb-order-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.07); }

        .kb-order-card-head {
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          cursor: pointer;
          flex-wrap: wrap;
        }
        .kb-order-card-left { display: flex; flex-direction: column; gap: 4px; }
        .kb-order-id {
          font-size: 13px;
          font-weight: 700;
          color: var(--kb-text);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .kb-order-date { font-size: 12px; color: var(--kb-muted); }

        .kb-order-card-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        /* Status badge */
        .kb-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .kb-order-total {
          font-size: 15px;
          font-weight: 800;
          color: var(--kb-text);
        }

        .kb-order-chevron {
          font-size: 12px;
          color: var(--kb-muted);
          transition: transform .25s;
        }
        .kb-order-chevron.open { transform: rotate(180deg); }

        /* Items preview (collapsed) */
        .kb-order-preview {
          padding: 0 18px 14px;
          display: flex;
          gap: 8px;
          overflow: hidden;
        }
        .kb-order-preview-img {
          width: 42px; height: 42px;
          border-radius: 8px;
          background: var(--kb-gray);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          border: 1px solid var(--kb-border);
          overflow: hidden;
          flex-shrink: 0;
        }
        .kb-order-preview-img img { width: 100%; height: 100%; object-fit: cover; }
        .kb-order-more {
          width: 42px; height: 42px;
          border-radius: 8px;
          background: var(--kb-gray);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--kb-muted);
          flex-shrink: 0;
        }

        /* Expanded body */
        .kb-order-body {
          padding: 0 18px 18px;
          border-top: 1px solid #f0f0f0;
          animation: kb-expand .2s ease;
        }
        @keyframes kb-expand {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Item rows */
        .kb-order-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f7f8fa;
        }
        .kb-order-item:last-of-type { border-bottom: none; }
        .kb-order-item-img {
          width: 48px; height: 48px;
          border-radius: 10px;
          background: var(--kb-gray);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .kb-order-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .kb-order-item-info { flex: 1; min-width: 0; }
        .kb-order-item-name {
          font-size: 13px; font-weight: 600; color: var(--kb-text);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .kb-order-item-qty { font-size: 12px; color: var(--kb-muted); }
        .kb-order-item-price { font-size: 14px; font-weight: 700; color: var(--kb-text); }

        /* Summary rows */
        .kb-order-summary {
          background: var(--kb-gray);
          border-radius: 12px;
          padding: 14px 16px;
          margin-top: 14px;
        }
        .kb-order-summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 7px;
        }
        .kb-order-summary-row:last-child { margin-bottom: 0; }
        .kb-order-summary-row.total {
          font-size: 15px;
          font-weight: 800;
          color: var(--kb-text);
          padding-top: 8px;
          border-top: 1px solid var(--kb-border);
          margin-top: 8px;
        }

        /* Address block */
        .kb-order-address {
          margin-top: 14px;
          padding: 12px 14px;
          background: var(--kb-gray);
          border-radius: 12px;
          font-size: 13px;
          color: var(--kb-muted);
          line-height: 1.6;
        }
        .kb-order-address strong { color: var(--kb-text); font-weight: 700; display: block; margin-bottom: 2px; }

        /* Reorder button */
        .kb-reorder-btn {
          margin-top: 14px;
          width: 100%;
          padding: 11px;
          background: var(--kb-green-light);
          color: var(--kb-green);
          border: 1.5px solid #bbf7d0;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s;
        }
        .kb-reorder-btn:hover { background: #d1f0db; }

        /* ── Empty state ── */
        .kb-orders-empty {
          text-align: center;
          padding: 80px 24px;
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid var(--kb-border);
        }
        .kb-orders-empty-icon { font-size: 64px; margin-bottom: 16px; }
        .kb-orders-empty h3 {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800; color: var(--kb-text); margin: 0 0 8px;
        }
        .kb-orders-empty p { font-size: 14px; color: var(--kb-muted); margin: 0 0 24px; }
        .kb-orders-empty-btn {
          background: var(--kb-green); color: #fff; border: none;
          padding: 12px 28px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer;
        }
        .kb-orders-empty-btn:hover { background: var(--kb-green-dark); }

        /* Skeleton */
        .kb-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: kb-shimmer 1.4s infinite;
          border-radius: 16px;
          margin-bottom: 14px;
        }
        @keyframes kb-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="kb-orders-page">
        <div className="kb-orders-wrap">

          {/* Header */}
          <div className="kb-orders-header">
            <div>
              <span className="kb-orders-title">📦 My Orders</span>
              {!loading && (
                <span className="kb-orders-count">{orders.length} orders</span>
              )}
            </div>
            <button
              onClick={() => navigate("/products")}
              style={{
                background: "var(--kb-green)", color: "#fff", border: "none",
                padding: "9px 18px", borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                fontWeight: 700, cursor: "pointer"
              }}
            >
              + New Order
            </button>
          </div>

          {/* Filter chips */}
          <div className="kb-orders-filters">
            {["ALL", "PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((f) => (
              <button
                key={f}
                className={`kb-filter-chip ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL" ? "All Orders" : getStatus(f).icon + " " + getStatus(f).label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="kb-skeleton" style={{ height: 100 }} />
            ))
          ) : filtered.length === 0 ? (
            <div className="kb-orders-empty">
              <div className="kb-orders-empty-icon">📭</div>
              <h3>{filter === "ALL" ? "No orders yet" : `No ${getStatus(filter).label} orders`}</h3>
              <p>
                {filter === "ALL"
                  ? "You haven't placed any orders yet. Start shopping!"
                  : "Try a different filter to see your orders."}
              </p>
              {filter === "ALL" && (
                <button className="kb-orders-empty-btn" onClick={() => navigate("/products")}>
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            filtered.map((order) => {
              const statusCfg = getStatus(order.status);
              const isOpen    = expandedId === order.id;
              const items     = order.items || order.orderItems || [];
              const preview   = items.slice(0, 3);
              const extra     = items.length - 3;
              const address   = order.address || order.deliveryAddress;
              const deliveryFee = (order.total || 0) >= 199 ? 0 : 30;

              return (
                <div className="kb-order-card" key={order.id}>

                  {/* Card head — clickable to expand */}
                  <div className="kb-order-card-head" onClick={() => toggleExpand(order.id)}>
                    <div className="kb-order-card-left">
                      <div className="kb-order-id">
                        🧾 #{order.id || order.orderId}
                      </div>
                      <div className="kb-order-date">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit"
                            })
                          : "Date unavailable"
                        }
                      </div>
                    </div>

                    <div className="kb-order-card-right">
                      <div
                        className="kb-status-badge"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}
                      >
                        {statusCfg.icon} {statusCfg.label}
                      </div>
                      <div className="kb-order-total">₹{order.total}</div>
                      <div className={`kb-order-chevron ${isOpen ? "open" : ""}`}>▾</div>
                    </div>
                  </div>

                  {/* Items preview (collapsed) */}
                  {!isOpen && items.length > 0 && (
                    <div className="kb-order-preview">
                      {preview.map((item, i) => (
                        <div className="kb-order-preview-img" key={i}>
                          {item.imageUrl || item.img
                            ? <img src={item.imageUrl || item.img} alt={item.name} />
                            : "🛍️"
                          }
                        </div>
                      ))}
                      {extra > 0 && (
                        <div className="kb-order-more">+{extra}</div>
                      )}
                    </div>
                  )}

                  {/* Expanded body */}
                  {isOpen && (
                    <div className="kb-order-body">

                      {/* Item rows */}
                      {items.map((item, i) => (
                        <div className="kb-order-item" key={i}>
                          <div className="kb-order-item-img">
                            {item.imageUrl || item.img
                              ? <img src={item.imageUrl || item.img} alt={item.name} />
                              : "🛍️"
                            }
                          </div>
                          <div className="kb-order-item-info">
                            <div className="kb-order-item-name">{item.name}</div>
                            <div className="kb-order-item-qty">Qty: {item.quantity}</div>
                          </div>
                          <div className="kb-order-item-price">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}

                      {/* Summary */}
                      <div className="kb-order-summary">
                        <div className="kb-order-summary-row">
                          <span>Subtotal</span>
                          <span>₹{order.total}</span>
                        </div>
                        <div className="kb-order-summary-row">
                          <span>Delivery fee</span>
                          <span style={{ color: deliveryFee === 0 ? "#1a9e3f" : "inherit" }}>
                            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                          </span>
                        </div>
                        <div className="kb-order-summary-row total">
                          <span>Total Paid</span>
                          <span>₹{order.total + deliveryFee}</span>
                        </div>
                      </div>

                      {/* Delivery address */}
                      {address && (
                        <div className="kb-order-address">
                          <strong>📍 Delivery Address</strong>
                          {address.name && `${address.name}, `}
                          {address.street && `${address.street}, `}
                          {address.city && `${address.city} `}
                          {address.pincode && `- ${address.pincode}`}
                        </div>
                      )}

                      {/* Reorder */}
                      <button
                        className="kb-reorder-btn"
                        onClick={() => navigate("/products")}
                      >
                        🔁 Reorder Items
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}