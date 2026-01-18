import { useState, useEffect } from "react";
import api from "../api/axios";
import AddOrUpdateResident from "../Forms/residentform";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBuilding,
  faDoorClosed,
  faToggleOn,
  faCalendarAlt,
  faPlus,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

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
        api.get("/residents"),
        api.get("/hostels"),
      ]);

      setResidents(
        resResidents.data.map((r) => ({ ...r, hostel: r.hostel || null }))
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

  // ================= HANDLE SAVE =================
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

  if (loading)
    return <p className="p-6 text-center text-gray-600">Loading data...</p>;

  if (error)
    return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!showForm ? (
        <>
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Manage Residents</h1>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Resident
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">
                    <FontAwesomeIcon icon={faUser} /> Name
                  </th>
                  <th className="p-2 text-left">
                    <FontAwesomeIcon icon={faBuilding} /> Hostel
                  </th>
                  <th className="p-2 text-left">
                    <FontAwesomeIcon icon={faDoorClosed} /> Room / Bed
                  </th>
                  <th className="p-2 text-left">
                    <FontAwesomeIcon icon={faToggleOn} /> Status
                  </th>
                  <th className="p-2 text-left">
                    <FontAwesomeIcon icon={faCalendarAlt} /> Check-In
                  </th>
                  <th className="p-2 text-left">
                    <FontAwesomeIcon icon={faCalendarAlt} /> Check-Out
                  </th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {residents.map((r) => (
                  <tr
                    key={r._id}
                    className="text-center md:text-left border-t hover:bg-gray-50 transition"
                  >
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
                    <td className="p-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <button
                        onClick={() => {
                          setEditingResident(r);
                          setShowForm(true);
                        }}
                        className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                      >
                        <FontAwesomeIcon icon={faPen} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
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
