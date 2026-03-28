import { useState, useEffect } from "react";
import api from "../../api/axios";
import { AdminLayout } from "./AdminDashboard";

const STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const STATUS_CONFIG = {
  PENDING:          { color: "#f59e0b", bg: "#fffbeb", icon: "🕐" },
  CONFIRMED:        { color: "#3b82f6", bg: "#eff6ff", icon: "✅" },
  PREPARING:        { color: "#8b5cf6", bg: "#f5f3ff", icon: "👨‍🍳" },
  OUT_FOR_DELIVERY: { color: "#f97316", bg: "#fff7ed", icon: "🛵" },
  DELIVERED:        { color: "#1a9e3f", bg: "#e6f7ec", icon: "✓"  },
  CANCELLED:        { color: "#ef4444", bg: "#fef2f2", icon: "✗"  },
};

export default function AdminOrders() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);
  const [updating, setUpdating]   = useState(null);
  const [message, setMessage]     = useState({ text: "", type: "" });
  const [search, setSearch]       = useState("");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      const data = res.data?.content || res.data?.data || res.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
      );
      setMessage({ text: `Order #${orderId} updated to ${newStatus}`, type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch {
      setMessage({ text: "Failed to update status. Try again.", type: "error" });
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === "ALL" || o.status?.toUpperCase() === filter;
    const matchesSearch = !search || String(o.id).includes(search) ||
      o.address?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout active="Orders">
      <style>{`
        .ka-orders-toolbar {
          display: flex; gap: 12px; margin-bottom: 16px;
          flex-wrap: wrap; align-items: center;
        }
        .ka-search-input {
          flex: 1; min-width: 200px;
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; transition: border-color .2s;
        }
        .ka-search-input:focus { border-color: #4f46e5; }

        .ka-filter-chips {
          display: flex; gap: 8px; overflow-x: auto;
          scrollbar-width: none; margin-bottom: 20px; padding-bottom: 2px;
        }
        .ka-filter-chips::-webkit-scrollbar { display: none; }
        .ka-fchip {
          flex-shrink: 0; padding: 6px 14px; border-radius: 20px;
          border: 1.5px solid #e2e8f0; background: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
          color: #64748b; cursor: pointer; transition: all .2s; white-space: nowrap;
        }
        .ka-fchip:hover  { border-color: #4f46e5; color: #4f46e5; }
        .ka-fchip.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }

        .ka-alert-banner {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500; margin-bottom: 16px;
          animation: ka-alert-in .2s ease;
        }
        @keyframes ka-alert-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ka-alert-banner.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .ka-alert-banner.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

        /* Order card */
        .ka-order-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          margin-bottom: 12px; overflow: hidden;
          transition: box-shadow .2s;
        }
        .ka-order-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        .ka-order-head {
          padding: 14px 18px;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 12px; cursor: pointer; flex-wrap: wrap;
        }
        .ka-order-head-left { display: flex; flex-direction: column; gap: 3px; }
        .ka-order-id {
          font-size: 14px; font-weight: 800; color: #0f172a;
          display: flex; align-items: center; gap: 6px;
        }
        .ka-order-meta { font-size: 12px; color: #64748b; }
        .ka-order-head-right {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }

        .ka-status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
        }

        /* Status dropdown */
        .ka-status-select {
          padding: 7px 10px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; color: #0f172a;
          background: #f8fafc; outline: none; cursor: pointer;
          transition: border-color .2s;
        }
        .ka-status-select:focus { border-color: #4f46e5; }
        .ka-status-select:disabled { opacity: 0.5; cursor: not-allowed; }

        .ka-order-total { font-size: 15px; font-weight: 800; color: #0f172a; }
        .ka-chevron {
          font-size: 12px; color: #94a3b8;
          transition: transform .25s;
        }
        .ka-chevron.open { transform: rotate(180deg); }

        /* Expanded body */
        .ka-order-body {
          padding: 0 18px 18px;
          border-top: 1px solid #f1f5f9;
          animation: ka-expand .2s ease;
        }
        @keyframes ka-expand {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ka-order-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 0; border-bottom: 1px solid #f7f8fa;
        }
        .ka-order-item:last-of-type { border-bottom: none; }
        .ka-item-img {
          width: 46px; height: 46px; border-radius: 9px;
          background: #f1f5f9; display: flex;
          align-items: center; justify-content: center;
          font-size: 22px; overflow: hidden; flex-shrink: 0;
        }
        .ka-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .ka-item-info { flex: 1; min-width: 0; }
        .ka-item-name {
          font-size: 13px; font-weight: 600; color: #0f172a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ka-item-qty { font-size: 12px; color: #64748b; }
        .ka-item-price { font-size: 13px; font-weight: 700; color: #0f172a; }

        .ka-order-summary-box {
          background: #f8fafc; border-radius: 12px;
          padding: 12px 14px; margin-top: 12px;
          display: flex; justify-content: space-between;
          font-size: 13px;
        }
        .ka-order-summary-box span { color: #64748b; }
        .ka-order-summary-box strong { font-weight: 800; color: #0f172a; }

        .ka-order-address {
          margin-top: 10px; padding: 12px 14px;
          background: #f8fafc; border-radius: 12px;
          font-size: 13px; color: #64748b; line-height: 1.6;
        }
        .ka-order-address strong { color: #0f172a; font-weight: 700; display: block; margin-bottom: 2px; }

        /* Empty */
        .ka-empty {
          text-align: center; padding: 80px 24px;
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e2e8f0;
        }
        .ka-empty-icon { font-size: 56px; margin-bottom: 14px; }
        .ka-empty h3 {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 6px;
        }
        .ka-empty p { font-size: 14px; color: #64748b; margin: 0; }

        .ka-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: ka-shimmer 1.4s infinite;
          border-radius: 16px; margin-bottom: 12px;
        }
        @keyframes ka-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .ka-updating-spinner {
          width: 14px; height: 14px;
          border: 2px solid #e2e8f0;
          border-top-color: #4f46e5; border-radius: 50%;
          animation: ka-spin .7s linear infinite; display: inline-block;
        }
        @keyframes ka-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Alert */}
      {message.text && (
        <div className={`ka-alert-banner ${message.type}`}>
          {message.type === "success" ? "✓" : "⚠"} {message.text}
        </div>
      )}

      {/* Toolbar */}
      <div className="ka-orders-toolbar">
        <input
          className="ka-search-input"
          placeholder="🔍 Search by order ID or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter chips */}
      <div className="ka-filter-chips">
        <button className={`ka-fchip ${filter === "ALL" ? "active" : ""}`} onClick={() => setFilter("ALL")}>
          All ({orders.length})
        </button>
        {STATUSES.map((s) => {
          const cfg   = STATUS_CONFIG[s];
          const count = orders.filter((o) => o.status?.toUpperCase() === s).length;
          return (
            <button
              key={s}
              className={`ka-fchip ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {cfg.icon} {s.replace(/_/g, " ")} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders */}
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="ka-skeleton" style={{ height: 80 }} />
        ))
      ) : filtered.length === 0 ? (
        <div className="ka-empty">
          <div className="ka-empty-icon">📭</div>
          <h3>No orders found</h3>
          <p>{filter === "ALL" ? "No orders have been placed yet." : `No ${filter.replace(/_/g, " ")} orders.`}</p>
        </div>
      ) : (
        filtered.map((order) => {
          const statusCfg = STATUS_CONFIG[order.status?.toUpperCase()] || STATUS_CONFIG.PENDING;
          const isOpen    = expandedId === order.id;
          const items     = order.items || order.orderItems || [];
          const address   = order.address || order.deliveryAddress;

          return (
            <div className="ka-order-card" key={order.id}>
              <div className="ka-order-head" onClick={() => setExpandedId(isOpen ? null : order.id)}>

                {/* Left */}
                <div className="ka-order-head-left">
                  <div className="ka-order-id">
                    🧾 Order #{order.id}
                  </div>
                  <div className="ka-order-meta">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })
                      : "—"
                    }
                    {address?.name && ` · ${address.name}`}
                  </div>
                </div>

                {/* Right */}
                <div className="ka-order-head-right" onClick={(e) => e.stopPropagation()}>
                  {/* Current status badge */}
                  <span
                    className="ka-status-badge"
                    style={{ background: statusCfg.bg, color: statusCfg.color }}
                  >
                    {statusCfg.icon} {order.status?.replace(/_/g, " ") || "PENDING"}
                  </span>

                  {/* Status update dropdown */}
                  <select
                    className="ka-status-select"
                    value={order.status?.toUpperCase() || "PENDING"}
                    disabled={updating === order.id}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>

                  {updating === order.id && <span className="ka-updating-spinner" />}

                  <div className="ka-order-total">₹{order.total}</div>
                  <div className={`ka-chevron ${isOpen ? "open" : ""}`}>▾</div>
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div className="ka-order-body">
                  {items.length === 0 ? (
                    <div style={{ padding: "16px 0", color: "#94a3b8", fontSize: 13 }}>
                      No item details available
                    </div>
                  ) : items.map((item, i) => (
                    <div className="ka-order-item" key={i}>
                      <div className="ka-item-img">
                        {item.imageUrl || item.img
                          ? <img src={item.imageUrl || item.img} alt={item.name} />
                          : "🛍️"
                        }
                      </div>
                      <div className="ka-item-info">
                        <div className="ka-item-name">{item.name}</div>
                        <div className="ka-item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="ka-item-price">₹{item.price * item.quantity}</div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="ka-order-summary-box">
                    <span>Total ({items.length} items)</span>
                    <strong>₹{order.total}</strong>
                  </div>

                  {/* Address */}
                  {address && (
                    <div className="ka-order-address">
                      <strong>📍 Delivery Address</strong>
                      {[address.name, address.street, address.city, address.pincode && `- ${address.pincode}`]
                        .filter(Boolean).join(", ")}
                      {address.phone && <div style={{ marginTop: 2 }}>📞 {address.phone}</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </AdminLayout>
  );
}