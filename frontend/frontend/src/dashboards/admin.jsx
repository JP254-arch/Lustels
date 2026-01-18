import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiMenu, FiX } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faBuilding,
  faUserShield,
  faUsers,
  faUserPlus,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hostelsRes, wardensRes, residentsRes, profileRes] =
          await Promise.all([
            api.get("/hostels"),
            api.get("/wardens"),
            api.get("/residents"),
            api.get("/auth/me"),
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

  if (loading)
    return <div className="p-10 text-center">Loading dashboard...</div>;
  if (error)
    return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white flex flex-col p-6 z-50 transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8 md:mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="space-y-2 md:space-y-3 text-sm flex-1">
          <SidebarLink icon={faDashboard} label="Dashboard" onClick={() => navigate("/admin")} />
          <SidebarLink icon={faBuilding} label="Add Hostel" onClick={() => navigate("/hostel-form")} />
          <SidebarLink icon={faBuilding} label="Manage Hostels" onClick={() => navigate("/manage-hostels")} />
          <SidebarLink icon={faUserPlus} label="Add Warden" onClick={() => navigate("/warden-form")} />
          <SidebarLink icon={faUserShield} label="Manage Wardens" onClick={() => navigate("/manage-wardens")} />
          <SidebarLink icon={faUsers} label="Residents" onClick={() => navigate("/manage-clients")} />
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="mt-auto bg-red-600 hover:bg-red-700 py-2 rounded-lg w-full flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faUserShield} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-x-hidden">
        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <FiMenu size={28} />
          </button>
        </div>

        {/* HEADER */}
        <section className="bg-white rounded-2xl p-4 md:p-6 shadow">
          <h1 className="text-2xl font-bold hidden md:block">Admin Dashboard</h1>
          <span className="block px-2 py-1 text-purple-700 font-medium truncate">
            Welcome {user.name}
          </span>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={faBuilding} label="Hostels" value={hostels.length} />
          <Stat icon={faUserShield} label="Wardens" value={wardens.length} />
          <Stat icon={faUsers} label="Residents" value={residents.length} />
          <Stat icon={faMoneyBill} label="Revenue" value={`KES ${totalRevenue.toLocaleString()}`} />
        </section>

        {/* HOSTELS TABLE */}
        <section className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-x-auto">
          <h2 className="font-bold mb-4">Hostels & Occupancy</h2>
          <table className="min-w-[600px] w-full border text-center">
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
          <section className="bg-white rounded-2xl p-4 md:p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Admin Profile</h2>

            <form
              onSubmit={handleProfileUpdate}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                placeholder="Your new name"
                className="border p-2 rounded w-full"
                value={adminProfile.name}
                onChange={(e) =>
                  setAdminProfile({ ...adminProfile, name: e.target.value })
                }
                required
              />

              <input
                placeholder="Your new email"
                className="border p-2 rounded w-full"
                value={adminProfile.email}
                onChange={(e) =>
                  setAdminProfile({ ...adminProfile, email: e.target.value })
                }
                required
              />

              <input
                placeholder="Your new contact"
                className="border p-2 rounded w-full"
                value={adminProfile.contact}
                onChange={(e) =>
                  setAdminProfile({ ...adminProfile, contact: e.target.value })
                }
              />

              <button
                disabled={saving}
                className="bg-orange-900 text-white py-2 rounded col-span-1 md:col-span-2 w-full disabled:opacity-60"
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
const SidebarLink = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="text-left px-4 py-2 rounded-lg hover:bg-slate-700 w-full flex items-center gap-2"
  >
    <FontAwesomeIcon icon={icon} />
    {label}
  </button>
);

const Stat = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-2xl shadow text-center flex flex-col items-center justify-center gap-2">
    <FontAwesomeIcon icon={icon} size="2x" className="text-purple-600" />
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-bold text-xl">{value}</p>
  </div>
);
