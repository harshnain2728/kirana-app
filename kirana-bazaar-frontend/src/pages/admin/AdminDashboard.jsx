import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const NAV_ITEMS = [
  { icon: "📊", label: "Dashboard",  path: "/admin"          },
  { icon: "📦", label: "Products",   path: "/admin/products" },
  { icon: "🧾", label: "Orders",     path: "/admin/orders"   },
  { icon: "🏠", label: "View Store", path: "/"               },
];

export function AdminLayout({ children, active }) {
  const navigate = useNavigate();
  const adminName = JSON.parse(localStorage.getItem("user") || "{}").name || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    navigate("/admin/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .ka-layout {
          font-family: 'DM Sans', sans-serif;
          display: flex; min-height: 100vh; background: #f1f5f9;
        }

        /* Sidebar */
        .ka-sidebar {
          width: 240px; flex-shrink: 0;
          background: #0f172a;
          display: flex; flex-direction: column;
          padding: 24px 0;
          position: sticky; top: 0; height: 100vh;
        }
        @media (max-width: 768px) { .ka-sidebar { display: none; } }

        .ka-sidebar-brand {
          padding: 0 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 16px;
        }
        .ka-sidebar-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800; color: #fff;
        }
        .ka-sidebar-brand-sub {
          font-size: 11px; color: #475569;
          text-transform: uppercase; letter-spacing: 1px;
        }

        .ka-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 20px; margin: 2px 10px;
          border-radius: 10px;
          font-size: 14px; font-weight: 600;
          color: #64748b; cursor: pointer;
          transition: background .15s, color .15s;
          border: none; background: transparent;
          font-family: 'DM Sans', sans-serif;
          text-align: left; width: calc(100% - 20px);
        }
        .ka-nav-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
        .ka-nav-item.active { background: #4f46e5; color: #fff; }
        .ka-nav-item-icon { font-size: 16px; }

        .ka-sidebar-footer {
          margin-top: auto;
          padding: 16px 20px 0;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .ka-admin-chip {
          display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
        }
        .ka-admin-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: #4f46e5; color: #fff;
          font-size: 13px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ka-admin-name { font-size: 13px; font-weight: 600; color: #e2e8f0; }
        .ka-admin-role { font-size: 11px; color: #475569; }
        .ka-logout-btn {
          width: 100%; padding: 9px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 9px; color: #f87171;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background .15s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .ka-logout-btn:hover { background: rgba(239,68,68,0.18); }

        /* Main */
        .ka-main { flex: 1; min-width: 0; }

        /* Top bar */
        .ka-topbar {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 24px;
          display: flex; align-items: center;
          justify-content: space-between;
          position: sticky; top: 0; z-index: 40;
        }
        .ka-topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800; color: #0f172a;
        }
        .ka-topbar-right {
          display: flex; align-items: center; gap: 10px;
        }
        .ka-topbar-chip {
          display: flex; align-items: center; gap: 6px;
          background: #f1f5f9; border-radius: 8px;
          padding: 6px 12px; font-size: 12px;
          font-weight: 600; color: #475569;
        }

        /* Content */
        .ka-content { padding: 24px; }
      `}</style>

      <div className="ka-layout">
        <aside className="ka-sidebar">
          <div className="ka-sidebar-brand">
            <div className="ka-sidebar-brand-name">KiranaBazaar</div>
            <div className="ka-sidebar-brand-sub">Admin Panel</div>
          </div>

          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`ka-nav-item ${active === item.label ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="ka-nav-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="ka-sidebar-footer">
            <div className="ka-admin-chip">
              <div className="ka-admin-avatar">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="ka-admin-name">{adminName}</div>
                <div className="ka-admin-role">Administrator</div>
              </div>
            </div>
            <button className="ka-logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </aside>

        <div className="ka-main">
          <div className="ka-topbar">
            <div className="ka-topbar-title">
              {active === "Dashboard"  && "📊 Dashboard"}
              {active === "Products"   && "📦 Products"}
              {active === "Orders"     && "🧾 Orders"}
            </div>
            <div className="ka-topbar-right">
              <div className="ka-topbar-chip">🛡️ {adminName}</div>
            </div>
          </div>
          <div className="ka-content">{children}</div>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/orders").catch(() => ({ data: [] })),
      api.get("/products").catch(() => ({ data: [] })),
    ]).then(([ordersRes, productsRes]) => {
      const allOrders   = ordersRes.data?.content  || ordersRes.data?.data  || ordersRes.data  || [];
      const allProducts = productsRes.data?.content || productsRes.data?.data || productsRes.data || [];

      const revenue = allOrders.reduce((s, o) => s + (o.total || 0), 0);
      const pending  = allOrders.filter((o) => o.status?.toUpperCase() === "PENDING").length;
      const lowStock = allProducts.filter((p) => (p.stock ?? p.quantity ?? 99) < 10).length;

      setStats({
        totalOrders:   allOrders.length,
        totalProducts: allProducts.length,
        revenue,
        pending,
        lowStock,
      });
      setOrders(allOrders.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const STATUS_COLOR = {
    PENDING:          { color: "#f59e0b", bg: "#fffbeb" },
    CONFIRMED:        { color: "#3b82f6", bg: "#eff6ff" },
    PREPARING:        { color: "#8b5cf6", bg: "#f5f3ff" },
    OUT_FOR_DELIVERY: { color: "#f97316", bg: "#fff7ed" },
    DELIVERED:        { color: "#1a9e3f", bg: "#e6f7ec" },
    CANCELLED:        { color: "#ef4444", bg: "#fef2f2" },
  };

  return (
    <AdminLayout active="Dashboard">
      <style>{`
        .ka-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 24px;
        }
        @media (max-width: 900px) { .ka-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .ka-stats-grid { grid-template-columns: 1fr; } }

        .ka-stat-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          padding: 20px;
          transition: box-shadow .2s, transform .2s;
        }
        .ka-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); transform: translateY(-2px); }
        .ka-stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; margin-bottom: 14px;
        }
        .ka-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 26px; font-weight: 800; color: #0f172a;
          margin-bottom: 3px;
        }
        .ka-stat-label { font-size: 13px; color: #64748b; font-weight: 500; }
        .ka-stat-sub {
          font-size: 11px; font-weight: 600; margin-top: 6px;
          display: flex; align-items: center; gap: 4px;
        }

        .ka-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 800; color: #0f172a;
          margin-bottom: 14px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ka-section-title a {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          color: #4f46e5; cursor: pointer;
          text-decoration: none;
        }
        .ka-section-title a:hover { text-decoration: underline; }

        .ka-table-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e2e8f0; overflow: hidden;
          margin-bottom: 20px;
        }
        .ka-table { width: 100%; border-collapse: collapse; }
        .ka-table th {
          padding: 12px 16px; text-align: left;
          font-size: 11px; font-weight: 700;
          color: #64748b; text-transform: uppercase;
          letter-spacing: 0.5px; background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .ka-table td {
          padding: 13px 16px; font-size: 13px;
          color: #1e293b; border-bottom: 1px solid #f1f5f9;
        }
        .ka-table tr:last-child td { border-bottom: none; }
        .ka-table tr:hover td { background: #f8fafc; }

        .ka-badge {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
        }

        .ka-quick-actions {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 12px; margin-bottom: 24px;
        }
        @media (max-width: 600px) { .ka-quick-actions { grid-template-columns: 1fr; } }
        .ka-quick-action {
          display: flex; align-items: center; gap: 12px;
          padding: 16px; background: #fff;
          border-radius: 14px; border: 1.5px solid #e2e8f0;
          cursor: pointer; transition: border-color .2s, transform .15s;
          font-family: 'DM Sans', sans-serif;
        }
        .ka-quick-action:hover { border-color: #4f46e5; transform: translateY(-1px); }
        .ka-quick-action-icon {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .ka-quick-action-text strong { display: block; font-size: 13px; font-weight: 700; color: #0f172a; }
        .ka-quick-action-text span   { font-size: 11px; color: #64748b; }

        .ka-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: ka-shimmer 1.4s infinite;
          border-radius: 16px;
        }
        @keyframes ka-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {loading ? (
        <>
          <div className="ka-stats-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="ka-skeleton" style={{ height: 110 }} />
            ))}
          </div>
          <div className="ka-skeleton" style={{ height: 300 }} />
        </>
      ) : (
        <>
          {/* Stat cards */}
          <div className="ka-stats-grid">
            {[
              { icon: "🧾", label: "Total Orders",    value: stats.totalOrders,   sub: `${stats.pending} pending`,  subColor: "#f59e0b", bg: "#eff6ff", iconBg: "#dbeafe" },
              { icon: "💰", label: "Total Revenue",   value: `₹${stats.revenue}`, sub: "All time",                  subColor: "#1a9e3f", bg: "#f0fdf4", iconBg: "#dcfce7" },
              { icon: "📦", label: "Total Products",  value: stats.totalProducts, sub: `${stats.lowStock} low stock`, subColor: "#ef4444", bg: "#fef2f2", iconBg: "#fee2e2" },
              { icon: "✅", label: "Delivered",       value: orders.filter(o => o.status?.toUpperCase() === "DELIVERED").length, sub: "Completed orders", subColor: "#1a9e3f", bg: "#f0fdf4", iconBg: "#dcfce7" },
            ].map((s) => (
              <div className="ka-stat-card" key={s.label}>
                <div className="ka-stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                <div className="ka-stat-value">{s.value}</div>
                <div className="ka-stat-label">{s.label}</div>
                <div className="ka-stat-sub" style={{ color: s.subColor }}>↑ {s.sub}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="ka-section-title">Quick Actions</div>
          <div className="ka-quick-actions">
            {[
              { icon: "➕", label: "Add Product",    sub: "List a new item",       path: "/admin/products", bg: "#eff6ff" },
              { icon: "🧾", label: "Manage Orders",  sub: "Update order statuses", path: "/admin/orders",   bg: "#f5f3ff" },
              { icon: "🛍️", label: "View Store",     sub: "See customer view",     path: "/",               bg: "#f0fdf4" },
            ].map((a) => (
              <div className="ka-quick-action" key={a.label} onClick={() => navigate(a.path)}>
                <div className="ka-quick-action-icon" style={{ background: a.bg }}>{a.icon}</div>
                <div className="ka-quick-action-text">
                  <strong>{a.label}</strong>
                  <span>{a.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="ka-section-title">
            Recent Orders
            <span onClick={() => navigate("/admin/orders")} style={{ fontSize: 13, fontWeight: 600, color: "#4f46e5", cursor: "pointer" }}>
              View all →
            </span>
          </div>
          <div className="ka-table-card">
            <table className="ka-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>No orders yet</td></tr>
                ) : orders.map((o) => {
                  const s = STATUS_COLOR[o.status?.toUpperCase()] || STATUS_COLOR.PENDING;
                  return (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700 }}>#{o.id}</td>
                      <td style={{ fontWeight: 700 }}>₹{o.total}</td>
                      <td>
                        <span className="ka-badge" style={{ background: s.bg, color: s.color }}>
                          {o.status || "PENDING"}
                        </span>
                      </td>
                      <td style={{ color: "#64748b" }}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}