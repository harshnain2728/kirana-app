import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // ✅ Lazy initializer — reads localStorage once, avoids double render
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch {
      localStorage.removeItem("cart");
      return {};
    }
  });

  // ✅ Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Stable auth check — safe to use in dependency arrays
  const isLoggedIn = useCallback(() => !!localStorage.getItem("token"), []);

  // 🛒 Add (or increase by 1)
  const addToCart = useCallback((product) => {
    if (!isLoggedIn()) {
      toast.error("Please log in to add items to your cart.");
      window.location.href = "/login";
      return;
    }
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
    toast.success(`${product.name} added to cart!`);
  }, [isLoggedIn]);

  // ➕ Increase qty
  const increaseQty = useCallback((id) => {
    if (!isLoggedIn()) {
      toast.error("Please log in to continue.");
      window.location.href = "/login";
      return;
    }
    setCart((prev) => {
      if (!prev[id]) return prev; // ✅ guard against missing item
      return {
        ...prev,
        [id]: { ...prev[id], quantity: prev[id].quantity + 1 },
      };
    });
  }, [isLoggedIn]);

  // ➖ Decrease qty (removes item if qty reaches 0)
  const decreaseQty = useCallback((id) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      if (prev[id].quantity === 1) {
        toast(`${prev[id].name} removed from cart.`, { icon: "🗑️" });
        const { [id]: _, ...rest } = prev; // ✅ immutable delete
        return rest;
      }
      return { ...prev, [id]: { ...prev[id], quantity: prev[id].quantity - 1 } };
    });
  }, []);

  // ❌ Remove item entirely
  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      if (!prev[id]) return prev; // ✅ skip re-render if already gone
      toast(`${prev[id].name} removed from cart.`, { icon: "🗑️" });
      const { [id]: _, ...rest } = prev; // ✅ immutable delete
      return rest;
    });
  }, []);

  // 🧹 Clear entire cart
  const clearCart = useCallback(() => {
    setCart({});
    toast.success("Cart cleared.");
  }, []);

  // ✅ useMemo — recomputes only when cart changes
  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  // ✅ Memoized context value — prevents unnecessary consumer re-renders
  const value = useMemo(() => ({
    cart,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
  }), [cart, cartItems, cartCount, cartTotal, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};