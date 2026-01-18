import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBuilding,
  faMoneyBill,
  faUser,
  faBell,
  faBars,
  faX,
} from "@fortawesome/free-solid-svg-icons";

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/auth/me");
        const resident = res.data.user;
        setUser(resident);

        if (resident.residentProfile?.hostel?._id) {
          const hostelId = resident.residentProfile.hostel._id;
          const hostelRes = await api.get(`/hostels/${hostelId}`);
          setHostel(hostelRes.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const checkIn = user?.residentProfile?.checkIn ? new Date(user.residentProfile.checkIn) : null;
  const checkOut = user?.residentProfile?.checkOut ? new Date(user.residentProfile.checkOut) : null;
  const months = checkIn && checkOut ? (checkOut.getFullYear() - checkIn.getFullYear()) * 12 + (checkOut.getMonth() - checkIn.getMonth()) + 1 : 0;
  const monthlyRent = hostel?.monthlyPayment || 0;
  const totalPayable = months * monthlyRent;
  const paid = user?.residentProfile?.amountPaid || 0;
  const balance = totalPayable - paid;

  const handleProfileChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateRes = await api.put("/auth/me", {
        name: user.name,
        email: user.email,
        contact: user.contact,
      });
      setUser(updateRes.data.user);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const sidebarItems = [
    { label: "Dashboard", icon: faHome, id: "dashboard" },
    { label: "My Hostel", icon: faBuilding, id: "myhostel" },
    { label: "Payments", icon: faMoneyBill, id: "payments" },
    { label: "Loan", icon: faMoneyBill, id: "loan" },
    { label: "Profile", icon: faUser, id: "profile" },
    { label: "Notifications", icon: faBell, id: "notifications" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white flex flex-col p-6 z-50 transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Resident Panel</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FontAwesomeIcon icon={faX} size="lg" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 flex-1">
          {sidebarItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="hover:bg-gray-700 p-2 rounded flex items-center gap-2"
            >
              <FontAwesomeIcon icon={item.icon} />
              {item.label}
            </a>
          ))}
          <button
            className="bg-red-600 hover:bg-red-800 p-2 rounded flex items-center justify-center gap-2 mt-auto"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            <FontAwesomeIcon icon={faUser} /> Logout
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-x-hidden">
        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Resident Dashboard</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>

        {/* WELCOME */}
        <section className="bg-white rounded-2xl p-6 shadow">
          <h1 className="text-2xl text-purple-700 font-bold">
            Welcome back, {user?.name || "Resident"}
          </h1>
          <p className="text-gray-600 mt-1">Summary of your stay and finances</p>
        </section>

        {/* QUICK STATS */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: "Monthly Rent", value: `KES ${monthlyRent}`, color: "gray", icon: faMoneyBill },
            { label: "Months Stay", value: months, color: "gray", icon: faHome },
            { label: "Total Payable", value: `KES ${totalPayable}`, color: "gray", icon: faMoneyBill },
            { label: "Paid", value: `KES ${paid}`, color: paid > 0 ? "green" : "red", icon: faMoneyBill },
            { label: "Balance", value: `KES ${balance}`, color: balance > 0 ? "red" : "green", icon: faMoneyBill },
          ].map((item) => (
            <div key={item.label} className="bg-white p-5 rounded-2xl shadow flex flex-col items-center gap-2">
              <FontAwesomeIcon icon={item.icon} size="2x" className="text-purple-700" />
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

        {/* HOSTEL DETAILS */}
        <section id="myhostel" className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} /> My Hostel
          </h2>

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
                  Room: <strong>{user?.residentProfile?.roomType || "—"}</strong> — {user?.residentProfile?.roomNumber || "—"} / Bed {user?.residentProfile?.bedNumber || "—"}
                </p>
                <p>
                  Stay: {checkIn ? checkIn.toLocaleDateString() : "—"} → {checkOut ? checkOut.toLocaleDateString() : "—"}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {hostel.amenities?.length > 0
                    ? hostel.amenities.map((a) => (
                        <span key={a} className="px-3 py-1 bg-slate-100 rounded-full text-sm">{a}</span>
                      ))
                    : "No amenities assigned"}
                </div>

                <span
                  className={`inline-block mt-3 px-4 py-1 rounded-full text-white text-sm ${
                    user?.residentProfile?.status === "active" ? "bg-green-600" : "bg-gray-500"
                  }`}
                >
                  {user?.residentProfile?.status || "Inactive"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hostel assigned yet.</p>
          )}
        </section>

        {/* PROFILE */}
        <section id="profile" className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} /> Profile
          </h2>
          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={user?.name || ""}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
              placeholder="Name"
            />
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
            <button
              disabled={saving}
              className="md:col-span-2 bg-black text-white py-3 rounded-xl disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
