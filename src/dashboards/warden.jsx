import React, { useState } from "react";

// Mock data for the warden
const mockWarden = {
  name: "Mary Warden",
  email: "mary@example.com",
  contact: "0723456789",
  profilePhoto: "",
};

const mockHostels = [
  {
    id: 1,
    name: "Green View Hostel",
    location: "Nairobi",
    totalRooms: 10,
    occupiedRooms: 7,
    roomTypes: { single: 3, double: 4, shared: 3 },
    image: "https://via.placeholder.com/400x200",
  },
  {
    id: 2,
    name: "Sunrise Hostel",
    location: "Kisumu",
    totalRooms: 8,
    occupiedRooms: 5,
    roomTypes: { single: 2, double: 3, shared: 3 },
    image: "https://via.placeholder.com/400x200",
  },
];

const mockResidents = [
  {
    id: 1,
    name: "John Doe",
    contact: "0712345678",
    hostel: "Green View Hostel",
    roomType: "Single",
    checkIn: "2026-01-01",
    checkOut: "2026-03-01",
    amountPerMonth: 12000,
    amountPaid: 18000,
    availableLoan: 5000,
  },
  {
    id: 2,
    name: "Alice Smith",
    contact: "0723456789",
    hostel: "Sunrise Hostel",
    roomType: "Double",
    checkIn: "2026-02-01",
    checkOut: "2026-04-01",
    amountPerMonth: 10000,
    amountPaid: 20000,
    availableLoan: 3000,
  },
];

export default function WardenDashboard() {
  const [warden, setWarden] = useState(mockWarden);
  const [profilePhoto, setProfilePhoto] = useState(mockWarden.profilePhoto);

  const handleProfileChange = (e) => {
    setWarden({ ...warden, [e.target.name]: e.target.value });
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

  const calculateTotalAmount = (resident) => {
    const checkInDate = new Date(resident.checkIn);
    const checkOutDate = new Date(resident.checkOut);
    const monthsDiff = (checkOutDate.getFullYear() - checkInDate.getFullYear()) * 12 + (checkOutDate.getMonth() - checkInDate.getMonth()) + 1;
    return monthsDiff * resident.amountPerMonth;
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Warden Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <a href="#" className="hover:bg-gray-700 p-2 rounded">Home</a>
          <a href="#hostels" className="hover:bg-gray-700 p-2 rounded">My Hostels</a>
          <a href="#residents" className="hover:bg-gray-700 p-2 rounded">Residents</a>
          <a href="#finance" className="hover:bg-gray-700 p-2 rounded">Finance</a>
          <a href="#notifications" className="hover:bg-gray-700 p-2 rounded">Notifications</a>
          <a href="#profile" className="hover:bg-gray-700 p-2 rounded">Profile</a>
          <a href="#" className="hover:bg-gray-700 p-2 rounded">Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 space-y-6">
        {/* Welcome Panel */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold">Welcome, {warden.name}</h1>
          <p className="text-gray-600 mt-2">Here’s an overview of your hostels and residents.</p>
        </section>

        {/* Hostels Section */}
        <section id="hostels" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">My Hostels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockHostels.map((hostel) => (
              <div key={hostel.id} className="bg-gray-50 p-4 rounded-2xl shadow">
                <img src={hostel.image} alt={hostel.name} className="rounded-xl w-full h-48 object-cover mb-4" />
                <h3 className="text-lg font-semibold">{hostel.name}</h3>
                <p className="text-gray-600">{hostel.location}</p>
                <p>Total Rooms: {hostel.totalRooms}</p>
                <p>Occupied Rooms: {hostel.occupiedRooms}</p>
                <p>Vacant Rooms: {hostel.totalRooms - hostel.occupiedRooms}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Residents Section */}
        <section id="residents" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Residents</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Contact</th>
                  <th className="border p-2">Hostel</th>
                  <th className="border p-2">Room Type</th>
                  <th className="border p-2">Check-in</th>
                  <th className="border p-2">Check-out</th>
                  <th className="border p-2">Amount Paid</th>
                  <th className="border p-2">Total Amount</th>
                  <th className="border p-2">Remaining Amount</th>
                  <th className="border p-2">Loan</th>
                </tr>
              </thead>
              <tbody>
                {mockResidents.map((resident) => {
                  const totalAmount = calculateTotalAmount(resident);
                  const remainingAmount = totalAmount - resident.amountPaid;
                  return (
                    <tr key={resident.id} className="text-center border-t">
                      <td className="border p-2">{resident.name}</td>
                      <td className="border p-2">{resident.contact}</td>
                      <td className="border p-2">{resident.hostel}</td>
                      <td className="border p-2">{resident.roomType}</td>
                      <td className="border p-2">{resident.checkIn}</td>
                      <td className="border p-2">{resident.checkOut}</td>
                      <td className="border p-2">KES {resident.amountPaid}</td>
                      <td className="border p-2">KES {totalAmount}</td>
                      <td className="border p-2">KES {remainingAmount}</td>
                      <td className="border p-2">KES {resident.availableLoan}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Finance Section */}
        <section id="finance" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Finance Overview</h2>
          {mockHostels.map((hostel) => {
            const hostelResidents = mockResidents.filter(r => r.hostel === hostel.name);
            const totalExpected = hostelResidents.reduce((acc, r) => acc + calculateTotalAmount(r), 0);
            const totalPaid = hostelResidents.reduce((acc, r) => acc + r.amountPaid, 0);
            const totalRemaining = totalExpected - totalPaid;

            return (
              <div key={hostel.id} className="p-4 bg-gray-50 rounded-2xl mb-4">
                <h3 className="font-semibold">{hostel.name}</h3>
                <p>Total Expected: KES {totalExpected}</p>
                <p>Total Paid: KES {totalPaid}</p>
                <p>Total Remaining: KES {totalRemaining}</p>
                <div className="w-full bg-gray-200 h-4 rounded-full mt-2">
                  <div className="bg-green-500 h-4 rounded-full" style={{ width: `${(totalPaid / totalExpected) * 100}%` }}></div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Profile Section */}
        <section id="profile" className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={warden.name} readOnly className="border p-3 rounded-xl bg-gray-100" />
            <input type="email" name="email" value={warden.email} onChange={handleProfileChange} className="border p-3 rounded-xl" />
            <input type="text" name="contact" value={warden.contact} onChange={handleProfileChange} className="border p-3 rounded-xl" />
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
            <li>New booking received for Green View Hostel</li>
            <li>Check-in due for John Doe on 2026-01-01</li>
            <li>Check-out due for Alice Smith on 2026-04-01</li>
          </ul>
        </section>
      </main>
    </div>
  );
}