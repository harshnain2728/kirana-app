import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/users/register", formData);

      if (res.data.success) {
        setMessage(
          "You have successfully created your account. Please click Login to continue."
        );
      } else {
        setMessage(res.data.message || "Account already exists");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {message && (
          <p className="text-center text-sm text-green-600 mb-4">
            {message}
          </p>
        )}

        <input
          name="name"
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}