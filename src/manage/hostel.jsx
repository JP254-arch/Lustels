import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import AddOrUpdateHostel from "../Forms/hostelform";

export default function ManageHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);

  useEffect(() => {
    const mockHostels = [
      {
        id: 1,
        name: "Green View Hostel",
        location: "Nairobi",
        address: "123 Nairobi Street",
        price: 12000,
        roomType: "single",
        totalRooms: 10,
        bedsPerRoom: 2,
        amenities: ["WiFi", "Water", "Security"],
        status: "active",
        genderPolicy: "male",
        assignedWarden: "Warden A",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWxzfGVufDB8fDB8fHww",
      },
      {
        id: 2,
        name: "Sunrise Hostel",
        location: "Kisumu",
        address: "456 Kisumu Road",
        price: 10000,
        roomType: "shared",
        totalRooms: 8,
        bedsPerRoom: 4,
        amenities: ["Water", "Electricity", "Meals"],
        status: "inactive",
        genderPolicy: "female",
        assignedWarden: "Warden B",
        imageUrl: "https://via.placeholder.com/150",
      },
    ];
    setHostels(mockHostels);
    setLoading(false);
  }, []);

  const handleEdit = (hostel) => {
    setSelectedHostel(hostel);
    setShowFormModal(true);
  };

  const handleAddNew = () => {
    setSelectedHostel(null);
    setShowFormModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      setHostels((prev) => prev.filter((h) => h.id !== id));
    }
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
      setHostels((prev) => [...prev, { ...data, id: prev.length + 1 }]);
    }
    setShowFormModal(false);
  };

  if (loading) return <p className="p-6">Loading hostels...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Manage Hostels</h2>
        <Button variant="success" onClick={handleAddNew}>
          ➕ Add Hostel
        </Button>
      </div>

      {/* MOBILE VIEW */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {hostels.map((hostel) => (
          <div key={hostel.id} className="bg-white rounded-xl shadow">
            <img
              src={hostel.imageUrl}
              alt={hostel.name}
              className="w-full h-40 object-cover rounded-t-xl"
            />

            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{hostel.name}</h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    hostel.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {hostel.status}
                </span>
              </div>

              <p><strong>Location:</strong> {hostel.location}</p>
              <p><strong>Room Type:</strong> {hostel.roomType}</p>
              <p><strong>Total Rooms:</strong> {hostel.totalRooms}</p>
              <p><strong>Beds / Room:</strong> {hostel.bedsPerRoom}</p>
              <p><strong>Warden:</strong> {hostel.assignedWarden}</p>

              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => handleEdit(hostel)}>Edit</Button>
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
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Room Type</th>
              <th className="border p-2">Rooms</th>
              <th className="border p-2">Beds / Room</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Warden</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {hostels.map((hostel) => (
              <tr key={hostel.id}>
                <td className="border p-2">
                  <img
                    src={hostel.imageUrl}
                    alt={hostel.name}
                    className="w-20 h-16 object-cover rounded mx-auto"
                  />
                </td>
                <td className="border p-2">{hostel.name}</td>
                <td className="border p-2">{hostel.location}</td>
                <td className="border p-2">{hostel.roomType}</td>
                <td className="border p-2">{hostel.totalRooms}</td>
                <td className="border p-2">{hostel.bedsPerRoom}</td>
                <td className="border p-2 capitalize">{hostel.status}</td>
                <td className="border p-2">{hostel.assignedWarden}</td>
                <td className="border p-2">
                  <div className="flex justify-center gap-2">
                    <Button size="sm" onClick={() => handleEdit(hostel)}>Edit</Button>
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
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedHostel ? "Update Hostel" : "Add New Hostel"}
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
