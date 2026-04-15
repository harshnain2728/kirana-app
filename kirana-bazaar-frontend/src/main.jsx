import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>

         {/* ✅ Toast Global Config */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: "10px",
              background: "#1a1a1a",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600"
            },
            success: {
              style: {
                background: "#1a9e3f",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />

        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);