import { useState, useEffect } from "react";
import axios from "axios";

export default function AddOrUpdateResident({
  residentData = null,
  hostels = [],
  wardens = [],
  onSubmit,
  onCancel,
}) {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    gender: "male",
    hostel: "",
    assignedWarden: "",
    roomNumber: "",
    bedNumber: "",
    status: "active",
    checkInDate: "",
    checkOutDate: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= PREFILL (UPDATE MODE) ================= */
  useEffect(() => {
    if (residentData) {
      setFormData({
        ...initialState,
        ...residentData,
        hostel: residentData.hostel?._id || "",
        assignedWarden: residentData.assignedWarden?._id || "",
      });
    }
  }, [residentData]);

  /* ================= AUTO-ASSIGN WARDEN ================= */
  useEffect(() => {
    if (!formData.hostel) {
      setFormData((prev) => ({ ...prev, assignedWarden: "" }));
      return;
    }

    const matchedWarden = wardens.find(
      (w) => w.assignedHostel?._id === formData.hostel
    );

    setFormData((prev) => ({
      ...prev,
      assignedWarden: matchedWarden?._id || "",
    }));
  }, [formData.hostel, wardens]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = residentData?._id
        ? await axios.put(
            `http://localhost:4000/api/residents/${residentData._id}`,
            formData
          )
        : await axios.post("http://localhost:4000/api/residents", formData);

      onSubmit(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to save resident. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedWarden = wardens.find(
    (w) => w._id === formData.assignedWarden
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto"
    >
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Resident Name"
          className="border p-3 rounded-xl"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-3 rounded-xl"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          className="border p-3 rounded-xl"
          value={formData.phone}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* ================= HOSTEL ================= */}
        <select
          name="hostel"
          value={formData.hostel}
          onChange={handleChange}
          className="border p-3 rounded-xl md:col-span-2"
          required
        >
          <option value="">Select Hostel</option>
          {hostels.map((h) => (
            <option key={h._id} value={h._id}>
              {h.name}
            </option>
          ))}
        </select>

        {/* ================= AUTO-FILLED WARDEN ================= */}
        <select
          value={formData.assignedWarden}
          disabled
          className="border p-3 rounded-xl md:col-span-2 bg-gray-100"
        >
          <option value="">
            {selectedWarden
              ? selectedWarden.name
              : "No warden assigned to this hostel"}
          </option>
        </select>

        <input
          name="roomNumber"
          placeholder="Room Number"
          className="border p-3 rounded-xl"
          value={formData.roomNumber}
          onChange={handleChange}
        />

        <input
          name="bedNumber"
          placeholder="Bed Number"
          className="border p-3 rounded-xl"
          value={formData.bedNumber}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          type="date"
          name="checkInDate"
          value={formData.checkInDate}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <input
          type="date"
          name="checkOutDate"
          value={formData.checkOutDate}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />
      </div>

      <textarea
        name="notes"
        rows={3}
        className="border p-3 rounded-xl w-full"
        value={formData.notes}
        onChange={handleChange}
      />

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-900 text-white py-3 rounded-xl w-full hover:bg-orange-800 transition"
        >
          {loading
            ? residentData
              ? "Updating..."
              : "Adding..."
            : residentData
            ? "Update Resident"
            : "Add Resident"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white py-3 rounded-xl w-full hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
