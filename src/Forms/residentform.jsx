import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AddOrUpdateResident({
  residentData = null,
  hostels = [],
  onSubmit,
  onCancel,
}) {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    gender: "male",
    hostel: "",
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
        checkInDate: residentData.checkIn
          ? new Date(residentData.checkIn).toISOString().split("T")[0]
          : "",
        checkOutDate: residentData.checkOut
          ? new Date(residentData.checkOut).toISOString().split("T")[0]
          : "",
      });
    }
  }, [residentData]);

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
      // Map form fields to backend schema fields
      const payload = {
        ...formData,
        checkIn: formData.checkInDate ? new Date(formData.checkInDate) : null,
        checkOut: formData.checkOutDate
          ? new Date(formData.checkOutDate)
          : null,
      };
      delete payload.checkInDate;
      delete payload.checkOutDate;

      const res = residentData?._id
        ? await api.put(`/residents/${residentData._id}`, payload)
        : await api.post("/residents", payload);

      onSubmit(res.data);
    } catch (err) {
      console.error("SAVE RESIDENT ERROR:", err);
      setError(err.response?.data?.message || "Failed to save resident.");
    } finally {
      setLoading(false);
    }
  };

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
