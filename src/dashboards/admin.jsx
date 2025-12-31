import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= MOCK DATA ================= */
const mockHostels = [
    { id: 1, name: "Green View Hostel", location: "Nairobi", totalRooms: 10, bedsPerRoom: 2, assignedWarden: "Mary Warden", status: "active" },
    { id: 2, name: "Sunrise Hostel", location: "Kisumu", totalRooms: 8, bedsPerRoom: 4, assignedWarden: "John Warden", status: "inactive" },
];

const mockWardens = [
    { id: 1, name: "Mary Warden", email: "mary@example.com", assignedHostel: "Green View Hostel" },
    { id: 2, name: "John Warden", email: "john@example.com", assignedHostel: "Sunrise Hostel" },
];

const mockResidents = [
    { id: 1, name: "John Doe", hostel: "Green View Hostel", roomType: "Single", paid: 18000, loan: 5000 },
    { id: 2, name: "Alice Smith", hostel: "Sunrise Hostel", roomType: "Double", paid: 20000, loan: 3000 },
];

/* ================= ADMIN DASHBOARD ================= */
export default function AdminDashboard() {
    const navigate = useNavigate();

    // Admin profile state
    const [adminProfile, setAdminProfile] = useState({
        username: "Admin",
        email: "admin@example.com",
        age: 35,
        contact: "0712345678",
    });

    const totalRevenue = mockResidents.reduce((sum, r) => sum + r.paid, 0);

    // Hostels occupancy calculation
    const hostelsWithOccupancy = mockHostels.map((hostel) => {
        const occupiedRooms = mockResidents.filter(r => r.hostel === hostel.name).length;
        const availableRooms = hostel.totalRooms - occupiedRooms;
        return { ...hostel, occupiedRooms, availableRooms };
    });

    // Profile form submit
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        alert("Admin profile updated successfully (mock).");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* SIDEBAR */}
            <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col p-6">
                <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-3 text-sm">
                    <SidebarLink label="Dashboard" onClick={() => navigate("/admin")} />
                    <SidebarLink label="Add Hostel" onClick={() => navigate("/hostel-form")} />
                    <SidebarLink label="Manage Hostels" onClick={() => navigate("/manage-hostels")} />
                    <SidebarLink label="Add Warden" onClick={() => navigate("/warden-form")} />
                    <SidebarLink label="Manage Wardens" onClick={() => navigate("/manage-wardens")} />
                    <SidebarLink label="Residents" onClick={() => navigate("/manage-clients")} />
                </nav>
                <button
                    onClick={() => navigate("/login")}
                    className="mt-auto bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                >
                    Logout
                </button>
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-6 space-y-8">
                {/* HEADER */}
                <section className="bg-white rounded-2xl p-6 shadow">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                </section>

                {/* STATS */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Stat label="Hostels" value={mockHostels.length} />
                    <Stat label="Wardens" value={mockWardens.length} />
                    <Stat label="Residents" value={mockResidents.length} />
                    <Stat label="Revenue" value={`KES ${totalRevenue.toLocaleString()}`} />
                </section>

                {/* QUICK ACTIONS */}
                <section className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-bold mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                        <Action onClick={() => navigate("/hostel-form")} label="➕ Add Hostel" />
                        <Action onClick={() => navigate("/manage-hostels")} label="🛠 Manage Hostels" />
                        <Action onClick={() => navigate("/warden-form")} label="➕ Add Warden" />
                        <Action onClick={() => navigate("/manage-wardens")} label="🛠 Manage Wardens" />
                        <Action onClick={() => navigate("/manage-clients")} label="👥 Residents" />
                    </div>
                </section>

                {/* HOSTELS TABLE WITH OCCUPANCY */}
                <section className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-bold mb-4">Hostels & Occupancy</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Location</th>
                                <th className="border p-2">Total Rooms</th>
                                <th className="border p-2">Beds per Room</th>
                                <th className="border p-2">Assigned Warden</th>
                                <th className="border p-2">Occupied Rooms</th>
                                <th className="border p-2">Available Rooms</th>
                                <th className="border p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hostelsWithOccupancy.map((h) => (
                                <tr key={h.id} className="text-center border-t">
                                    <td className="border p-2">{h.name}</td>
                                    <td className="border p-2">{h.location}</td>
                                    <td className="border p-2">{h.totalRooms}</td>
                                    <td className="border p-2">{h.bedsPerRoom}</td>
                                    <td className="border p-2">{h.assignedWarden}</td>
                                    <td className="border p-2">{h.occupiedRooms}</td>
                                    <td className="border p-2">{h.availableRooms}</td>
                                    <td className="border p-2">{h.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* PROFILE EDIT SECTION */}
                <section className="bg-white rounded-2xl p-6 shadow">
                    <h2 className="text-xl font-bold mb-4">👤 Admin Profile</h2>
                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            Name
                            <input
                                type="text"
                                value={adminProfile.username}
                                onChange={(e) => setAdminProfile({ ...adminProfile, username: e.target.value })}
                                className="border p-2 rounded"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            Email
                            <input
                                type="email"
                                value={adminProfile.email}
                                onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                                className="border p-2 rounded"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            Age
                            <input
                                type="number"
                                value={adminProfile.age}
                                onChange={(e) => setAdminProfile({ ...adminProfile, age: e.target.value })}
                                className="border p-2 rounded"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            Contact Number
                            <input
                                type="text"
                                value={adminProfile.contact}
                                onChange={(e) => setAdminProfile({ ...adminProfile, contact: e.target.value })}
                                className="border p-2 rounded"
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            className="bg-orange-900 text-white px-4 py-2 rounded col-span-2"
                        >
                            Update Profile
                        </button>
                    </form>
                </section>

            </main>
        </div>
    );
}

/* ================= HELPERS ================= */
const SidebarLink = ({ label, onClick }) => (
    <button onClick={onClick} className="text-left px-4 py-2 rounded-lg hover:bg-slate-700">
        {label}
    </button>
);

const Action = ({ label, onClick }) => (
    <button onClick={onClick} className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800">
        {label}
    </button>
);

const Stat = ({ label, value }) => (
    <div className="bg-white p-5 rounded-2xl shadow text-center">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-bold text-xl">{value}</p>
    </div>
);
