import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import AddOrUpdateHostel from "../Forms/hostelform";

export default function ManageHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);

  // Fetch hostels from backend
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/hostels");
        setHostels(res.data);
      } catch (err) {
        console.error("Failed to fetch hostels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  const handleAdd = () => {
    setSelectedHostel(null);
    setShowModal(true);
  };

  const handleEdit = (hostel) => {
    setSelectedHostel(hostel);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hostel permanently?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/hostels/${id}`);
      setHostels((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error("Failed to delete hostel:", err);
    }
  };

  const handleToggleStatus = async (id) => {
    const hostel = hostels.find((h) => h._id === id);
    if (!hostel) return;
    const updatedStatus = hostel.status === "active" ? "inactive" : "active";

    try {
      const res = await axios.patch(`http://localhost:4000/api/hostels/${id}`, {
        status: updatedStatus,
      });
      setHostels((prev) =>
        prev.map((h) => (h._id === id ? { ...h, status: res.data.status } : h))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (selectedHostel) {
        // Update existing hostel
        const res = await axios.put(
          `http://localhost:4000/api/hostels/${selectedHostel._id}`,
          data
        );
        setHostels((prev) =>
          prev.map((h) => (h._id === selectedHostel._id ? res.data : h))
        );
      } else {
        // Add new hostel
        const res = await axios.post("http://localhost:4000/api/hostels", data);
        setHostels((prev) => [...prev, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save hostel:", err);
    }
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
              <tr key={hostel._id}>
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
                      onClick={() => handleToggleStatus(hostel._id)}
                    >
                      {hostel.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(hostel._id)}
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
          <Modal.Title>{selectedHostel ? "Update Hostel" : "Add Hostel"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddOrUpdateHostel hostelData={selectedHostel} onSubmit={handleFormSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
