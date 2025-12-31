import React, { useState } from "react";

// Mock data for the client
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
  checkIn: "2026-01-01",
  checkOut: "2026-03-01",
  pricePerMonth: 12000,
  amountPaid: 18000,
  status: "Confirmed",
  description: "Spacious rooms, WiFi, security, meals included.",
  image: "https://via.placeholder.com/400x200",
  availableLoan: 5000,
};

export default function ClientDashboard() {
  const [user, setUser] = useState(mockUser);
  const [profilePhoto, setProfilePhoto] = useState(mockUser.profilePhoto);

  // Calculate finance details
  const checkInDate = new Date(mockBooking.checkIn);
  const checkOutDate = new Date(mockBooking.checkOut);
  const monthsDiff = (checkOutDate.getFullYear() - checkInDate.getFullYear()) * 12 + (checkOutDate.getMonth() - checkInDate.getMonth()) + 1;
  const totalAmount = monthsDiff * mockBooking.pricePerMonth;
  const remainingAmount = totalAmount - mockBooking.amountPaid;

  const handleProfileChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile updated (mock)");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Client Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <a href="#" className="hover:bg-gray-700 p-2 rounded">Home</a>
          <a href="#bookings" className="hover:bg-gray-700 p-2 rounded">My Booking</a>
          <a href="#finance" className="hover:bg-gray-700 p-2 rounded">Finance</a>
          <a href="#profile" className="hover:bg-gray-700 p-2 rounded">Profile</a>
          <a href="#notifications" className="hover:bg-gray-700 p-2 rounded">Notifications</a>
          <a href="#" className="hover:bg-gray-700 p-2 rounded">Logout</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6 space-y-6">
        {/* Welcome Panel */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your bookings and finances.</p>
        </section>

        {/* Booked Hostel */}
        <section id="bookings" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">My Booking</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="bg-gray-50 rounded-2xl shadow p-4 flex-1">
              <img src={mockBooking.image} alt={mockBooking.hostelName} className="rounded-xl w-full h-48 object-cover mb-4" />
              <h3 className="text-lg font-semibold">{mockBooking.hostelName}</h3>
              <p className="text-gray-600">{mockBooking.location}</p>
              <p className="mt-2">Room Type: {mockBooking.roomType}</p>
              <p>Check-in: {mockBooking.checkIn}</p>
              <p>Check-out: {mockBooking.checkOut}</p>
              <p className="mt-2 text-gray-700">{mockBooking.description}</p>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-white ${mockBooking.status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}>{mockBooking.status}</span>
            </div>
          </div>
        </section>

        {/* Finance Section */}
        <section id="finance" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Finance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p>Price per Month: KES {mockBooking.pricePerMonth}</p>
              <p>Total Amount: KES {totalAmount}</p>
              <p>Amount Paid: KES {mockBooking.amountPaid}</p>
              <p>Remaining Amount: KES {remainingAmount}</p>
              <p>Available Loan: KES {mockBooking.availableLoan}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="mb-2 font-semibold">Payment Progress</p>
              <div className="w-full bg-gray-200 h-4 rounded-full">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${(mockBooking.amountPaid / totalAmount) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section id="profile" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={user.name} readOnly className="border p-3 rounded-xl bg-gray-100" />
            <input type="text" name="gender" value={user.gender} readOnly className="border p-3 rounded-xl bg-gray-100" />
            <input type="email" name="email" value={user.email} onChange={handleProfileChange} className="border p-3 rounded-xl" />
            <input type="text" name="contact" value={user.contact} onChange={handleProfileChange} className="border p-3 rounded-xl" />
            <div className="md:col-span-2">
              <label className="block mb-1">Profile Photo</label>
              {profilePhoto && <img src={profilePhoto} alt="Profile" className="w-32 h-32 object-cover rounded-full mb-2" />}
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition">Update Profile</button>
            </div>
          </form>
        </section>

        {/* Notifications Section */}
        <section id="notifications" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Upcoming check-in: {mockBooking.hostelName} on {mockBooking.checkIn}</li>
            <li>Next payment due soon</li>
            <li>Booking confirmed: {mockBooking.hostelName}</li>
          </ul>
        </section>
      </main>
    </div>
  );
}