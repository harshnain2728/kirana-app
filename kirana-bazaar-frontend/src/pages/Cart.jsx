import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cartItems, cartTotal, cartCount, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = cartTotal >= 199 ? 0 : 30;
  const savings = cartItems.reduce((sum, item) => {
    if (item.mrp && item.mrp > item.price) {
      return sum + (item.mrp - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .kb-cart-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f7f8fa;
          padding: 24px 16px;
        }

        .kb-cart-container {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .kb-cart-container { grid-template-columns: 1fr; }
        }

        /* ── Page title ── */
        .kb-cart-title {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .kb-cart-title-count {
          font-size: 13px;
          font-weight: 600;
          background: #e6f7ec;
          color: #1a7a35;
          padding: 3px 10px;
          border-radius: 20px;
        }

        /* ── Items panel ── */
        .kb-cart-items-panel {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #f0f0f0;
          overflow: hidden;
        }

        .kb-cart-panel-header {
          padding: 14px 18px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .kb-cart-panel-header h3 {
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }
        .kb-cart-clear-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          padding: 4px 10px;
          border-radius: 6px;
          transition: background .15s;
        }
        .kb-cart-clear-btn:hover { background: #fef2f2; }

        /* ── Cart item row ── */
        .kb-cart-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-bottom: 1px solid #f7f8fa;
          transition: background .15s;
        }
        .kb-cart-item:last-child { border-bottom: none; }
        .kb-cart-item:hover { background: #fafafa; }

        .kb-cart-item-img {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          object-fit: cover;
          background: #f3f4f6;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          overflow: hidden;
        }
        .kb-cart-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .kb-cart-item-info { flex: 1; min-width: 0; }
        .kb-cart-item-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .kb-cart-item-unit {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 4px;
        }
        .kb-cart-item-price-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .kb-cart-item-price {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .kb-cart-item-mrp {
          font-size: 12px;
          color: #9ca3af;
          text-decoration: line-through;
        }

        .kb-cart-item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Stepper */
        .kb-cart-stepper {
          display: flex;
          align-items: center;
          gap: 0;
          background: #f7f8fa;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }
        .kb-cart-stepper-btn {
          background: transparent;
          border: none;
          width: 34px;
          height: 34px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          color: #1a9e3f;
          transition: background .15s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }
        .kb-cart-stepper-btn:hover { background: #e6f7ec; }
        .kb-cart-stepper-count {
          min-width: 28px;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
        }

        .kb-cart-item-subtotal {
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .kb-cart-remove-btn {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          transition: color .15s;
        }
        .kb-cart-remove-btn:hover { color: #ef4444; }

        /* ── Free delivery bar ── */
        .kb-delivery-bar {
          margin: 0 18px 14px;
          padding-top: 14px;
        }
        .kb-delivery-bar-label {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 6px;
          display: flex;
          justify-content: space-between;
        }
        .kb-delivery-bar-label strong { color: #1a9e3f; }
        .kb-delivery-bar-track {
          height: 5px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }
        .kb-delivery-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #1a9e3f, #34d058);
          border-radius: 10px;
          transition: width .4s ease;
        }

        /* ── Empty state ── */
        .kb-cart-empty {
          text-align: center;
          padding: 60px 24px;
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #f0f0f0;
        }
        .kb-cart-empty-icon { font-size: 64px; margin-bottom: 16px; }
        .kb-cart-empty h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px;
        }
        .kb-cart-empty p {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 24px;
        }
        .kb-cart-empty-btn {
          background: #1a9e3f;
          color: #fff;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background .2s;
        }
        .kb-cart-empty-btn:hover { background: #127a30; }

        /* ── Summary panel ── */
        .kb-cart-summary {
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #f0f0f0;
          padding: 20px;
          position: sticky;
          top: 90px;
        }
        .kb-cart-summary h3 {
          font-size: 15px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .kb-summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 10px;
        }
        .kb-summary-row.savings { color: #16a34a; font-weight: 600; }
        .kb-summary-row.free { color: #16a34a; }
        .kb-summary-divider {
          height: 1px;
          background: #f0f0f0;
          margin: 12px 0;
        }
        .kb-summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 17px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 18px;
        }

        .kb-checkout-btn {
          width: 100%;
          padding: 14px;
          background: #1a9e3f;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(26,158,63,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .kb-checkout-btn:hover { background: #127a30; box-shadow: 0 6px 20px rgba(26,158,63,0.35); }
        .kb-checkout-btn:active { transform: scale(0.98); }

        .kb-summary-safe {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
          font-size: 12px;
          color: #9ca3af;
        }

        .kb-coupon-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .kb-coupon-input {
          flex: 1;
          padding: 9px 12px;
          border: 1.5px solid #e5e7eb;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
          transition: border-color .2s;
        }
        .kb-coupon-input:focus { border-color: #1a9e3f; }
        .kb-coupon-btn {
          background: #e6f7ec;
          color: #1a7a35;
          border: none;
          padding: 9px 14px;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s;
        }
        .kb-coupon-btn:hover { background: #d1f0db; }
      `}</style>

      <div className="kb-cart-page">
        <div className="kb-cart-container">

          {/* ── Left: Items ── */}
          <div>
            <div className="kb-cart-title">
              🛒 Your Cart
              {cartCount > 0 && (
                <span className="kb-cart-title-count">{cartCount} items</span>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="kb-cart-empty">
                <div className="kb-cart-empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything yet. Start shopping!</p>
                <button className="kb-cart-empty-btn" onClick={() => navigate("/products")}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="kb-cart-items-panel">
                <div className="kb-cart-panel-header">
                  <h3>Items in your cart</h3>
                  <button className="kb-cart-clear-btn" onClick={clearCart}>
                    🗑 Clear all
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div className="kb-cart-item" key={item.id}>
                    {/* Image */}
                    <div className="kb-cart-item-img">
                      {item.imageUrl || item.img
                        ? <img src={item.imageUrl || item.img} alt={item.name} />
                        : "🛍️"
                      }
                    </div>

                    {/* Info */}
                    <div className="kb-cart-item-info">
                      <div className="kb-cart-item-name">{item.name}</div>
                      <div className="kb-cart-item-unit">{item.unit || "1 pc"}</div>
                      <div className="kb-cart-item-price-row">
                        <span className="kb-cart-item-price">₹{item.price}</span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="kb-cart-item-mrp">₹{item.mrp}</span>
                        )}
                      </div>
                    </div>

                    {/* Right: stepper + subtotal + remove */}
                    <div className="kb-cart-item-right">
                      <div className="kb-cart-stepper">
                        <button className="kb-cart-stepper-btn" onClick={() => decreaseQty(item.id)}>−</button>
                        <span className="kb-cart-stepper-count">{item.quantity}</span>
                        <button className="kb-cart-stepper-btn" onClick={() => increaseQty(item.id)}>+</button>
                      </div>
                      <span className="kb-cart-item-subtotal">₹{item.price * item.quantity}</span>
                      <button className="kb-cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Free delivery progress bar */}
                {cartTotal < 199 && (
                  <div className="kb-delivery-bar">
                    <div className="kb-delivery-bar-label">
                      <span>Add <strong>₹{199 - cartTotal}</strong> more for free delivery</span>
                      <span>₹199</span>
                    </div>
                    <div className="kb-delivery-bar-track">
                      <div
                        className="kb-delivery-bar-fill"
                        style={{ width: `${Math.min((cartTotal / 199) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Summary ── */}
          {cartItems.length > 0 && (
            <div className="kb-cart-summary">
              <h3>Order Summary</h3>

              {/* Coupon */}
              <div className="kb-coupon-row">
                <input className="kb-coupon-input" placeholder="Enter coupon code" />
                <button className="kb-coupon-btn">Apply</button>
              </div>

              <div className="kb-summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              {savings > 0 && (
                <div className="kb-summary-row savings">
                  <span>🎉 You save</span>
                  <span>−₹{savings}</span>
                </div>
              )}
              <div className="kb-summary-row">
                <span>Delivery fee</span>
                {deliveryFee === 0
                  ? <span className="free">FREE 🎉</span>
                  : <span>₹{deliveryFee}</span>
                }
              </div>

              <div className="kb-summary-divider" />

              <div className="kb-summary-total">
                <span>Total</span>
                <span>₹{cartTotal + deliveryFee}</span>
              </div>

              <button className="kb-checkout-btn" onClick={() => navigate("/checkout")}>
                Proceed to Checkout →
              </button>

              <div className="kb-summary-safe">
                🔒 Safe & secure checkout
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}