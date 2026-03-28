import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true); // true on first load
  const navigate = useNavigate();

  // Rehydrate from localStorage on app start
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser  = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupted storage — clear it
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token",    authToken);
    localStorage.setItem("user",     JSON.stringify(userData));
    localStorage.setItem("userName", userData.name || userData.email || "");
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    navigate("/login");
  }, [navigate]);

  // Check if user has a specific role e.g. isRole("ADMIN")
  const isRole = (role) => user?.role === role;
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isLoggedIn,
      isRole,
      login,
      logout,
    }}>
      {/* Don't render children until localStorage is checked */}
      {!loading && children}
    </AuthContext.Provider>
  );
};