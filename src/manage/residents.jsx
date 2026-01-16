import { useState, useEffect } from "react";
import api from "../api/axios";
import AddOrUpdateResident from "../Forms/residentform";

export default function ManageResidents() {
  const [residents, setResidents] = useState([]);
  const [editingResident, setEditingResident] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [resResidents, resHostels] = await Promise.all([
        api.get("/residents"), // Protected route; token needed
        api.get("/hostels"),
      ]);

      // Ensure resident list is fully populated
      setResidents(
        resResidents.data.map((r) => ({
          ...r,
          hostel: r.hostel || null,
        }))
      );
      setHostels(resHostels.data);
    } catch (err) {
      console.error("Failed to fetch residents:", err);
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= HANDLE SAVE (CREATE / UPDATE) =================
  const handleSave = (resident) => {
    const exists = residents.find((r) => r._id === resident._id);
    if (exists) {
      setResidents((prev) =>
        prev.map((r) => (r._id === resident._id ? resident : r))
      );
    } else {
      setResidents((prev) => [...prev, resident]);
    }
    setShowForm(false);
    setEditingResident(null);
  };

  // ================= HANDLE DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resident?")) return;

    try {
      await api.delete(`/residents/${id}`);
      setResidents((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete resident:", err);
      alert(err.response?.data?.message || "Failed to delete resident");
    }
  };

  // ================= LOADING / ERROR =================
  if (loading)
    return <p className="p-6 text-center">Loading data...</p>;

  if (error)
    return <p className="p-6 text-center text-red-600">{error}</p>;

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Residents</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              ➕ Add Resident
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Hostel</th>
                  <th className="p-2">Room / Bed</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Check-In</th>
                  <th className="p-2">Check-Out</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((r) => (
                  <tr key={r._id} className="text-center border-t">
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.hostel?.name || "—"}</td>
                    <td className="p-2">
                      {r.roomNumber || "—"} / {r.bedNumber || "—"}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          r.status === "active" ? "bg-green-500" : "bg-gray-500"
                        }`}
                      >
                        {r.status || "Inactive"}
                      </span>
                    </td>
                    <td className="p-2">
                      {r.checkIn
                        ? new Date(r.checkIn).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-2">
                      {r.checkOut
                        ? new Date(r.checkOut).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => {
                          setEditingResident(r);
                          setShowForm(true);
                        }}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
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
        <AddOrUpdateResident
          residentData={editingResident}
          hostels={hostels}
          onSubmit={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingResident(null);
          }}
        />
      )}
    </div>
  );
}
