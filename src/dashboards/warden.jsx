import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function WardenDashboard() {
  const [warden, setWarden] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [residents, setResidents] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchWardenData = async () => {
      try {
        const [wardenRes, hostelsRes, residentsRes] = await Promise.all([
          api.get("/wardens/me"),
          api.get("/wardens/my-hostels"),
          api.get("/wardens/my-residents"),
        ]);

        setWarden(wardenRes.data);
        setProfilePhoto(wardenRes.data.profilePhoto || "");
        setHostels(hostelsRes.data);
        setResidents(residentsRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load warden dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWardenData();
  }, []);

  /* ================= STATES ================= */
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

  /* ================= HELPERS ================= */
  const calculateTotalAmount = (resident) => {
    const checkIn = new Date(resident.checkIn);
    const checkOut = new Date(resident.checkOut);
    const months =
      (checkOut.getFullYear() - checkIn.getFullYear()) * 12 +
      (checkOut.getMonth() - checkIn.getMonth()) +
      1;
    return months * resident.amountPerMonth;
  };

  /* ================= PROFILE ================= */
  const handleProfileChange = (e) =>
    setWarden({ ...warden, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/wardens/me", {
        email: warden.email,
        contact: warden.contact,
        profilePhoto,
      });
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Warden Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {["Home", "My Hostels", "Residents", "Finance", "Notifications", "Profile"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="hover:bg-gray-700 p-2 rounded"
              >
                {item}
              </a>
            )
          )}
          <a href="#" className="hover:bg-gray-700 p-2 rounded">
            Logout
          </a>
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 bg-gray-100 p-6 space-y-6">
        {/* ---------- WELCOME ---------- */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold">Welcome, {warden.name}</h1>
          <p className="text-gray-600 mt-2">
            Here’s an overview of your hostels and residents.
          </p>
        </section>

        {/* ---------- HOSTELS ---------- */}
        <section id="myhostels" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">My Hostels</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostels.map((hostel) => (
              <div key={hostel._id} className="bg-gray-50 p-4 rounded-2xl shadow">
                <img
                  src={hostel.image}
                  alt={hostel.name}
                  className="rounded-xl w-full h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold">{hostel.name}</h3>
                <p className="text-gray-600">{hostel.location}</p>
                <p>Total Rooms: {hostel.totalRooms}</p>
                <p>Occupied Rooms: {hostel.occupiedRooms}</p>
                <p>
                  Vacant Rooms: {hostel.totalRooms - hostel.occupiedRooms}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- RESIDENTS ---------- */}
        <section id="residents" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Residents</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Name",
                    "Contact",
                    "Hostel",
                    "Room",
                    "Check-in",
                    "Check-out",
                    "Paid",
                    "Total",
                    "Balance",
                    "Loan",
                  ].map((h) => (
                    <th key={h} className="border p-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {residents.map((r) => {
                  const total = calculateTotalAmount(r);
                  const balance = total - r.amountPaid;

                  return (
                    <tr key={r._id} className="text-center">
                      <td className="border p-2">{r.name}</td>
                      <td className="border p-2">{r.contact}</td>
                      <td className="border p-2">{r.hostelName}</td>
                      <td className="border p-2">{r.roomType}</td>
                      <td className="border p-2">{r.checkIn}</td>
                      <td className="border p-2">{r.checkOut}</td>
                      <td className="border p-2">KES {r.amountPaid}</td>
                      <td className="border p-2">KES {total}</td>
                      <td className="border p-2">KES {balance}</td>
                      <td className="border p-2">KES {r.availableLoan}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- FINANCE ---------- */}
        <section id="finance" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Finance Overview</h2>

          {hostels.map((hostel) => {
            const hostelResidents = residents.filter(
              (r) => r.hostelId === hostel._id
            );

            const totalExpected = hostelResidents.reduce(
              (acc, r) => acc + calculateTotalAmount(r),
              0
            );
            const totalPaid = hostelResidents.reduce(
              (acc, r) => acc + r.amountPaid,
              0
            );

            return (
              <div key={hostel._id} className="bg-gray-50 p-4 rounded-2xl mb-4">
                <h3 className="font-semibold">{hostel.name}</h3>
                <p>Total Expected: KES {totalExpected}</p>
                <p>Total Paid: KES {totalPaid}</p>
                <p>Total Remaining: KES {totalExpected - totalPaid}</p>

                <div className="w-full bg-gray-200 h-4 rounded-full mt-2">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{
                      width: `${
                        totalExpected
                          ? (totalPaid / totalExpected) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>

        {/* ---------- PROFILE ---------- */}
        <section id="profile" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Profile</h2>

          <form
            onSubmit={handleProfileUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              value={warden.name}
              readOnly
              className="border p-3 rounded-xl bg-gray-100"
            />
            <input
              name="email"
              value={warden.email}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
            />
            <input
              name="contact"
              value={warden.contact}
              onChange={handleProfileChange}
              className="border p-3 rounded-xl"
            />

            <div className="md:col-span-2">
              {profilePhoto && (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-2 object-cover"
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
