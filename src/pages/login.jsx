// 📁 src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api/auth/login`,
        { email, password }
      );

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500); // redirect to dashboard
    } catch (err) {
      console.error("❌ Login failed", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side: Form */}
        <div className="bg-rose-100/80 shadow-2xl rounded-2xl p-8 backdrop-blur-sm border border-rose-200">
          <div className="flex justify-center mb-6">
            <img
              src="/src/assets/logo.jpeg"
              alt="Lustels Logo"
              className="h-16 w-16 rounded-full shadow-lg"
            />
          </div>

          <h2 className="text-3xl font-extrabold text-center text-rose-700 mb-6">
            Login to Lustels
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@lustels.com"
                className="mt-2 w-full rounded-lg border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 focus:ring-opacity-50 p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-lg border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 focus:ring-opacity-50 p-3"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-200"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-rose-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-700 mt-4">
              Don’t have an account?{" "}
              <a href="/register" className="text-rose-600 hover:underline font-medium">
                Register
              </a>
            </p>
          </form>
        </div>

        {/* Right Side: Welcome Text */}
        <div className="text-gray-800 space-y-6 px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 leading-tight">
            Welcome Back to <span className="text-rose-600">Lustels</span> 📚
          </h1>
          <p className="text-lg text-gray-600">
            Login now and continue your hostel management journey — because organization never sleeps!
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>📖 Manage hostels, rooms, and students</li>
            <li>💡 Track fees and payments effortlessly</li>
            <li>💬 Keep in touch with staff and students</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Login;
