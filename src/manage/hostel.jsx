// =============================
// ManageHostels.jsx (Admin – Fully Aligned)
// =============================
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import AddOrUpdateHostel from "../Forms/hostelform";

// TEMP MOCK DATA (same structure as public pages)
const initialHostels = [
  {
    id: 1,
    name: "Green View Hostel",
    location: "Nairobi",
    address: "123 Nairobi Street",
    description: "Spacious rooms, WiFi, security, and meals included.",
    price: 12000,
    roomType: "single",
    totalRooms: 10,
    bedsPerRoom: 2,
    amenities: ["WiFi", "Water", "Security", "Meals"],
    status: "active",
    genderPolicy: "male",
    assignedWarden: "Warden A",
    imageUrl:
      "https://images.unsplash.com/photo-1633411187642-f84216917af1?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "Sunrise Hostel",
    location: "Kisumu",
    address: "456 Kisumu Road",
    description: "Affordable rooms with 24/7 water and electricity.",
    price: 10000,
    roomType: "shared",
    totalRooms: 8,
    bedsPerRoom: 4,
    amenities: ["Water", "Electricity", "Meals"],
    status: "inactive",
    genderPolicy: "female",
    assignedWarden: "Warden B",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1676321688630-9558e7d2be10?w=800&auto=format&fit=crop&q=60",
  },
];

export default function ManageHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);

  useEffect(() => {
    // Replace with API call later
    setHostels(initialHostels);
    setLoading(false);
  }, []);

  const handleAdd = () => {
    setSelectedHostel(null);
    setShowModal(true);
  };

  const handleEdit = (hostel) => {
    setSelectedHostel(hostel);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this hostel permanently?")) return;
    setHostels((prev) => prev.filter((h) => h.id !== id));
  };

  const handleToggleStatus = (id) => {
    setHostels((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, status: h.status === "active" ? "inactive" : "active" }
          : h
      )
    );
  };

  const handleFormSubmit = (data) => {
    if (selectedHostel) {
      setHostels((prev) =>
        prev.map((h) => (h.id === selectedHostel.id ? { ...h, ...data } : h))
      );
    } else {
      setHostels((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    setShowModal(false);
  };

  if (loading) return <p className="p-6">Loading hostels...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Manage Hostels</h1>
        <Button variant="success" onClick={handleAdd}>
          Add Hostel
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full border-collapse text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Room Type</th>
              <th className="border p-2">Rooms</th>
              <th className="border p-2">Beds / Room</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Warden</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hostels.map((hostel) => (
              <tr key={hostel.id}>
                <td className="border p-2">
                  <img
                    src={hostel.imageUrl}
                    alt={hostel.name}
                    className="w-20 h-16 object-cover mx-auto rounded"
                  />
                </td>
                <td className="border p-2">{hostel.name}</td>
                <td className="border p-2">{hostel.location}</td>
                <td className="border p-2 capitalize">{hostel.roomType}</td>
                <td className="border p-2">{hostel.totalRooms}</td>
                <td className="border p-2">{hostel.bedsPerRoom}</td>
                <td className="border p-2 capitalize">{hostel.genderPolicy}</td>
                <td className="border p-2 capitalize">{hostel.status}</td>
                <td className="border p-2">{hostel.assignedWarden}</td>
                <td className="border p-2">
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Button size="sm" onClick={() => handleEdit(hostel)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={hostel.status === "active" ? "warning" : "success"}
                      onClick={() => handleToggleStatus(hostel.id)}
                    >
                      {hostel.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(hostel.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedHostel ? "Update Hostel" : "Add Hostel"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddOrUpdateHostel
            hostelData={selectedHostel}
            onSubmit={handleFormSubmit}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
