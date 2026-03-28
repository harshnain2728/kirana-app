import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  // ✅ Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      // Corrupted localStorage — start fresh
      localStorage.removeItem("cart");
    }
  }, []);

  // ✅ Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🛒 Add (or increase by 1)
  const addToCart = useCallback((product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
  }, []);

  // ➕ Increase qty
  const increaseQty = useCallback((id) => {
    setCart((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: prev[id].quantity + 1,
      },
    }));
  }, []);

  // ➖ Decrease qty (removes item if qty reaches 0)
  const decreaseQty = useCallback((id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (!updated[id]) return prev; // guard
      if (updated[id].quantity === 1) {
        delete updated[id];
      } else {
        updated[id] = { ...updated[id], quantity: updated[id].quantity - 1 };
      }
      return updated;
    });
  }, []);

  // ❌ Remove item entirely (regardless of qty)
  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }, []);

  // 🧹 Clear entire cart
  const clearCart = useCallback(() => setCart({}), []);

  // 📊 Derived values (computed once, not re-derived on every consumer render)
  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItems = Object.values(cart); // array form — useful for Cart page & Checkout

  return (
    <CartContext.Provider
      value={{
        cart,           // raw object — keyed by product.id
        cartItems,      // array — easier to map over
        cartCount,      // total item count for Header badge
        cartTotal,      // total price for Cart/Checkout
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart, // removes item fully (used in Cart page)
        clearCart,      // used after order is placed
      }}
    >
      {children}
    </CartContext.Provider>
  );
};