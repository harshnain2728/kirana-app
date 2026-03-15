import { useState } from "react";
import api from "../config/axios";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/users/login", {
        email,
        password
      });

       const response = res.data;

      if (response.success) {
        // save logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

        // redirect to home
        window.location.replace("/");
        return;

      }
        
        setMessage(response.message || "Invalid credentials");
    } 
    catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        {message && (
          <p className="text-center text-sm text-red-600 mb-4">
            {message}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium"
        >
          Login
        </button>
      </form>
    </div>
  );
}