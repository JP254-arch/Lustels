import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import AddOrUpdateHostel from "../Forms/hostelform"; // Make sure this matches the export name

export default function ManageHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);

  // Mock data for demonstration
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
        imageUrl: "https://via.placeholder.com/400x200",
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
        imageUrl: "https://via.placeholder.com/400x200",
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
      setHostels(hostels.filter((h) => h.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setHostels(
      hostels.map((h) =>
        h.id === id ? { ...h, status: h.status === "active" ? "inactive" : "active" } : h
      )
    );
  };

  const handleFormSubmit = (data) => {
    if (selectedHostel) {
      // Update
      setHostels(hostels.map((h) => (h.id === selectedHostel.id ? { ...h, ...data } : h)));
    } else {
      // Add new
      const newHostel = { ...data, id: hostels.length + 1 };
      setHostels([...hostels, newHostel]);
    }
    setShowFormModal(false);
  };

  if (loading) return <p>Loading hostels...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Hostels</h2>
        <Button variant="success" onClick={handleAddNew}>
          ➕ Add Hostel
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="bg-gray-100 text-center">
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Room Type</th>
            <th>Total Rooms</th>
            <th>Beds per Room</th>
            <th>Status</th>
            <th>Assigned Warden</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {hostels.map((hostel) => (
            <tr key={hostel.id}>
              <td>{hostel.name}</td>
              <td>{hostel.location}</td>
              <td>{hostel.roomType}</td>
              <td>{hostel.totalRooms}</td>
              <td>{hostel.bedsPerRoom}</td>
              <td>{hostel.status}</td>
              <td>{hostel.assignedWarden}</td>
              <td className="flex justify-center gap-2">
                <Button variant="primary" size="sm" onClick={() => handleEdit(hostel)}>
                  Edit
                </Button>
                <Button
                  variant={hostel.status === "active" ? "warning" : "success"}
                  size="sm"
                  onClick={() => handleToggleStatus(hostel.id)}
                >
                  {hostel.status === "active" ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(hostel.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add / Update */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedHostel ? "Update Hostel" : "Add New Hostel"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddOrUpdateHostel hostelData={selectedHostel} onSubmit={handleFormSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
