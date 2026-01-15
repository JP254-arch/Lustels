import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

/* ================= ADMIN DASHBOARD ================= */
export default function AdminDashboard() {
    const navigate = useNavigate();

    const [hostels, setHostels] = useState([]);
    const [wardens, setWardens] = useState([]);
    const [residents, setResidents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Admin profile (still local / mock – backend support can be added later)
    const [adminProfile, setAdminProfile] = useState({
        username: "Admin",
        email: "admin@example.com",
        age: 35,
        contact: "0712345678",
    });

    /* ================= FETCH DASHBOARD DATA ================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hostelsRes, wardensRes, residentsRes] = await Promise.all([
                    api.get("/hostels"),
                    api.get("/wardens"),
                    api.get("/residents"),
                ]);

                setHostels(hostelsRes.data);
                setWardens(wardensRes.data);
                setResidents(residentsRes.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* ================= DERIVED STATS ================= */
    const totalRevenue = 0; // Payments not implemented yet

    const hostelsWithOccupancy = hostels.map((hostel) => {
        const occupiedRooms = residents.filter(
            (r) => r.hostel?._id === hostel._id
        ).length;

        const availableRooms =
            hostel.totalRooms != null
                ? Math.max(hostel.totalRooms - occupiedRooms, 0)
                : "N/A";

        return {
            ...hostel,
            occupiedRooms,
            availableRooms,
        };
    });

    /* ================= PROFILE UPDATE ================= */
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        alert("Admin profile update is currently local only.");
    };

    if (loading) {
        return <div className="p-10 text-center">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600">{error}</div>;
    }

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
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
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
                    <Stat label="Hostels" value={hostels.length} />
                    <Stat label="Wardens" value={wardens.length} />
                    <Stat label="Residents" value={residents.length} />
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

                {/* HOSTELS TABLE */}
                <section className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-bold mb-4">Hostels & Occupancy</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Location</th>
                                <th className="border p-2">Total Rooms</th>
                                <th className="border p-2">Assigned Warden</th>
                                <th className="border p-2">Occupied</th>
                                <th className="border p-2">Available</th>
                                <th className="border p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hostelsWithOccupancy.map((h) => (
                                <tr key={h._id} className="text-center border-t">
                                    <td className="border p-2">{h.name}</td>
                                    <td className="border p-2">{h.location || "-"}</td>
                                    <td className="border p-2">{h.totalRooms ?? "-"}</td>
                                    <td className="border p-2">
                                        {/* USE EXACT SAME METHOD AS HOSTELS PAGE */}
                                        {h.assignedWarden?.user?.name || "Unassigned"}
                                    </td>
                                    <td className="border p-2">{h.occupiedRooms}</td>
                                    <td className="border p-2">{h.availableRooms}</td>
                                    <td className="border p-2">{h.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* PROFILE */}
                <section className="bg-white rounded-2xl p-6 shadow">
                    <h2 className="text-xl font-bold mb-4">Admin Profile</h2>
                    <form
                        onSubmit={handleProfileUpdate}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <input
                            className="border p-2 rounded"
                            value={adminProfile.username}
                            onChange={(e) =>
                                setAdminProfile({ ...adminProfile, username: e.target.value })
                            }
                            required
                        />
                        <input
                            className="border p-2 rounded"
                            value={adminProfile.email}
                            onChange={(e) =>
                                setAdminProfile({ ...adminProfile, email: e.target.value })
                            }
                            required
                        />
                        <input
                            className="border p-2 rounded"
                            type="number"
                            value={adminProfile.age}
                            onChange={(e) =>
                                setAdminProfile({ ...adminProfile, age: e.target.value })
                            }
                            required
                        />
                        <input
                            className="border p-2 rounded"
                            value={adminProfile.contact}
                            onChange={(e) =>
                                setAdminProfile({ ...adminProfile, contact: e.target.value })
                            }
                            required
                        />
                        <button className="bg-orange-900 text-white py-2 rounded col-span-2">
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
