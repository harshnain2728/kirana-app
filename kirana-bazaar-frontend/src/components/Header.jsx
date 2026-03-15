import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try{
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  }
  catch (error){
    console.error("INvalidd user data in localStorage");
    localStorage.removeItem("user");
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="text-xl font-bold text-green-600">
          Kirana Bazaar
        </Link>

        {!user ? (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Hi, {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}