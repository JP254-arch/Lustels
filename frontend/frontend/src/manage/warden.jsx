import { useState, useEffect } from "react";
import api from "../api/axios";
import WardenForm from "../Forms/WardenForm";

export default function WardenManagement() {
  const [wardens, setWardens] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingWarden, setEditingWarden] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ================= FETCH WARDENS & HOSTELS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [wardensRes, hostelsRes] = await Promise.all([
          api.get("/wardens"),  // Backend populates 'user' & 'assignedHostels'
          api.get("/hostels")
        ]);

        setWardens(wardensRes.data);
        setHostels(hostelsRes.data.filter(h => h.status === "active"));
      } catch (err) {
        console.error("Failed to fetch wardens/hostels:", err);
        setError("Failed to load wardens or hostels.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= HANDLE FORM =================
  const handleEdit = (warden) => {
    setEditingWarden(warden);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this warden permanently?")) return;
    try {
      await api.delete(`/wardens/${id}`);
      setWardens(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete warden.");
    }
  };

  const handleFormSubmit = async (wardenData) => {
    try {
      if (editingWarden) {
        const res = await api.put(`/wardens/${editingWarden._id}`, wardenData);
        setWardens(prev =>
          prev.map(w => (w._id === editingWarden._id ? res.data.warden : w))
        );
      } else {
        const res = await api.post("/wardens", wardenData);
        setWardens(prev => [...prev, res.data.warden]);
      }

      setShowForm(false);
      setEditingWarden(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save warden.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading wardens and hostels...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!showForm ? (
        <div>
          <h1 className="text-2xl font-bold mb-6">Manage Wardens</h1>
          <button
            className="mb-4 bg-orange-900 text-white px-4 py-2 rounded-xl hover:bg-orange-800 transition"
            onClick={() => setShowForm(true)}
          >
            ➕ Add Warden
          </button>

          <div className="overflow-x-auto bg-white p-4 rounded-2xl shadow">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-100">
                <tr className="text-center">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Assigned Hostel(s)</th>
                  <th className="border p-2">Contact</th>
                  <th className="border p-2">Gender</th>
                  <th className="border p-2">DOB</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wardens.map(w => (
                  <tr key={w._id} className="text-center border-t">
                    <td className="border p-2">{w.user?.name || "—"}</td>
                    <td className="border p-2">{w.user?.email || "—"}</td>
                    <td className="border p-2">
                      {w.assignedHostels?.map(h => h.name).join(", ") || "-"}
                    </td>
                    <td className="border p-2">{w.phone || "—"}</td>
                    <td className="border p-2">{w.gender || "—"}</td>
                    <td className="border p-2">
                      {w.dob ? new Date(w.dob).toLocaleDateString() : "—"}
                    </td>
                    <td className="border p-2 flex justify-center gap-2 flex-wrap">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-xl hover:bg-blue-500 transition"
                        onClick={() => handleEdit(w)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded-xl hover:bg-red-500 transition"
                        onClick={() => handleDelete(w._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <WardenForm
          wardenData={editingWarden}
          onSubmit={handleFormSubmit}
          hostelOptions={hostels}
        />
      )}
    </div>
  );
}
