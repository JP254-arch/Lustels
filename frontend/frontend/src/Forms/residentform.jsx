import { useState, useEffect } from "react";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faVenusMars,
  faBuilding,
  faDoorClosed,
  faBed,
  faCalendarAlt,
  faToggleOn,
  faStickyNote,
} from "@fortawesome/free-solid-svg-icons";

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

  // ---------------- PREFILL (UPDATE MODE) ----------------
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

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
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
        {/* Name */}
        <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faUser} className="text-gray-500" />
          <input
            name="name"
            placeholder="Resident Name"
            className="w-full outline-none"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full outline-none"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faPhone} className="text-gray-500" />
          <input
            name="phone"
            placeholder="Phone Number"
            className="w-full outline-none"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Gender */}
        <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faVenusMars} className="text-gray-500" />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full outline-none bg-transparent"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Hostel */}
        <div className="flex items-center gap-2 border p-3 rounded-xl md:col-span-2 focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faBuilding} className="text-gray-500" />
          <select
            name="hostel"
            value={formData.hostel}
            onChange={handleChange}
            className="w-full outline-none bg-transparent"
            required
          >
            <option value="">Select Hostel</option>
            {hostels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room Number */}
        <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faDoorClosed} className="text-gray-500" />
          <input
            name="roomNumber"
            placeholder="Room Number"
            className="w-full outline-none"
            value={formData.roomNumber}
            onChange={handleChange}
          />
        </div>

        {/* Bed Number */}
        <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faBed} className="text-gray-500" />
          <input
            name="bedNumber"
            placeholder="Bed Number"
            className="w-full outline-none"
            value={formData.bedNumber}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faToggleOn} className="text-gray-500" />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full outline-none bg-transparent"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Check-In Date */}
        <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            className="w-full outline-none"
          />
        </div>

        {/* Check-Out Date */}
        <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            className="w-full outline-none"
          />
        </div>

        {/* Notes */}
        <div className="flex items-start gap-2 border p-3 rounded-xl md:col-span-2 focus-within:ring-2 focus-within:ring-orange-900">
          <FontAwesomeIcon icon={faStickyNote} className="text-gray-500 mt-1" />
          <textarea
            name="notes"
            rows={3}
            placeholder="Notes / Comments"
            className="w-full outline-none resize-none"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
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
