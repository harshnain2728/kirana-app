import { useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../config/axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const deliveryFee = cartTotal >= 199 ? 0 : 30;
  const grandTotal = cartTotal + deliveryFee;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on type
  };

  // ── Validation ──
  const validate = () => {
    const newErrors = {};
    if (!address.name.trim())                          newErrors.name    = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(address.phone))          newErrors.phone   = "Enter a valid 10-digit phone";
    if (!address.street.trim())                        newErrors.street  = "Street address is required";
    if (!address.city.trim())                          newErrors.city    = "City is required";
    if (!/^\d{6}$/.test(address.pincode))              newErrors.pincode = "Enter a valid 6-digit pincode";
    return newErrors;
  };

  const handlePlaceOrder = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cartItems,
        address,
        total: grandTotal,
        paymentMethod,
      };
      const res = await api.post("/orders", orderData);
      console.log(res.data);
      clearCart();
      navigate("/success");
    } catch (error) {
      console.error("Order failed", error);
      setErrors({ submit: "Order failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
          .kb-empty-checkout {
            font-family: 'DM Sans', sans-serif;
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            color: #6b7280;
          }
          .kb-empty-checkout h3 { font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0; }
          .kb-empty-checkout p  { font-size: 14px; margin: 0; }
          .kb-empty-go-btn {
            margin-top: 8px;
            background: #1a9e3f; color: #fff; border: none;
            padding: 11px 26px; border-radius: 11px;
            font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
            cursor: pointer;
          }
        `}</style>
        <div className="kb-empty-checkout">
          <span style={{ fontSize: 60 }}>🛒</span>
          <h3>Nothing to checkout</h3>
          <p>Add some items to your cart first.</p>
          <button className="kb-empty-go-btn" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        :root {
          --kb-green: #1a9e3f;
          --kb-green-dark: #127a30;
          --kb-green-light: #e6f7ec;
          --kb-gray: #f7f8fa;
          --kb-border: #e5e7eb;
          --kb-text: #1a1a1a;
          --kb-muted: #6b7280;
        }

        .kb-checkout-page {
          font-family: 'DM Sans', sans-serif;
          background: var(--kb-gray);
          min-height: 100vh;
          padding: 28px 16px 60px;
        }

        .kb-checkout-wrapper {
          max-width: 960px;
          margin: 0 auto;
        }

        /* Title */
        .kb-checkout-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: var(--kb-text);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Steps bar */
        .kb-steps {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 28px;
        }
        .kb-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--kb-muted);
        }
        .kb-step.active { color: var(--kb-green); }
        .kb-step.done   { color: var(--kb-green); }
        .kb-step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--kb-border);
          color: var(--kb-muted);
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kb-step.active .kb-step-num { background: var(--kb-green); color: #fff; }
        .kb-step.done   .kb-step-num { background: var(--kb-green-light); color: var(--kb-green); }
        .kb-step-line {
          flex: 1;
          height: 2px;
          background: var(--kb-border);
          margin: 0 8px;
          max-width: 48px;
        }

        /* Layout */
        .kb-checkout-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .kb-checkout-grid { grid-template-columns: 1fr; }
        }

        /* Card */
        .kb-card {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid var(--kb-border);
          margin-bottom: 16px;
          overflow: hidden;
        }
        .kb-card-head {
          padding: 14px 20px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .kb-card-head-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--kb-green-light);
          color: var(--kb-green);
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kb-card-head h3 {
          font-size: 15px;
          font-weight: 700;
          color: var(--kb-text);
          margin: 0;
        }
        .kb-card-body { padding: 20px; }

        /* Form */
        .kb-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .kb-form-grid .full { grid-column: 1 / -1; }

        .kb-field { display: flex; flex-direction: column; gap: 5px; }
        .kb-field label {
          font-size: 12px;
          font-weight: 600;
          color: var(--kb-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .kb-field input {
          padding: 10px 13px;
          border: 1.5px solid var(--kb-border);
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--kb-text);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          background: #fff;
        }
        .kb-field input:focus {
          border-color: var(--kb-green);
          box-shadow: 0 0 0 3px rgba(26,158,63,0.1);
        }
        .kb-field input.error { border-color: #ef4444; }
        .kb-field-error {
          font-size: 11px;
          color: #ef4444;
          font-weight: 500;
        }

        /* Payment options */
        .kb-payment-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .kb-payment-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border: 1.5px solid var(--kb-border);
          border-radius: 12px;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .kb-payment-option.selected {
          border-color: var(--kb-green);
          background: var(--kb-green-light);
        }
        .kb-payment-option input[type="radio"] { accent-color: var(--kb-green); width: 16px; height: 16px; }
        .kb-payment-option-icon { font-size: 22px; }
        .kb-payment-option-label { flex: 1; }
        .kb-payment-option-label strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--kb-text);
        }
        .kb-payment-option-label span {
          font-size: 12px;
          color: var(--kb-muted);
        }
        .kb-payment-badge {
          font-size: 10px;
          font-weight: 700;
          background: var(--kb-green);
          color: #fff;
          padding: 2px 8px;
          border-radius: 20px;
        }

        /* Order items list */
        .kb-checkout-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f7f8fa;
        }
        .kb-checkout-item:last-child { border-bottom: none; }
        .kb-checkout-item-img {
          width: 46px;
          height: 46px;
          border-radius: 8px;
          background: #f3f4f6;
          object-fit: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .kb-checkout-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .kb-checkout-item-info { flex: 1; min-width: 0; }
        .kb-checkout-item-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--kb-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kb-checkout-item-qty { font-size: 12px; color: var(--kb-muted); }
        .kb-checkout-item-price { font-size: 14px; font-weight: 700; color: var(--kb-text); }

        /* Summary right panel */
        .kb-summary-panel {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid var(--kb-border);
          padding: 20px;
          position: sticky;
          top: 90px;
        }
        .kb-summary-panel h3 {
          font-size: 13px;
          font-weight: 800;
          color: var(--kb-text);
          margin: 0 0 16px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .kb-summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 9px;
        }
        .kb-summary-line.green { color: var(--kb-green); font-weight: 600; }
        .kb-summary-divider { height: 1px; background: #f0f0f0; margin: 12px 0; }
        .kb-summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: 800;
          color: var(--kb-text);
          margin-bottom: 6px;
        }
        .kb-summary-note {
          font-size: 11px;
          color: var(--kb-muted);
          margin-bottom: 18px;
        }

        /* Place order button */
        .kb-place-btn {
          width: 100%;
          padding: 14px;
          background: var(--kb-green);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 16px rgba(26,158,63,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.3px;
        }
        .kb-place-btn:hover:not(:disabled) { background: var(--kb-green-dark); box-shadow: 0 6px 22px rgba(26,158,63,0.38); }
        .kb-place-btn:active:not(:disabled) { transform: scale(0.98); }
        .kb-place-btn:disabled { background: #9ca3af; box-shadow: none; cursor: not-allowed; }

        .kb-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: kb-spin .7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes kb-spin { to { transform: rotate(360deg); } }

        .kb-submit-error {
          margin-top: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
        }

        .kb-safe-row {
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: var(--kb-muted);
        }

        /* Delivery badge */
        .kb-delivery-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--kb-green-light);
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 16px;
          font-size: 13px;
          font-weight: 600;
          color: var(--kb-green-dark);
        }
      `}</style>

      <div className="kb-checkout-page">
        <div className="kb-checkout-wrapper">

          <div className="kb-checkout-title">
            🧾 Checkout
          </div>

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

              {/* Delivery address */}
              <div className="kb-card">
                <div className="kb-card-head">
                  <div className="kb-card-head-icon">📍</div>
                  <h3>Delivery Address</h3>
                </div>
                <div className="kb-card-body">
                  <div className="kb-form-grid">
                    <div className="kb-field full">
                      <label>Full Name</label>
                      <input
                        name="name"
                        placeholder="e.g. Rahul Sharma"
                        value={address.name}
                        onChange={handleChange}
                        className={errors.name ? "error" : ""}
                      />
                      {errors.name && <span className="kb-field-error">⚠ {errors.name}</span>}
                    </div>

                    <div className="kb-field">
                      <label>Phone</label>
                      <input
                        name="phone"
                        placeholder="10-digit mobile"
                        value={address.phone}
                        onChange={handleChange}
                        maxLength={10}
                        className={errors.phone ? "error" : ""}
                      />
                      {errors.phone && <span className="kb-field-error">⚠ {errors.phone}</span>}
                    </div>

                    <div className="kb-field">
                      <label>Pincode</label>
                      <input
                        name="pincode"
                        placeholder="6-digit pincode"
                        value={address.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        className={errors.pincode ? "error" : ""}
                      />
                      {errors.pincode && <span className="kb-field-error">⚠ {errors.pincode}</span>}
                    </div>

                    <div className="kb-field full">
                      <label>Street Address</label>
                      <input
                        name="street"
                        placeholder="House no., building, street"
                        value={address.street}
                        onChange={handleChange}
                        className={errors.street ? "error" : ""}
                      />
                      {errors.street && <span className="kb-field-error">⚠ {errors.street}</span>}
                    </div>

                    <div className="kb-field full">
                      <label>City</label>
                      <input
                        name="city"
                        placeholder="e.g. Delhi"
                        value={address.city}
                        onChange={handleChange}
                        className={errors.city ? "error" : ""}
                      />
                      {errors.city && <span className="kb-field-error">⚠ {errors.city}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="kb-card">
                <div className="kb-card-head">
                  <div className="kb-card-head-icon">💳</div>
                  <h3>Payment Method</h3>
                </div>
                <div className="kb-card-body">
                  <div className="kb-payment-options">
                    {[
                      { value: "COD",  icon: "💵", label: "Cash on Delivery",  sub: "Pay when your order arrives", badge: null },
                      { value: "UPI",  icon: "📱", label: "UPI",               sub: "GPay, PhonePe, Paytm & more", badge: "Instant" },
                      { value: "CARD", icon: "💳", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay",    badge: null },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`kb-payment-option ${paymentMethod === opt.value ? "selected" : ""}`}
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

              {/* Order items (collapsible feel) */}
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
                      <div className="kb-checkout-item-price">₹{item.price * item.quantity}</div>
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
                <span>₹{cartTotal}</span>
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
                <span>₹{grandTotal}</span>
              </div>
              <div className="kb-summary-note">
                Inclusive of all taxes
              </div>

              <button
                className="kb-place-btn"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading
                  ? <><div className="kb-spinner" /> Placing order...</>
                  : <>Place Order · ₹{grandTotal} →</>
                }
              </button>

              {errors.submit && (
                <div className="kb-submit-error">⚠ {errors.submit}</div>
              )}

              <div className="kb-safe-row">
                🔒 Secure & encrypted checkout
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}