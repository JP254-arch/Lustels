import { useState, useEffect } from "react";
import api from "../api/axios"; // Use your axios instance with JWT
import AddOrUpdateHostel from "../Forms/hostelform";

export default function ManageHostels() {
  const [hostels, setHostels] = useState([]);
  const [editingHostel, setEditingHostel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Backend should populate assignedWarden.user
        const resHostels = await api.get("/hostels");
        setHostels(resHostels.data);
      } catch (err) {
        console.error("Error fetching hostels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ---------------- HELPERS ----------------
  const getWardenName = (assignedWarden) =>
    assignedWarden?.user?.name || "Unassigned";

  // ---------------- HANDLE SAVE ----------------
  const handleSave = (hostel) => {
    const exists = hostels.find(h => h._id === hostel._id);
    if (exists) {
      setHostels(prev =>
        prev.map(h => (h._id === hostel._id ? hostel : h))
      );
    } else {
      setHostels(prev => [...prev, hostel]);
    }
    setShowForm(false);
    setEditingHostel(null);
  };

  // ---------------- HANDLE DELETE ----------------
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this hostel?")) return;
    try {
      await api.delete(`/hostels/${id}`);
      setHostels(prev => prev.filter(h => h._id !== id));
    } catch (err) {
      console.error("Failed to delete hostel:", err);
    }
  };

  // ---------------- HANDLE TOGGLE STATUS ----------------
  const handleToggleStatus = async (id) => {
    const hostel = hostels.find(h => h._id === id);
    if (!hostel) return;
    const updatedStatus = hostel.status === "active" ? "inactive" : "active";
    try {
      const res = await api.patch(`/hostels/${id}`, { status: updatedStatus });
      setHostels(prev =>
        prev.map(h => (h._id === id ? { ...h, status: res.data.status } : h))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading hostels...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Hostels</h1>
            <button
              onClick={() => { setEditingHostel(null); setShowForm(true); }}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            >
              ➕ Add Hostel
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Room Type</th>
                  <th className="p-2">Rooms</th>
                  <th className="p-2">Beds / Room</th>
                  <th className="p-2">Gender</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Warden</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hostels.map(h => (
                  <tr key={h._id} className="text-center border-t">
                    <td className="p-2">{h.name}</td>
                    <td className="p-2">{h.location}</td>
                    <td className="p-2 capitalize">{h.roomType}</td>
                    <td className="p-2">{h.totalRooms}</td>
                    <td className="p-2">{h.bedsPerRoom}</td>
                    <td className="p-2 capitalize">{h.genderPolicy}</td>
                    <td className="p-2">
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${h.status === "active" ? "bg-green-500" : "bg-gray-500"}`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="p-2">{getWardenName(h.assignedWarden)}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => { setEditingHostel(h); setShowForm(true); }}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(h._id)}
                        className={`px-3 py-1 rounded text-white ${h.status === "active" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}
                      >
                        {h.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(h._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <AddOrUpdateHostel
          hostelData={editingHostel}
          onSubmit={handleSave}
          onCancel={() => { setShowForm(false); setEditingHostel(null); }}
        />
      )}
    </div>
  );
}
