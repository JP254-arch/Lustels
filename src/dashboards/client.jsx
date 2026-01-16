import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await api.get("/residents/me");
        const resident = userRes.data;
        setUser(resident);

        if (resident.hostel) {
          const hostelId =
            typeof resident.hostel === "object" ? resident.hostel._id : resident.hostel;
          const hostelRes = await api.get(`/hostels/${hostelId}`);
          setHostel(hostelRes.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ================= LOADING / ERROR =================
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );

  // ================= DATE & FINANCE =================
  const checkIn = user?.checkIn ? new Date(user.checkIn) : null;
  const checkOut = user?.checkOut ? new Date(user.checkOut) : null;

  const months =
    checkIn && checkOut
      ? (checkOut.getFullYear() - checkIn.getFullYear()) * 12 +
        (checkOut.getMonth() - checkIn.getMonth()) +
        1
      : 0;

  const monthlyRent = hostel?.monthlyPayment || 0;
  const totalPayable = months * monthlyRent;
  const paid = user?.amountPaid || 0;
  const balance = totalPayable - paid;

  // ================= PROFILE =================
  const handleProfileChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/residents/me", {
        name: user.name,
        gender: user.gender,
        email: user.email,
        contact: user.contact,
      });
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col p-6">
        <h2 className="text-xl font-bold mb-8">Resident Panel</h2>

        <nav className="space-y-3 text-sm">
          {["Dashboard", "My Hostel", "Payments", "Loan", "Profile", "Notifications"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition"
              >
                {item}
              </a>
            )
          )}
        </nav>

        <button
          className="mt-auto bg-red-600 hover:bg-red-700 transition py-2 rounded-lg"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6 space-y-8">
        {/* ---------- WELCOME ---------- */}
        <section className="bg-white rounded-2xl p-6 shadow">
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name || "Resident"}
          </h1>
          <p className="text-gray-600 mt-1">
            Here is a summary of your stay and finances
          </p>
        </section>

        {/* ---------- QUICK STATS ---------- */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: "Monthly Rent", value: `KES ${monthlyRent}`, color: "gray" },
            { label: "Months Stay", value: months, color: "gray" },
            { label: "Total Payable", value: `KES ${totalPayable}`, color: "gray" },
            { label: "Paid", value: `KES ${paid}`, color: paid > 0 ? "green" : "red" },
            { label: "Balance", value: `KES ${balance}`, color: balance > 0 ? "red" : "green" },
          ].map((item) => (
            <div key={item.label} className="bg-white p-5 rounded-2xl shadow text-center">
              <p className="text-gray-500 text-sm">{item.label}</p>
              <p
                className={`font-bold text-lg mt-1 ${
                  item.color === "green"
                    ? "text-green-600"
                    : item.color === "red"
                    ? "text-red-600"
                    : "text-gray-800"
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* ---------- HOSTEL DETAILS ---------- */}
        <section id="myhostel" className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">My Hostel</h2>

          {hostel ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img
                src={hostel.imageUrl || "/placeholder.jpg"}
                alt={hostel.name}
                className="rounded-xl h-60 w-full object-cover"
              />

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{hostel.name}</h3>
                <p className="text-gray-600">{hostel.location || "—"}</p>
                <p>
                  Room: <strong>{user?.roomType || hostel.roomType || "—"}</strong> — {user?.roomNumber || "—"} / Bed {user?.bedNumber || "—"}
                </p>
                <p>
                  Stay: {checkIn ? checkIn.toLocaleDateString() : "—"} → {checkOut ? checkOut.toLocaleDateString() : "—"}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {hostel.amenities?.length > 0
                    ? hostel.amenities.map((a) => (
                        <span
                          key={a}
                          className="px-3 py-1 bg-slate-100 rounded-full text-sm"
                        >
                          {a}
                        </span>
                      ))
                    : "No amenities assigned"}
                </div>

                <span
                  className={`inline-block mt-3 px-4 py-1 rounded-full text-white text-sm ${
                    user?.status === "active" ? "bg-green-600" : "bg-gray-500"
                  }`}
                >
                  {user?.status || "Inactive"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hostel assigned yet.</p>
          )}
        </section>

        {/* ---------- PROFILE ---------- */}
        <section id="profile" className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={user?.name || ""}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
              placeholder="Name"
            />
            <select
              name="gender"
              value={user?.gender || ""}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
            >
              <option>Other</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              name="email"
              value={user?.email || ""}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
              placeholder="Email"
            />
            <input
              name="contact"
              value={user?.contact || ""}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
              placeholder="Contact"
            />

            <button className="md:col-span-2 bg-black text-white py-3 rounded-xl">
              Update Profile
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
