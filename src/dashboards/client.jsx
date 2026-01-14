import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, bookingRes] = await Promise.all([
          api.get("/residents/me"),
          api.get("/bookings/my-booking"),
        ]);

        setUser(userRes.data);
        setProfilePhoto(userRes.data.profilePhoto || "");
        setBooking(bookingRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  /* ================= FINANCE CALCULATIONS ================= */
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);

  const months =
    (checkOut.getFullYear() - checkIn.getFullYear()) * 12 +
    (checkOut.getMonth() - checkIn.getMonth()) +
    1;

  const totalPayable = months * booking.pricePerMonth;
  const balance = totalPayable - booking.amountPaid;
  const paymentProgress = Math.min(
    (booking.amountPaid / totalPayable) * 100,
    100
  );

  const paymentStatus =
    balance <= 0
      ? "Paid"
      : booking.amountPaid > 0
      ? "Partially Paid"
      : "Unpaid";

  /* ================= HANDLERS ================= */
  const handleProfileChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/residents/me", {
        name: user.name,
        gender: user.gender,
        email: user.email,
        contact: user.contact,
        profilePhoto,
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

        <button className="mt-auto bg-red-600 hover:bg-red-700 transition py-2 rounded-lg">
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6 space-y-8">
        {/* ---------- WELCOME ---------- */}
        <section className="bg-white rounded-2xl p-6 shadow">
          <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-gray-600 mt-1">
            Here is a summary of your stay and finances
          </p>
        </section>

        {/* ---------- QUICK STATS ---------- */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Monthly Rent", value: `KES ${booking.pricePerMonth}` },
            { label: "Total Payable", value: `KES ${totalPayable}` },
            { label: "Paid", value: `KES ${booking.amountPaid}` },
            { label: "Balance", value: `KES ${balance}` },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-5 rounded-2xl shadow text-center"
            >
              <p className="text-gray-500 text-sm">{item.label}</p>
              <p className="font-bold text-lg mt-1">{item.value}</p>
            </div>
          ))}
        </section>

        {/* ---------- HOSTEL DETAILS ---------- */}
        <section id="myhostel" className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">My Hostel</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src={booking.image}
              alt="Hostel"
              className="rounded-xl h-60 w-full object-cover"
            />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{booking.hostelName}</h3>
              <p className="text-gray-600">{booking.location}</p>

              <p>
                Room: <strong>{booking.roomType}</strong> —{" "}
                {booking.roomNumber} / Bed {booking.bedNumber}
              </p>

              <p>
                Stay: {booking.checkIn} → {booking.checkOut}
              </p>

              <p>
                Warden: <strong>{booking.assignedWarden}</strong>
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {booking.amenities.map((a) => (
                  <span
                    key={a}
                    className="px-3 py-1 bg-slate-100 rounded-full text-sm"
                  >
                    {a}
                  </span>
                ))}
              </div>

              <span
                className={`inline-block mt-3 px-4 py-1 rounded-full text-white text-sm ${
                  booking.status === "Confirmed"
                    ? "bg-green-600"
                    : "bg-yellow-500"
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        </section>

        {/* ---------- PROFILE ---------- */}
        <section id="profile" className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Profile</h2>

          <form
            onSubmit={handleProfileSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="name"
              value={user.name}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
              placeholder="Name"
            />
            <select
              name="gender"
              value={user.gender}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              name="email"
              value={user.email}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
              placeholder="Email"
            />
            <input
              name="contact"
              value={user.contact}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
              placeholder="Contact"
            />

            <div className="md:col-span-2">
              {profilePhoto && (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-2 object-cover"
                />
              )}
              <input type="file" onChange={handlePhotoChange} />
            </div>

            <button className="md:col-span-2 bg-black text-white py-3 rounded-xl">
              Update Profile
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
