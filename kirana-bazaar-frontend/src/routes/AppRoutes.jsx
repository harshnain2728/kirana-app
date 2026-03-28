import { Routes, Route, Navigate } from "react-router-dom";
import Home           from "../pages/Home";
import Login          from "../pages/Login";
import Register       from "../pages/Register";
import Products       from "../pages/Products";
import Cart           from "../pages/Cart";
import Checkout       from "../pages/Checkout";
import Success        from "../pages/Success";
import Profile        from "../pages/Profile";
import Orders         from "../pages/Orders";
import AdminLogin     from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts  from "../pages/admin/AdminProducts";
import AdminOrders    from "../pages/admin/AdminOrders";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token)                    return <Navigate to="/admin/login" replace />;
  if (user?.role !== "ADMIN")    return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Home />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />

      {/* Protected user */}
      <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
      <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path="/success"  element={<PrivateRoute><Success /></PrivateRoute>} />
      <Route path="/profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/orders"   element={<PrivateRoute><Orders /></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin/login"    element={<AdminLogin />} />
      <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/orders"   element={<AdminRoute><AdminOrders /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}