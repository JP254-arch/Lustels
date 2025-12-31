import React, { useState } from "react";

/* ---------------- MOCK DATA ---------------- */

const mockUser = {
  name: "John Doe",
  gender: "Male",
  email: "john@example.com",
  contact: "0712345678",
  profilePhoto: "",
};

const mockBooking = {
  hostelName: "Green View Hostel",
  location: "Nairobi",
  roomType: "Single",
  roomNumber: "A12",
  bedNumber: "1",
  checkIn: "2026-01-01",
  checkOut: "2026-03-01",
  pricePerMonth: 12000,
  amountPaid: 18000,
  assignedWarden: "Mr. Kamau",
  status: "Confirmed",
  amenities: ["WiFi", "Meals", "Security", "Water"],
  image: "https://via.placeholder.com/600x300",
  loanAmount: 5000,
};

/* ---------------- COMPONENT ---------------- */

export default function ClientDashboard() {
  const [user, setUser] = useState(mockUser);
  const [profilePhoto, setProfilePhoto] = useState(mockUser.profilePhoto);

  /* ---------- Finance Calculations ---------- */
  const checkIn = new Date(mockBooking.checkIn);
  const checkOut = new Date(mockBooking.checkOut);
  const months =
    (checkOut.getFullYear() - checkIn.getFullYear()) * 12 +
    (checkOut.getMonth() - checkIn.getMonth()) +
    1;

  const totalPayable = months * mockBooking.pricePerMonth;
  const balance = totalPayable - mockBooking.amountPaid;
  const paymentProgress = Math.min(
    (mockBooking.amountPaid / totalPayable) * 100,
    100
  );

  const paymentStatus =
    balance <= 0 ? "Paid" : mockBooking.amountPaid > 0 ? "Partially Paid" : "Unpaid";

  /* ---------- Handlers ---------- */
  const handleProfileChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully (mock)");
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
            { label: "Monthly Rent", value: `KES ${mockBooking.pricePerMonth}` },
            { label: "Total Payable", value: `KES ${totalPayable}` },
            { label: "Paid", value: `KES ${mockBooking.amountPaid}` },
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
        <section
          id="myhostel"
          className="bg-white rounded-2xl shadow p-6 overflow-hidden"
        >
          <h2 className="text-xl font-bold mb-4">My Hostel</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src={mockBooking.image}
              alt="Hostel"
              className="rounded-xl h-60 w-full object-cover"
            />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{mockBooking.hostelName}</h3>
              <p className="text-gray-600">{mockBooking.location}</p>

              <p>
                Room: <strong>{mockBooking.roomType}</strong> —{" "}
                {mockBooking.roomNumber} / Bed {mockBooking.bedNumber}
              </p>

              <p>
                Stay: {mockBooking.checkIn} → {mockBooking.checkOut}
              </p>

              <p>
                Warden: <strong>{mockBooking.assignedWarden}</strong>
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {mockBooking.amenities.map((a) => (
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
                  mockBooking.status === "Confirmed" ? "bg-green-600" : "bg-yellow-500"
                }`}
              >
                {mockBooking.status}
              </span>
            </div>
          </div>
        </section>

        {/* ---------- FINANCE ---------- */}
        <section id="payments" className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Finance Overview</h2>

          <p className="mb-2">
            Status:{" "}
            <span
              className={`font-semibold ${
                paymentStatus === "Paid"
                  ? "text-green-600"
                  : paymentStatus === "Partially Paid"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {paymentStatus}
            </span>
          </p>

          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="bg-green-600 h-4"
              style={{ width: `${paymentProgress}%` }}
            />
          </div>

          {mockBooking.loanAmount > 0 && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p>
                Active Loan: <strong>KES {mockBooking.loanAmount}</strong>
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Make Payment
            </button>
            <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg">
              Payment History
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
              Download Receipt
            </button>
          </div>
        </section>

        {/* ---------- PROFILE ---------- */}
        <section id="profile" className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Profile</h2>

          <form
            onSubmit={handleProfileSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
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

            <div className="md:col-span-2 flex flex-col items-start">
              {profilePhoto && (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-2 object-cover"
                />
              )}
              <input type="file" onChange={handlePhotoChange} />
            </div>

            <button className="md:col-span-2 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
              Update Profile
            </button>
          </form>
        </section>

        {/* ---------- NOTIFICATIONS ---------- */}
        <section id="notifications" className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <ul className="space-y-2 list-disc pl-5 text-gray-700">
            <li>Next payment reminder approaching</li>
            <li>Loan repayment update available</li>
            <li>Hostel notice from management</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
