import { useState } from "react";
import WardenForm from "../Forms/WardenForm";

// Mock data for demonstration
const mockWardens = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    assignedHostel: "Green View Hostel",
    contact: "0712345678",
    gender: "male",
    dob: "1990-05-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    assignedHostel: "Sunrise Hostel",
    contact: "0723456789",
    gender: "female",
    dob: "1992-08-22",
  },
];

// Mock hostel options
const mockHostels = [
  { id: 1, name: "Green View Hostel" },
  { id: 2, name: "Sunrise Hostel" },
  { id: 3, name: "Blue Horizon Hostel" },
];

export default function WardenManagement() {
  const [wardens, setWardens] = useState(mockWardens);
  const [editingWarden, setEditingWarden] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (warden) => {
    setEditingWarden(warden);
    setShowForm(true);
  };

  const handleFormSubmit = (updatedWarden) => {
    if (editingWarden) {
      // Update existing warden
      setWardens((prev) =>
        prev.map((w) => (w.id === editingWarden.id ? { ...w, ...updatedWarden } : w))
      );
    } else {
      // Add new warden
      setWardens((prev) => [...prev, { ...updatedWarden, id: prev.length + 1 }]);
    }
    setShowForm(false);
    setEditingWarden(null);
  };

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
                  <th className="border p-2">Assigned Hostel</th>
                  <th className="border p-2">Contact</th>
                  <th className="border p-2">Gender</th>
                  <th className="border p-2">Date of Birth</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wardens.map((warden) => (
                  <tr key={warden.id} className="text-center border-t">
                    <td className="border p-2">{warden.name}</td>
                    <td className="border p-2">{warden.email}</td>
                    <td className="border p-2">{warden.assignedHostel}</td>
                    <td className="border p-2">{warden.contact}</td>
                    <td className="border p-2">{warden.gender}</td>
                    <td className="border p-2">{warden.dob}</td>
                    <td className="border p-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-xl hover:bg-blue-500 transition"
                        onClick={() => handleEdit(warden)}
                      >
                        Edit
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
          hostelOptions={mockHostels}
        />
      )}
    </div>
  );
}
