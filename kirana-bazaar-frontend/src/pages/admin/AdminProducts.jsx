import { useState, useEffect } from "react";
import api from "../../config/axios";
import { AdminLayout } from "./AdminDashboard";

const EMPTY_FORM = { name: "", price: "", mrp: "", category: "", unit: "", stock: "", description: "", imageUrl: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");
  const [message, setMessage]   = useState({ text: "", type: "" });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      const data = res.data?.content || res.data?.data || res.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name || "", price: p.price || "", mrp: p.mrp || "",
      category: p.category || "", unit: p.unit || "",
      stock: p.stock ?? "", description: p.description || "",
      imageUrl: p.imageUrl || p.image || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.price) {
      setMessage({ text: "Name and price are required", type: "error" }); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), mrp: Number(form.mrp) || null, stock: Number(form.stock) || 0 };
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, payload);
        setMessage({ text: "Product updated!", type: "success" });
      } else {
        await api.post("/products", payload);
        setMessage({ text: "Product added!", type: "success" });
      }
      setShowModal(false);
      fetchProducts();
    } catch {
      setMessage({ text: "Failed to save product. Try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setMessage({ text: "Product deleted.", type: "success" });
      setDeleteId(null);
      fetchProducts();
    } catch {
      setMessage({ text: "Failed to delete product.", type: "error" });
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout active="Products">
      <style>{`
        .ka-products-toolbar {
          display: flex; gap: 12px; margin-bottom: 20px;
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

        .ka-btn-primary {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px; background: #4f46e5; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background .2s; white-space: nowrap;
        }
        .ka-btn-primary:hover { background: #4338ca; }

        .ka-products-table-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e2e8f0; overflow: auto;
        }
        .ka-ptable { width: 100%; border-collapse: collapse; min-width: 600px; }
        .ka-ptable th {
          padding: 12px 16px; text-align: left;
          font-size: 11px; font-weight: 700;
          color: #64748b; text-transform: uppercase;
          letter-spacing: 0.5px; background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .ka-ptable td {
          padding: 13px 16px; font-size: 13px;
          color: #1e293b; border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .ka-ptable tr:last-child td { border-bottom: none; }
        .ka-ptable tr:hover td { background: #f8fafc; }

        .ka-product-img {
          width: 44px; height: 44px; border-radius: 10px;
          object-fit: cover; background: #f1f5f9;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; overflow: hidden; flex-shrink: 0;
        }
        .ka-product-img img { width: 100%; height: 100%; object-fit: cover; }
        .ka-product-name-cell {
          display: flex; align-items: center; gap: 10px;
        }

        .ka-action-btn {
          padding: 5px 12px; border-radius: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: background .15s;
          border: none;
        }
        .ka-action-btn.edit  { background: #eff6ff; color: #3b82f6; }
        .ka-action-btn.edit:hover  { background: #dbeafe; }
        .ka-action-btn.delete { background: #fef2f2; color: #ef4444; }
        .ka-action-btn.delete:hover { background: #fee2e2; }

        .ka-stock-badge {
          font-size: 11px; font-weight: 700;
          padding: 2px 8px; border-radius: 20px;
        }

        /* Alert banner */
        .ka-alert-banner {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          margin-bottom: 16px;
          animation: ka-alert-in .2s ease;
        }
        @keyframes ka-alert-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ka-alert-banner.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .ka-alert-banner.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

        /* Modal overlay */
        .ka-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.5);
          backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          z-index: 200; padding: 16px;
          animation: ka-overlay-in .15s ease;
        }
        @keyframes ka-overlay-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        .ka-modal {
          background: #fff; border-radius: 20px;
          width: 100%; max-width: 520px;
          max-height: 90vh; overflow-y: auto;
          animation: ka-modal-in .2s ease;
        }
        @keyframes ka-modal-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ka-modal-head {
          padding: 18px 22px;
          border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ka-modal-head h3 {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;
        }
        .ka-modal-close {
          background: #f1f5f9; border: none; border-radius: 8px;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; cursor: pointer; transition: background .15s;
        }
        .ka-modal-close:hover { background: #e2e8f0; }
        .ka-modal-body { padding: 22px; }

        .ka-modal-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }
        .ka-modal-grid .full { grid-column: 1 / -1; }
        .ka-mfield { display: flex; flex-direction: column; gap: 5px; }
        .ka-mfield label {
          font-size: 11px; font-weight: 700; color: #475569;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .ka-mfield input, .ka-mfield select, .ka-mfield textarea {
          padding: 10px 13px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: #0f172a; outline: none;
          transition: border-color .2s, box-shadow .2s;
          background: #fff;
        }
        .ka-mfield input:focus, .ka-mfield select:focus, .ka-mfield textarea:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
        }
        .ka-mfield textarea { resize: vertical; min-height: 80px; }

        .ka-modal-footer {
          padding: 16px 22px;
          border-top: 1px solid #f1f5f9;
          display: flex; gap: 10px; justify-content: flex-end;
        }
        .ka-modal-save {
          padding: 10px 24px; background: #4f46e5; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background .2s;
          display: flex; align-items: center; gap: 7px;
        }
        .ka-modal-save:hover:not(:disabled) { background: #4338ca; }
        .ka-modal-save:disabled { background: #94a3b8; cursor: not-allowed; }
        .ka-modal-cancel {
          padding: 10px 20px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          background: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; color: #64748b;
          cursor: pointer; transition: border-color .2s;
        }
        .ka-modal-cancel:hover { border-color: #94a3b8; }

        .ka-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: ka-spin .7s linear infinite;
        }
        @keyframes ka-spin { to { transform: rotate(360deg); } }

        /* Confirm delete */
        .ka-confirm-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 300; padding: 16px;
        }
        .ka-confirm-box {
          background: #fff; border-radius: 16px;
          padding: 28px 24px; max-width: 360px; width: 100%;
          text-align: center;
          animation: ka-modal-in .2s ease;
        }
        .ka-confirm-box h3 {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800; color: #0f172a;
          margin: 0 0 8px;
        }
        .ka-confirm-box p { font-size: 14px; color: #64748b; margin: 0 0 20px; }
        .ka-confirm-actions { display: flex; gap: 10px; justify-content: center; }
        .ka-btn-delete {
          padding: 10px 24px; background: #ef4444; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer;
        }
        .ka-btn-delete:hover { background: #dc2626; }
        .ka-btn-ghost {
          padding: 10px 20px; border: 1.5px solid #e2e8f0;
          border-radius: 10px; background: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          color: #64748b; cursor: pointer;
        }

        .ka-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: ka-shimmer 1.4s infinite; border-radius: 16px;
        }
        @keyframes ka-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Alert */}
      {message.text && (
        <div className={`ka-alert-banner ${message.type}`}>
          {message.type === "success" ? "✓" : "⚠"} {message.text}
        </div>
      )}

      {/* Toolbar */}
      <div className="ka-products-toolbar">
        <input
          className="ka-search-input"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="ka-btn-primary" onClick={openAdd}>
          ➕ Add Product
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="ka-skeleton" style={{ height: 400 }} />
      ) : (
        <div className="ka-products-table-card">
          <table className="ka-ptable">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>MRP</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: 48 }}>
                    No products found
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const stock = p.stock ?? p.quantity ?? 0;
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="ka-product-name-cell">
                        <div className="ka-product-img">
                          {p.imageUrl || p.image
                            ? <img src={p.imageUrl || p.image} alt={p.name} />
                            : "🛍️"
                          }
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.unit || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "#64748b" }}>{p.category || "—"}</td>
                    <td style={{ fontWeight: 700 }}>₹{p.price}</td>
                    <td style={{ color: "#94a3b8", textDecoration: "line-through" }}>
                      {p.mrp ? `₹${p.mrp}` : "—"}
                    </td>
                    <td>
                      <span
                        className="ka-stock-badge"
                        style={{
                          background: stock < 10 ? "#fef2f2" : "#f0fdf4",
                          color: stock < 10 ? "#ef4444" : "#16a34a",
                        }}
                      >
                        {stock < 10 ? `⚠ ${stock}` : `✓ ${stock}`}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="ka-action-btn edit" onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="ka-action-btn delete" onClick={() => setDeleteId(p.id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="ka-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ka-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ka-modal-head">
              <h3>{editProduct ? "✏️ Edit Product" : "➕ Add Product"}</h3>
              <button className="ka-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="ka-modal-body">
              <div className="ka-modal-grid">
                <div className="ka-mfield full">
                  <label>Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amul Butter" />
                </div>
                <div className="ka-mfield">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 55" />
                </div>
                <div className="ka-mfield">
                  <label>MRP (₹)</label>
                  <input name="mrp" type="number" value={form.mrp} onChange={handleChange} placeholder="e.g. 60" />
                </div>
                <div className="ka-mfield">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    {["Fruits","Vegetables","Dairy","Snacks","Beverages","Bakery","Staples","Personal Care"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="ka-mfield">
                  <label>Unit</label>
                  <input name="unit" value={form.unit} onChange={handleChange} placeholder="e.g. 500g, 1L" />
                </div>
                <div className="ka-mfield">
                  <label>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="e.g. 100" />
                </div>
                <div className="ka-mfield full">
                  <label>Image URL</label>
                  <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="ka-mfield full">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short product description..." />
                </div>
              </div>
            </div>
            <div className="ka-modal-footer">
              <button className="ka-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ka-modal-save" onClick={handleSave} disabled={saving}>
                {saving ? <><div className="ka-spinner" /> Saving...</> : `${editProduct ? "Update" : "Add"} Product`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="ka-confirm-overlay">
          <div className="ka-confirm-box">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone. The product will be permanently removed.</p>
            <div className="ka-confirm-actions">
              <button className="ka-btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="ka-btn-delete" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}