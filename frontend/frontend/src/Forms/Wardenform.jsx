import { useState, useEffect } from "react";
import api from "../api/axios"; // token-aware axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faVenusMars,
  faCalendarAlt,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

export default function WardenForm({ wardenData = null, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
    assignedHostels: [],
  });

  const [hostels, setHostels] = useState([]);
  const [loadingHostels, setLoadingHostels] = useState(true);
  const [hostelError, setHostelError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", visible: false });

  const genderOptions = ["male", "female", "other"];

  // ---------------- FETCH HOSTELS ----------------
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await api.get("/hostels");
        setHostels(res.data);
      } catch (err) {
        console.error(err);
        setHostelError("Failed to load hostels");
      } finally {
        setLoadingHostels(false);
      }
    };
    fetchHostels();
  }, []);

  // ---------------- PREFILL FOR EDIT ----------------
  useEffect(() => {
    if (wardenData) {
      setForm({
        name: wardenData.user?.name || "",
        email: wardenData.user?.email || "",
        phone: wardenData.phone || "",
        gender: wardenData.gender || "",
        dob: wardenData.dob ? wardenData.dob.split("T")[0] : "",
        assignedHostels: wardenData.assignedHostels?.map((h) => h._id) || [],
        password: "", // never prefill password
      });
    }
  }, [wardenData]);

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "assignedHostels") {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setForm((prev) => ({ ...prev, assignedHostels: selected }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ---------------- TOAST ----------------
  const showToast = (message) => {
    setToast({ message, visible: true });
    navigator.clipboard.writeText(message);
    setTimeout(() => setToast({ message: "", visible: false }), 10000);
  };

  // ---------------- HANDLE FORM SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    setSuccess("");

    if (!form.assignedHostels.length) {
      setError("Please select at least one hostel");
      setSubmitLoading(false);
      return;
    }

    if (!wardenData && !form.password) {
      setError("Password is required for new warden");
      setSubmitLoading(false);
      return;
    }

    const payload = { ...form };

    try {
      let res;

      if (wardenData?._id) {
        // Update existing warden
        if (!payload.password) delete payload.password;
        res = await api.put(`/wardens/${wardenData._id}`, payload);
        if (form.password) {
          await api.put(`/wardens/${wardenData._id}/password`, { password: form.password });
          setSuccess("Warden updated and password changed successfully!");
        } else {
          setSuccess("Warden updated successfully!");
        }
      } else {
        res = await api.post("/wardens", payload);
        setSuccess("Warden added successfully!");
        if (res.data.temporaryPassword) showToast(res.data.temporaryPassword);
      }

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save warden");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <h1 className="text-2xl font-bold mb-2">
          {wardenData ? "Update Warden" : "Add New Warden"}
        </h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
            <FontAwesomeIcon icon={faUser} className="text-gray-500" />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
            <FontAwesomeIcon icon={faLock} className="text-gray-500" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={wardenData ? "New Password (optional)" : "Password"}
              className="w-full outline-none"
              required={!wardenData}
            />
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
            <FontAwesomeIcon icon={faPhone} className="text-gray-500" />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full outline-none"
            />
          </div>

          {/* Gender */}
          <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
            <FontAwesomeIcon icon={faVenusMars} className="text-gray-500" />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
              required
            >
              <option value="">Select Gender</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* DOB */}
          <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>

          {/* Assigned Hostels */}
          <div className="flex flex-col border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
            <label className="mb-1 font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} /> Assign Hostels
            </label>
            <select
              name="assignedHostels"
              value={form.assignedHostels}
              onChange={handleChange}
              multiple
              size={Math.min(hostels.length, 5)}
              disabled={loadingHostels || !!hostelError}
              required
              className="outline-none"
            >
              {hostels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.location || "No location"})
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitLoading}
            className="bg-orange-900 text-white px-5 py-3 rounded-xl w-full hover:bg-orange-800 transition font-semibold disabled:opacity-50"
          >
            {submitLoading
              ? wardenData
                ? "Updating..."
                : "Adding..."
              : wardenData
              ? "Update Warden"
              : "Add Warden"}
          </button>
        </form>
      </div>

      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-6 right-6 bg-yellow-400 text-black px-5 py-3 rounded-lg shadow-lg font-semibold z-50 animate-slide-in">
          Temporary Password: {toast.message} (Copied!)
        </div>
      )}
    </div>
  );
}
