import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

/* ================= ADMIN DASHBOARD ================= */
export default function AdminDashboard() {
    const navigate = useNavigate();

    const [hostels, setHostels] = useState([]);
    const [wardens, setWardens] = useState([]);
    const [residents, setResidents] = useState([]);

    const [adminProfile, setAdminProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    /* ================= FETCH DASHBOARD DATA ================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    hostelsRes,
                    wardensRes,
                    residentsRes,
                    profileRes,
                ] = await Promise.all([
                    api.get("/hostels"),
                    api.get("/wardens"),
                    api.get("/residents"),
                    api.get("/auth/me"), // 🔹 admin profile
                ]);

                setHostels(hostelsRes.data);
                setWardens(wardensRes.data);
                setResidents(residentsRes.data);

                setAdminProfile({
                    name: profileRes.data.name || "",
                    email: profileRes.data.email || "",
                    contact: profileRes.data.contact || "",
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* ================= PROFILE UPDATE ================= */
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put("/auth/me", adminProfile);
            alert("Profile updated successfully");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    /* ================= DERIVED STATS ================= */
    const totalRevenue = 0;

    const hostelsWithOccupancy = hostels.map((hostel) => {
        const occupiedRooms = residents.filter(
            (r) => r.hostel?._id === hostel._id
        ).length;

        const availableRooms =
            hostel.totalRooms != null
                ? Math.max(hostel.totalRooms - occupiedRooms, 0)
                : "N/A";

        return { ...hostel, occupiedRooms, availableRooms };
    });

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

                {/* HOSTELS TABLE */}
                <section className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-bold mb-4">Hostels & Occupancy</h2>
                    <table className="w-full border">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Location</th>
                                <th className="border p-2">Total Rooms</th>
                                <th className="border p-2">Warden</th>
                                <th className="border p-2">Occupied</th>
                                <th className="border p-2">Available</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hostelsWithOccupancy.map((h) => (
                                <tr key={h._id} className="text-center">
                                    <td className="border p-2">{h.name}</td>
                                    <td className="border p-2">{h.location || "-"}</td>
                                    <td className="border p-2">{h.totalRooms ?? "-"}</td>
                                    <td className="border p-2">
                                        {h.assignedWarden?.user?.name || "Unassigned"}
                                    </td>
                                    <td className="border p-2">{h.occupiedRooms}</td>
                                    <td className="border p-2">{h.availableRooms}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* PROFILE */}
                {adminProfile && (
                    <section className="bg-white rounded-2xl p-6 shadow">
                        <h2 className="text-xl font-bold mb-4">Admin Profile</h2>

                        <form
                            onSubmit={handleProfileUpdate}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <input
                                placeholder="Your new name🤓"
                                className="border p-2 rounded"
                                value={adminProfile.name}
                                onChange={(e) =>
                                    setAdminProfile({ ...adminProfile, name: e.target.value })
                                }
                                required
                            />

                            <input
                                placeholder="Your new email📩"
                                className="border p-2 rounded"
                                value={adminProfile.email}
                                onChange={(e) =>
                                    setAdminProfile({ ...adminProfile, email: e.target.value })
                                }
                                required
                            />

                            <input
                                placeholder="Your new contact📞"
                                className="border p-2 rounded"
                                value={adminProfile.contact}
                                onChange={(e) =>
                                    setAdminProfile({ ...adminProfile, contact: e.target.value })
                                }
                            />

                            <button
                                disabled={saving}
                                className="bg-orange-900 text-white py-2 rounded col-span-2 disabled:opacity-60"
                            >
                                {saving ? "Updating..." : "Update Profile"}
                            </button>
                        </form>
                    </section>
                )}
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

const Stat = ({ label, value }) => (
    <div className="bg-white p-5 rounded-2xl shadow text-center">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-bold text-xl">{value}</p>
    </div>
);
