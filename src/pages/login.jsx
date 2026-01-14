import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Store auth info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "warden") navigate("/warden");
      else if (data.user.role === "resident") navigate("/resident");
      else navigate("/"); // fallback
    } catch (err) {
      console.error("Login failed:", err.response?.data || err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Login Form */}
        <div className="bg-rose-100/80 shadow-2xl rounded-2xl p-8 border">
          <div className="flex justify-center mb-6">
            <img src="/src/assets/logo.jpeg" alt="Lustels Logo" className="h-16 w-16 rounded-full" />
          </div>

          <h2 className="text-3xl font-extrabold text-center text-rose-700 mb-6">
            Login to Lustels
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-rose-600 text-white py-3 rounded-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm mt-4">
              No account?{" "}
              <Link to="/register" className="text-rose-600 font-medium hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>

        {/* Info / Welcome Text */}
        <div>
          <h1 className="text-4xl font-bold text-indigo-700">Welcome Back to Lustels</h1>
          <p className="mt-4 text-gray-600">
            Manage hostels, payments, and residents with ease.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
