import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const [adding, setAdding] = useState(false);

  const cartItem = cart[product.id];
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = async () => {
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 400);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .kb-card {
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid #f0f0f0;
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow .25s, transform .2s, border-color .2s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .kb-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.10);
          transform: translateY(-3px);
          border-color: #d1f0db;
        }

        /* Badge */
        .kb-card-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #fff3cd;
          color: #92620a;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .kb-card-badge.fresh {
          background: #e6f7ec;
          color: #1a7a35;
        }

        /* Image area */
        .kb-card-img-wrap {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          background: #f7f8fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          transition: transform .3s;
        }
        .kb-card:hover .kb-card-img-wrap { transform: scale(1.04); }
        .kb-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .kb-card-img-wrap .kb-img-fallback {
          font-size: 42px;
        }

        /* Info */
        .kb-card-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          text-align: center;
          margin-bottom: 2px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .kb-card-unit {
          font-size: 11px;
          color: #9ca3af;
          margin-bottom: 8px;
          text-align: center;
        }
        .kb-card-price-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }
        .kb-card-price {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .kb-card-mrp {
          font-size: 12px;
          color: #9ca3af;
          text-decoration: line-through;
        }
        .kb-card-discount {
          font-size: 11px;
          font-weight: 700;
          color: #16a34a;
          background: #dcfce7;
          padding: 1px 6px;
          border-radius: 6px;
        }

        /* Add button */
        .kb-card-add-btn {
          width: 100%;
          padding: 9px;
          background: #fff;
          border: 2px solid #1a9e3f;
          border-radius: 10px;
          color: #1a9e3f;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s, color .2s, transform .15s;
          letter-spacing: 0.2px;
        }
        .kb-card-add-btn:hover {
          background: #1a9e3f;
          color: #fff;
        }
        .kb-card-add-btn:active { transform: scale(0.97); }
        .kb-card-add-btn.adding {
          background: #1a9e3f;
          color: #fff;
          transform: scale(0.97);
        }

        /* Quantity stepper */
        .kb-card-stepper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #1a9e3f;
          border-radius: 10px;
          overflow: hidden;
        }
        .kb-stepper-btn {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
          padding: 6px 16px;
          cursor: pointer;
          transition: background .15s;
          line-height: 1;
        }
        .kb-stepper-btn:hover { background: rgba(0,0,0,0.15); }
        .kb-stepper-count {
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          min-width: 28px;
          text-align: center;
        }

        /* Out of stock */
        .kb-card-oos {
          width: 100%;
          padding: 9px;
          background: #f3f4f6;
          border-radius: 10px;
          color: #9ca3af;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
          cursor: not-allowed;
          border: 2px solid transparent;
        }

        /* Delivery tag */
        .kb-card-delivery {
          margin-top: 8px;
          font-size: 11px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .kb-card-delivery span { color: #1a9e3f; font-weight: 600; }
      `}</style>

      <div className="kb-card">

        {/* Badge */}
        {product.badge && (
          <div className={`kb-card-badge ${product.badge === "Fresh" ? "fresh" : ""}`}>
            {product.badge}
          </div>
        )}

        {/* Image */}
        <div className="kb-card-img-wrap">
          {product.imageUrl || product.img ? (
            <img
              src={product.imageUrl || product.img}
              alt={product.name}
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
          ) : null}
          <div className="kb-img-fallback" style={{ display: product.imageUrl || product.img ? "none" : "flex" }}>
            🛒
          </div>
        </div>

        {/* Info */}
        <div className="kb-card-name">{product.name}</div>
        <div className="kb-card-unit">{product.unit || product.quantity || "1 pc"}</div>

        {/* Price */}
        <div className="kb-card-price-row">
          <span className="kb-card-price">₹{product.price}</span>
          {product.mrp && product.mrp > product.price && (
            <>
              <span className="kb-card-mrp">₹{product.mrp}</span>
              <span className="kb-card-discount">
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
              </span>
            </>
          )}
        </div>

        {/* CTA */}
        {product.inStock === false ? (
          <div className="kb-card-oos">Out of Stock</div>
        ) : quantity === 0 ? (
          <button
            className={`kb-card-add-btn ${adding ? "adding" : ""}`}
            onClick={handleAdd}
          >
            {adding ? "Added ✓" : "+ Add"}
          </button>
        ) : (
          <div className="kb-card-stepper">
            <button className="kb-stepper-btn" onClick={() => removeFromCart(product.id)}>−</button>
            <span className="kb-stepper-count">{quantity}</span>
            <button className="kb-stepper-btn" onClick={() => addToCart(product)}>+</button>
          </div>
        )}

        {/* Delivery */}
        <div className="kb-card-delivery">
          ⚡ Delivery in <span>10 mins</span>
        </div>

      </div>
    </>
  );
}