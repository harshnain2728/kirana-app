import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import api from "../config/axios";
import { useNavigate } from "react-router-dom";
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

export default function Checkout() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const user   = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  // ── Address state ──
  const [savedAddresses,  setSavedAddresses]  = useState([]);
  const [selectedAddrId,  setSelectedAddrId]  = useState(null);  // id of picked saved address
  const [useNewAddress,   setUseNewAddress]   = useState(false); // toggle manual form
  const [saveNewAddress,  setSaveNewAddress]  = useState(false); // checkbox to save new addr
  const [form,            setForm]            = useState(EMPTY_FORM);
  const [errors,          setErrors]          = useState({});

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading,       setLoading]       = useState(false);
  const [addrLoading,   setAddrLoading]   = useState(true);

  const deliveryFee = cartTotal >= 199 ? 0 : 30;
  const grandTotal  = cartTotal + deliveryFee;

  // ── Load saved addresses on mount ──
  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    api.get(`/addresses/user/${userId}`)
      .then((res) => {
        const list = res.data || [];
        setSavedAddresses(list);
        // ✅ Auto-select default address
        const def = list.find((a) => a.default) || list[0];
        if (def) setSelectedAddrId(def.id);
        // If no saved addresses, show manual form automatically
        if (list.length === 0) setUseNewAddress(true);
      })
      .catch(() => setUseNewAddress(true))
      .finally(() => setAddrLoading(false));
  }, [userId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ── Get the address object to send with order ──
  const getDeliveryAddress = () => {
    if (!useNewAddress) {
      const addr = savedAddresses.find((a) => a.id === selectedAddrId);
      return addr
        ? { name: addr.name, phone: addr.phone, street: addr.street, city: addr.city, pincode: addr.pincode }
        : null;
    }
    return form;
  };

  const handlePlaceOrder = async () => {
    // Validate if using new address form
    if (useNewAddress) {
      const validationErrors = validate(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error("Please fix the errors before placing your order.");
        return;
      }
    } else if (!selectedAddrId) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (!userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // ✅ Save new address to address book if checkbox ticked
      if (useNewAddress && saveNewAddress) {
        await api.post(`/addresses?userId=${userId}`, form);
        toast.success("Address saved to your address book!");
      }

      const orderData = {
        items: cartItems,
        address: getDeliveryAddress(),
        total: grandTotal,
        paymentMethod,
      };

      await api.post(`/orders?userId=${userId}`, orderData);
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/success");
    } catch (error) {
      const message = error.response?.data?.message || "Order failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
          .kb-empty-checkout { font-family:'DM Sans',sans-serif; min-height:60vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:#6b7280; }
          .kb-empty-checkout h3 { font-size:20px; font-weight:700; color:#1a1a1a; margin:0; }
          .kb-empty-checkout p  { font-size:14px; margin:0; }
          .kb-empty-go-btn { margin-top:8px; background:#1a9e3f; color:#fff; border:none; padding:11px 26px; border-radius:11px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; }
        `}</style>
        <div className="kb-empty-checkout">
          <span style={{ fontSize: 60 }}>🛒</span>
          <h3>Nothing to checkout</h3>
          <p>Add some items to your cart first.</p>
          <button className="kb-empty-go-btn" onClick={() => navigate("/products")}>Browse Products</button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        :root {
          --kb-green: #1a9e3f; --kb-green-dark: #127a30;
          --kb-green-light: #e6f7ec; --kb-gray: #f7f8fa;
          --kb-border: #e5e7eb; --kb-text: #1a1a1a; --kb-muted: #6b7280;
          --kb-red: #ef4444;
        }
        .kb-checkout-page { font-family:'DM Sans',sans-serif; background:var(--kb-gray); min-height:100vh; padding:28px 16px 60px; }
        .kb-checkout-wrapper { max-width:960px; margin:0 auto; }
        .kb-checkout-title { font-family:'Syne',sans-serif; font-size:24px; font-weight:800; color:var(--kb-text); margin-bottom:24px; display:flex; align-items:center; gap:10px; }

        /* Steps */
        .kb-steps { display:flex; align-items:center; gap:0; margin-bottom:28px; }
        .kb-step  { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:600; color:var(--kb-muted); }
        .kb-step.active { color:var(--kb-green); }
        .kb-step.done   { color:var(--kb-green); }
        .kb-step-num { width:26px; height:26px; border-radius:50%; background:var(--kb-border); color:var(--kb-muted); font-size:12px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .kb-step.active .kb-step-num { background:var(--kb-green); color:#fff; }
        .kb-step.done   .kb-step-num { background:var(--kb-green-light); color:var(--kb-green); }
        .kb-step-line { flex:1; height:2px; background:var(--kb-border); margin:0 8px; max-width:48px; }

        /* Layout */
        .kb-checkout-grid { display:grid; grid-template-columns:1fr 340px; gap:20px; align-items:start; }
        @media (max-width:768px) { .kb-checkout-grid { grid-template-columns:1fr; } }

        /* Card */
        .kb-card { background:#fff; border-radius:16px; border:1.5px solid var(--kb-border); margin-bottom:16px; overflow:hidden; }
        .kb-card-head { padding:14px 20px; border-bottom:1px solid #f0f0f0; display:flex; align-items:center; gap:10px; }
        .kb-card-head-icon { width:32px; height:32px; border-radius:8px; background:var(--kb-green-light); color:var(--kb-green); font-size:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .kb-card-head h3 { font-size:15px; font-weight:700; color:var(--kb-text); margin:0; }
        .kb-card-head-action { margin-left:auto; font-size:13px; font-weight:600; color:var(--kb-green); cursor:pointer; background:none; border:none; font-family:'DM Sans',sans-serif; }
        .kb-card-body { padding:20px; }

        /* ── Saved address cards ── */
        .kb-addr-list { display:flex; flex-direction:column; gap:10px; }
        .kb-addr-option {
          display:flex; align-items:flex-start; gap:12px;
          padding:14px 16px; border:1.5px solid var(--kb-border);
          border-radius:12px; cursor:pointer; transition:all .2s;
        }
        .kb-addr-option:hover   { border-color:var(--kb-green); background:var(--kb-green-light); }
        .kb-addr-option.selected { border-color:var(--kb-green); background:var(--kb-green-light); }
        .kb-addr-option input[type="radio"] { accent-color:var(--kb-green); margin-top:3px; flex-shrink:0; }
        .kb-addr-option-body { flex:1; }
        .kb-addr-option-name  { font-size:14px; font-weight:700; color:var(--kb-text); }
        .kb-addr-option-phone { font-size:12px; color:var(--kb-muted); margin-bottom:2px; }
        .kb-addr-option-line  { font-size:13px; color:#4b5563; }
        .kb-default-pill { font-size:10px; font-weight:700; background:var(--kb-green); color:#fff; padding:2px 8px; border-radius:20px; margin-left:8px; }

        /* Add new address toggle */
        .kb-new-addr-toggle {
          display:flex; align-items:center; gap:10px;
          padding:13px 16px; border:1.5px dashed var(--kb-border);
          border-radius:12px; cursor:pointer; transition:all .2s;
          font-size:14px; font-weight:600; color:var(--kb-muted);
        }
        .kb-new-addr-toggle:hover  { border-color:var(--kb-green); color:var(--kb-green); }
        .kb-new-addr-toggle.active { border-color:var(--kb-green); color:var(--kb-green); background:var(--kb-green-light); }

        /* Form */
        .kb-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:16px; }
        .kb-form-grid .full { grid-column:1/-1; }
        .kb-field { display:flex; flex-direction:column; gap:5px; }
        .kb-field label { font-size:12px; font-weight:600; color:var(--kb-muted); text-transform:uppercase; letter-spacing:0.5px; }
        .kb-field input { padding:10px 13px; border:1.5px solid var(--kb-border); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--kb-text); outline:none; transition:border-color .2s, box-shadow .2s; }
        .kb-field input:focus { border-color:var(--kb-green); box-shadow:0 0 0 3px rgba(26,158,63,0.1); }
        .kb-field input.error { border-color:var(--kb-red); }
        .kb-field-error { font-size:11px; color:var(--kb-red); font-weight:500; }

        /* Save address checkbox */
        .kb-save-addr-check {
          display:flex; align-items:center; gap:8px;
          margin-top:14px; font-size:13px; font-weight:600;
          color:var(--kb-text); cursor:pointer;
        }
        .kb-save-addr-check input { accent-color:var(--kb-green); width:16px; height:16px; cursor:pointer; }

        /* Payment */
        .kb-payment-options { display:flex; flex-direction:column; gap:10px; }
        .kb-payment-option { display:flex; align-items:center; gap:12px; padding:13px 16px; border:1.5px solid var(--kb-border); border-radius:12px; cursor:pointer; transition:border-color .2s, background .2s; }
        .kb-payment-option.selected { border-color:var(--kb-green); background:var(--kb-green-light); }
        .kb-payment-option input[type="radio"] { accent-color:var(--kb-green); width:16px; height:16px; }
        .kb-payment-option-icon { font-size:22px; }
        .kb-payment-option-label { flex:1; }
        .kb-payment-option-label strong { display:block; font-size:14px; font-weight:600; color:var(--kb-text); }
        .kb-payment-option-label span  { font-size:12px; color:var(--kb-muted); }
        .kb-payment-badge { font-size:10px; font-weight:700; background:var(--kb-green); color:#fff; padding:2px 8px; border-radius:20px; }

        /* Order items */
        .kb-checkout-item { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #f7f8fa; }
        .kb-checkout-item:last-child { border-bottom:none; }
        .kb-checkout-item-img { width:46px; height:46px; border-radius:8px; background:#f3f4f6; display:flex; align-items:center; justify-content:center; font-size:22px; overflow:hidden; flex-shrink:0; }
        .kb-checkout-item-img img { width:100%; height:100%; object-fit:cover; }
        .kb-checkout-item-info { flex:1; min-width:0; }
        .kb-checkout-item-name  { font-size:13px; font-weight:600; color:var(--kb-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .kb-checkout-item-qty   { font-size:12px; color:var(--kb-muted); }
        .kb-checkout-item-price { font-size:14px; font-weight:700; color:var(--kb-text); }

        /* Summary panel */
        .kb-summary-panel { background:#fff; border-radius:16px; border:1.5px solid var(--kb-border); padding:20px; position:sticky; top:90px; }
        .kb-summary-panel h3 { font-size:13px; font-weight:800; color:var(--kb-text); margin:0 0 16px; text-transform:uppercase; letter-spacing:0.6px; }
        .kb-summary-line { display:flex; justify-content:space-between; font-size:13px; color:#4b5563; margin-bottom:9px; }
        .kb-summary-line.green { color:var(--kb-green); font-weight:600; }
        .kb-summary-divider { height:1px; background:#f0f0f0; margin:12px 0; }
        .kb-summary-total { display:flex; justify-content:space-between; font-size:18px; font-weight:800; color:var(--kb-text); margin-bottom:6px; }
        .kb-summary-note  { font-size:11px; color:var(--kb-muted); margin-bottom:18px; }

        /* Place order button */
        .kb-place-btn { width:100%; padding:14px; background:var(--kb-green); color:#fff; border:none; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:800; cursor:pointer; transition:background .2s, transform .15s, box-shadow .2s; box-shadow:0 4px 16px rgba(26,158,63,0.3); display:flex; align-items:center; justify-content:center; gap:8px; letter-spacing:0.3px; }
        .kb-place-btn:hover:not(:disabled)  { background:var(--kb-green-dark); box-shadow:0 6px 22px rgba(26,158,63,0.38); }
        .kb-place-btn:active:not(:disabled) { transform:scale(0.98); }
        .kb-place-btn:disabled { background:#9ca3af; box-shadow:none; cursor:not-allowed; }
        .kb-spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,0.4); border-top-color:#fff; border-radius:50%; animation:kb-spin .7s linear infinite; flex-shrink:0; }
        @keyframes kb-spin { to{transform:rotate(360deg)} }
        .kb-safe-row { margin-top:14px; display:flex; align-items:center; justify-content:center; gap:6px; font-size:12px; color:var(--kb-muted); }
        .kb-delivery-badge { display:flex; align-items:center; gap:8px; background:var(--kb-green-light); border-radius:10px; padding:10px 14px; margin-bottom:16px; font-size:13px; font-weight:600; color:var(--kb-green-dark); }

        /* Skeleton */
        .kb-addr-skeleton { height:72px; border-radius:12px; background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%); background-size:200% 100%; animation:kb-shimmer 1.4s infinite; }
        @keyframes kb-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      <div className="kb-checkout-page">
        <div className="kb-checkout-wrapper">

          <div className="kb-checkout-title">🧾 Checkout</div>

          {/* Steps */}
          <div className="kb-steps">
            <div className="kb-step done">
              <div className="kb-step-num">✓</div> Cart
            </div>
            <div className="kb-step-line" />
            <div className="kb-step active">
              <div className="kb-step-num">2</div> Address & Payment
            </div>
            <div className="kb-step-line" />
            <div className="kb-step">
              <div className="kb-step-num">3</div> Confirmation
            </div>
          </div>

          <div className="kb-checkout-grid">

            {/* ── Left column ── */}
            <div>

              {/* ── Delivery Address Card ── */}
              <div className="kb-card">
                <div className="kb-card-head">
                  <div className="kb-card-head-icon">📍</div>
                  <h3>Delivery Address</h3>
                  {/* ✅ Manage addresses shortcut */}
                  <button
                    className="kb-card-head-action"
                    onClick={() => navigate("/addresses")}
                  >
                    Manage →
                  </button>
                </div>
                <div className="kb-card-body">

                  {addrLoading ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <div className="kb-addr-skeleton" />
                      <div className="kb-addr-skeleton" />
                    </div>

                  ) : (
                    <div className="kb-addr-list">

                      {/* ✅ Saved address options */}
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`kb-addr-option ${selectedAddrId === addr.id && !useNewAddress ? "selected" : ""}`}
                          onClick={() => { setSelectedAddrId(addr.id); setUseNewAddress(false); }}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddrId === addr.id && !useNewAddress}
                            onChange={() => { setSelectedAddrId(addr.id); setUseNewAddress(false); }}
                          />
                          <div className="kb-addr-option-body">
                            <div className="kb-addr-option-name">
                              {addr.name}
                              {addr.default && <span className="kb-default-pill">Default</span>}
                            </div>
                            <div className="kb-addr-option-phone">📞 {addr.phone}</div>
                            <div className="kb-addr-option-line">
                              {addr.street}, {addr.city} — {addr.pincode}
                            </div>
                          </div>
                        </label>
                      ))}

                      {/* ✅ Add new address toggle */}
                      <div
                        className={`kb-new-addr-toggle ${useNewAddress ? "active" : ""}`}
                        onClick={() => setUseNewAddress(!useNewAddress)}
                      >
                        <span>{useNewAddress ? "✕" : "+"}</span>
                        {useNewAddress ? "Cancel new address" : "Add a new address"}
                      </div>

                      {/* ✅ New address form — only shown when toggled */}
                      {useNewAddress && (
                        <>
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

                          {/* ✅ Save to address book checkbox */}
                          <label className="kb-save-addr-check">
                            <input
                              type="checkbox"
                              checked={saveNewAddress}
                              onChange={(e) => setSaveNewAddress(e.target.checked)}
                            />
                            Save this address to My Addresses
                          </label>
                        </>
                      )}

                    </div>
                  )}
                </div>
              </div>

              {/* ── Payment Method ── */}
              <div className="kb-card">
                <div className="kb-card-head">
                  <div className="kb-card-head-icon">💳</div>
                  <h3>Payment Method</h3>
                </div>
                <div className="kb-card-body">
                  <div className="kb-payment-options">
                    {[
                      { value: "COD",  icon: "💵", label: "Cash on Delivery",   sub: "Pay when your order arrives", badge: null },
                      { value: "UPI",  icon: "📱", label: "UPI",                sub: "GPay, PhonePe, Paytm & more", badge: "Instant" },
                      { value: "CARD", icon: "💳", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay",    badge: null },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`kb-payment-option ${paymentMethod === opt.value ? "selected" : ""}`}
                        onClick={() => setPaymentMethod(opt.value)}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.value}
                          checked={paymentMethod === opt.value}
                          onChange={() => setPaymentMethod(opt.value)}
                        />
                        <span className="kb-payment-option-icon">{opt.icon}</span>
                        <div className="kb-payment-option-label">
                          <strong>{opt.label}</strong>
                          <span>{opt.sub}</span>
                        </div>
                        {opt.badge && <span className="kb-payment-badge">{opt.badge}</span>}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Order Items ── */}
              <div className="kb-card">
                <div className="kb-card-head">
                  <div className="kb-card-head-icon">🛍️</div>
                  <h3>Items ({cartCount})</h3>
                </div>
                <div className="kb-card-body">
                  {cartItems.map((item) => (
                    <div key={item.id} className="kb-checkout-item">
                      <div className="kb-checkout-item-img">
                        {item.imageUrl || item.img
                          ? <img src={item.imageUrl || item.img} alt={item.name} />
                          : "🛍️"
                        }
                      </div>
                      <div className="kb-checkout-item-info">
                        <div className="kb-checkout-item-name">{item.name}</div>
                        <div className="kb-checkout-item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="kb-checkout-item-price">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Right: Summary ── */}
            <div className="kb-summary-panel">
              <h3>Price Details</h3>

              <div className="kb-delivery-badge">
                ⚡ Estimated delivery in <strong style={{ marginLeft: 4 }}>10–15 mins</strong>
              </div>

              <div className="kb-summary-line">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="kb-summary-line">
                <span>Delivery fee</span>
                {deliveryFee === 0
                  ? <span className="green">FREE 🎉</span>
                  : <span>₹{deliveryFee}</span>
                }
              </div>
              <div className="kb-summary-line">
                <span>Payment</span>
                <span>{paymentMethod}</span>
              </div>

              <div className="kb-summary-divider" />

              <div className="kb-summary-total">
                <span>To Pay</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="kb-summary-note">Inclusive of all taxes</div>

              <button
                className="kb-place-btn"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading
                  ? <><div className="kb-spinner" /> Placing order...</>
                  : <>Place Order · ₹{grandTotal.toFixed(2)} →</>
                }
              </button>

              <div className="kb-safe-row">🔒 Secure & encrypted checkout</div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}