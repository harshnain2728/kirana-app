import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../api/addressApi";
import toast from "react-hot-toast";

const validate = (form) => {
  const errors = {};
  if (!form.name.trim())                 errors.name    = "Full name is required";
  if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone   = "Enter a valid 10-digit phone";
  if (!form.street.trim())               errors.street  = "Street address is required";
  if (!form.city.trim())                 errors.city    = "City is required";
  if (!/^\d{6}$/.test(form.pincode))     errors.pincode = "Enter a valid 6-digit pincode";
  return errors;
};

const EMPTY_FORM = { name: "", phone: "", street: "", city: "", pincode: "" };

export default function Addresses() {
  const navigate = useNavigate();

  const user   = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const [addresses,  setAddresses]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState({});
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserAddresses(userId);
      setAddresses(res.data || []);
    } catch {
      toast.error("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchAddresses();
  }, [userId, fetchAddresses, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const openAddForm = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (addr) => {
    setEditTarget(addr);
    setForm({ name: addr.name, phone: addr.phone, street: addr.street, city: addr.city, pincode: addr.pincode });
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleSave = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await updateAddress(editTarget.id, form);
        toast.success("Address updated!");
      } else {
        await addAddress(userId, form);
        toast.success("Address added!");
      }
      closeForm();
      fetchAddresses();
    } catch {
      toast.error("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      toast("Address removed.", { icon: "🗑️" });
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id, userId);
      toast.success("Default address updated!");
      fetchAddresses();
    } catch {
      toast.error("Failed to update default address.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        :root {
          --kb-green: #1a9e3f; --kb-green-dark: #127a30;
          --kb-green-light: #e6f7ec; --kb-gray: #f7f8fa;
          --kb-border: #e5e7eb; --kb-text: #1a1a1a;
          --kb-muted: #6b7280; --kb-red: #ef4444; --kb-red-light: #fef2f2;
        }
        .kb-addr-page { font-family:'DM Sans',sans-serif; background:var(--kb-gray); min-height:100vh; padding:28px 16px 80px; }
        .kb-addr-wrapper { max-width:640px; margin:0 auto; }

        .kb-addr-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
        .kb-addr-title { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:var(--kb-text); display:flex; align-items:center; gap:10px; margin-top:6px; }
        .kb-back-btn { background:none; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:var(--kb-muted); cursor:pointer; padding:0; transition:color .15s; }
        .kb-back-btn:hover { color:var(--kb-green); }

        .kb-add-btn { display:flex; align-items:center; gap:7px; padding:10px 18px; border-radius:12px; background:var(--kb-green); color:#fff; border:none; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:background .2s; box-shadow:0 4px 14px rgba(26,158,63,0.25); }
        .kb-add-btn:hover { background:var(--kb-green-dark); }

        .kb-addr-list { display:flex; flex-direction:column; gap:14px; }
        .kb-addr-card { background:#fff; border-radius:16px; border:1.5px solid var(--kb-border); padding:18px 20px; transition:border-color .2s, box-shadow .2s; }
        .kb-addr-card.is-default { border-color:var(--kb-green); box-shadow:0 0 0 3px rgba(26,158,63,0.08); }

        .kb-default-badge { display:inline-flex; align-items:center; gap:5px; background:var(--kb-green-light); color:var(--kb-green-dark); font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.4px; }
        .kb-addr-name  { font-size:15px; font-weight:700; color:var(--kb-text); margin-bottom:2px; }
        .kb-addr-phone { font-size:13px; color:var(--kb-muted); margin-bottom:6px; }
        .kb-addr-line  { font-size:13px; color:#4b5563; line-height:1.5; }

        .kb-addr-actions { display:flex; align-items:center; gap:8px; margin-top:14px; flex-wrap:wrap; }
        .kb-action-btn { padding:7px 14px; border-radius:9px; border:1.5px solid var(--kb-border); background:#fff; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all .15s; color:var(--kb-text); }
        .kb-action-btn:hover { border-color:var(--kb-green); color:var(--kb-green); background:var(--kb-green-light); }
        .kb-action-btn.danger:hover { border-color:var(--kb-red); color:var(--kb-red); background:var(--kb-red-light); }
        .kb-action-btn:disabled { opacity:0.5; cursor:not-allowed; }

        .kb-addr-skeleton { height:130px; border-radius:16px; background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%); background-size:200% 100%; animation:kb-shimmer 1.4s infinite; }
        @keyframes kb-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .kb-addr-empty { text-align:center; padding:64px 24px; background:#fff; border-radius:16px; border:1.5px dashed var(--kb-border); }
        .kb-addr-empty-icon { font-size:52px; margin-bottom:14px; }
        .kb-addr-empty h3 { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:var(--kb-text); margin:0 0 8px; }
        .kb-addr-empty p  { font-size:14px; color:var(--kb-muted); margin:0 0 20px; }

        .kb-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:200; padding:16px; animation:kb-fade-in .15s ease; }
        @keyframes kb-fade-in { from{opacity:0} to{opacity:1} }
        .kb-modal { background:#fff; border-radius:20px; width:100%; max-width:480px; padding:24px; box-shadow:0 20px 60px rgba(0,0,0,0.18); animation:kb-slide-up .2s ease; max-height:90vh; overflow-y:auto; }
        @keyframes kb-slide-up { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        .kb-modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .kb-modal-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:var(--kb-text); }
        .kb-modal-close { background:var(--kb-gray); border:none; border-radius:8px; width:32px; height:32px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--kb-muted); transition:background .15s; }
        .kb-modal-close:hover { background:var(--kb-border); }

        .kb-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .kb-form-grid .full { grid-column:1/-1; }
        .kb-field { display:flex; flex-direction:column; gap:5px; }
        .kb-field label { font-size:11px; font-weight:700; color:var(--kb-muted); text-transform:uppercase; letter-spacing:0.5px; }
        .kb-field input { padding:10px 13px; border:1.5px solid var(--kb-border); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--kb-text); outline:none; transition:border-color .2s, box-shadow .2s; }
        .kb-field input:focus { border-color:var(--kb-green); box-shadow:0 0 0 3px rgba(26,158,63,0.1); }
        .kb-field input.error { border-color:var(--kb-red); }
        .kb-field-error { font-size:11px; color:var(--kb-red); font-weight:600; }

        .kb-modal-footer { display:flex; gap:10px; margin-top:22px; }
        .kb-cancel-btn { flex:1; padding:12px; border-radius:11px; border:1.5px solid var(--kb-border); background:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; color:var(--kb-muted); cursor:pointer; transition:all .15s; }
        .kb-cancel-btn:hover { border-color:var(--kb-text); color:var(--kb-text); }
        .kb-save-btn { flex:2; padding:12px; border-radius:11px; border:none; background:var(--kb-green); color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:800; cursor:pointer; transition:background .2s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .kb-save-btn:hover:not(:disabled) { background:var(--kb-green-dark); }
        .kb-save-btn:disabled { background:#9ca3af; cursor:not-allowed; }
        .kb-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.4); border-top-color:#fff; border-radius:50%; animation:kb-spin .7s linear infinite; }
        @keyframes kb-spin { to{transform:rotate(360deg)} }
      `}</style>

      <div className="kb-addr-page">
        <div className="kb-addr-wrapper">

          {/* Header */}
          <div className="kb-addr-header">
            <div>
              <button className="kb-back-btn" onClick={() => navigate(-1)}>← Back</button>
              <div className="kb-addr-title">📍 My Addresses</div>
            </div>
            <button className="kb-add-btn" onClick={openAddForm}>+ Add New</button>
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[1,2].map((i) => <div key={i} className="kb-addr-skeleton" />)}
            </div>

          ) : addresses.length === 0 ? (
            <div className="kb-addr-empty">
              <div className="kb-addr-empty-icon">🏠</div>
              <h3>No saved addresses</h3>
              <p>Add a delivery address to make checkout faster.</p>
              <button className="kb-add-btn" style={{ margin:"0 auto" }} onClick={openAddForm}>
                + Add Address
              </button>
            </div>

          ) : (
            <div className="kb-addr-list">
              {addresses.map((addr) => (
                <div key={addr.id} className={`kb-addr-card ${addr.default ? "is-default" : ""}`}>

                  {addr.default && <div className="kb-default-badge">✔ Default</div>}

                  <div className="kb-addr-name">{addr.name}</div>
                  <div className="kb-addr-phone">📞 {addr.phone}</div>
                  <div className="kb-addr-line">{addr.street}, {addr.city} — {addr.pincode}</div>

                  <div className="kb-addr-actions">
                    <button className="kb-action-btn" onClick={() => openEditForm(addr)}>✏️ Edit</button>

                    {!addr.default && (
                      <button className="kb-action-btn" onClick={() => handleSetDefault(addr.id)}>
                        ☆ Set as Default
                      </button>
                    )}

                    <button
                      className="kb-action-btn danger"
                      onClick={() => handleDelete(addr.id)}
                      disabled={deletingId === addr.id}
                    >
                      {deletingId === addr.id ? "Removing…" : "🗑️ Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="kb-modal-overlay" onClick={closeForm}>
          <div className="kb-modal" onClick={(e) => e.stopPropagation()}>

            <div className="kb-modal-header">
              <div className="kb-modal-title">{editTarget ? "✏️ Edit Address" : "📍 Add New Address"}</div>
              <button className="kb-modal-close" onClick={closeForm}>✕</button>
            </div>

            <div className="kb-form-grid">
              <div className="kb-field full">
                <label>Full Name</label>
                <input name="name" placeholder="e.g. Rahul Sharma" value={form.name} onChange={handleChange} className={errors.name ? "error" : ""} />
                {errors.name && <span className="kb-field-error">⚠ {errors.name}</span>}
              </div>

              <div className="kb-field">
                <label>Phone</label>
                <input name="phone" placeholder="10-digit mobile" value={form.phone} onChange={handleChange} maxLength={10} className={errors.phone ? "error" : ""} />
                {errors.phone && <span className="kb-field-error">⚠ {errors.phone}</span>}
              </div>

              <div className="kb-field">
                <label>Pincode</label>
                <input name="pincode" placeholder="6-digit pincode" value={form.pincode} onChange={handleChange} maxLength={6} className={errors.pincode ? "error" : ""} />
                {errors.pincode && <span className="kb-field-error">⚠ {errors.pincode}</span>}
              </div>

              <div className="kb-field full">
                <label>Street Address</label>
                <input name="street" placeholder="House no., building, street" value={form.street} onChange={handleChange} className={errors.street ? "error" : ""} />
                {errors.street && <span className="kb-field-error">⚠ {errors.street}</span>}
              </div>

              <div className="kb-field full">
                <label>City</label>
                <input name="city" placeholder="e.g. Delhi" value={form.city} onChange={handleChange} className={errors.city ? "error" : ""} />
                {errors.city && <span className="kb-field-error">⚠ {errors.city}</span>}
              </div>
            </div>

            <div className="kb-modal-footer">
              <button className="kb-cancel-btn" onClick={closeForm}>Cancel</button>
              <button className="kb-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? <><div className="kb-spinner" /> Saving…</> : editTarget ? "Update Address" : "Save Address"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}