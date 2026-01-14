import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "resident", // default
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        contact: form.contact,
      });

      // Redirect to login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold text-rose-700">Join Lustels</h1>
          <p className="mt-4 text-gray-600">Create your account and get started.</p>
        </div>

        {/* Form */}
        <div className="bg-rose-100/80 shadow-2xl rounded-2xl p-8 border">
          <div className="flex justify-center mb-6">
            <img src="/src/assets/logo.jpeg" className="h-16 w-16 rounded-full" />
          </div>

          <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
              required
            />
            <input
              name="contact"
              placeholder="Phone Number"
              value={form.contact}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
            >
              <option value="resident">Resident</option>
              <option value="warden">Warden</option>
            </select>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
              required
            />
            <input
              name="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              value={form.passwordConfirm}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-rose-600 text-white py-3 rounded-lg"
            >
              {loading ? "Creating account..." : "Register"}
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-rose-600 font-medium">Login</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
