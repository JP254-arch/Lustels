import React, { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log({ name, email, password, passwordConfirm });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* Left Side: Info */}
        <div className="text-gray-800 space-y-6 px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-rose-700 leading-tight">
            Welcome to <span className="text-indigo-700">Lustels</span> 📚
          </h1>
          <p className="text-lg text-gray-600">
            Join Lustels and manage hostels, students, rooms, and fees with ease.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Manage hostels faster</li>
            <li>🔥 Smart dashboard for every role</li>
            <li>💬 Connect with staff and students</li>
          </ul>
        </div>

        {/* Right Side: Registration Form */}
        <div className="bg-rose-100/80 shadow-2xl rounded-2xl p-8 backdrop-blur-sm border border-rose-200">
          <div className="flex justify-center mb-6">
            <img src="/src/assets/logo.jpeg" alt="Lustels Logo" className="h-16 w-16 rounded-full shadow-lg" />
          </div>

          <h2 className="text-3xl font-extrabold text-center text-rose-700 mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jp Mbaga"
                className="mt-2 w-full rounded-lg border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 focus:ring-opacity-50 p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jp@lustels.com"
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-lg border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 focus:ring-opacity-50 p-3"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-700 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-rose-600 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
