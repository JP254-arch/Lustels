import { useState, useEffect } from "react";
import api from "../api/axios"; // token-aware axios instance

export default function WardenForm({ wardenData = null, onSuccess }) {
  const [warden, setWarden] = useState({
    name: "",
    email: "",
    assignedHostels: [],
    phone: "",
    gender: "",
    dob: "",
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
        setLoadingHostels(true);
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
      setWarden({
        name: wardenData.user?.name || "",
        email: wardenData.user?.email || "",
        assignedHostels: wardenData.assignedHostels
          ? wardenData.assignedHostels.map((h) => h._id)
          : [],
        phone: wardenData.phone || "",
        gender: wardenData.gender || "",
        dob: wardenData.dob ? wardenData.dob.split("T")[0] : "",
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
      setWarden((prev) => ({ ...prev, assignedHostels: selected }));
    } else {
      setWarden((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ---------------- TOAST HELPER ----------------
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

    if (!warden.assignedHostels.length) {
      setError("Please select at least one hostel");
      setSubmitLoading(false);
      return;
    }

    const payload = { ...warden, assignedHostels: warden.assignedHostels };

    try {
      let res;

      if (wardenData?._id) {
        // UPDATE existing warden
        res = await api.put(`/wardens/${wardenData._id}`, payload);
        setSuccess("Warden updated successfully!");
      } else {
        // CREATE new warden
        res = await api.post("/wardens", payload);

        // Store JWT returned by backend
        if (res.data.token) localStorage.setItem("token", res.data.token);

        setSuccess("Warden added successfully!");
        showToast(res.data.temporaryPassword);
      }

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save warden");
    } finally {
      setSubmitLoading(false);
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {wardenData ? "Update Warden" : "Add New Warden"}
        </h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            value={warden.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-3 rounded-xl w-full"
            required
          />

          <input
            type="email"
            name="email"
            value={warden.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-3 rounded-xl w-full"
            required
          />

          {/* Multi-select Hostels Dropdown */}
          <select
            name="assignedHostels"
            value={warden.assignedHostels}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
            multiple
            size={Math.min(hostels.length, 5)}
            disabled={loadingHostels || !!hostelError}
            required
          >
            {loadingHostels && <option>Loading hostels...</option>}
            {hostelError && <option>{hostelError}</option>}
            {hostels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name} ({h.location || "No location"})
              </option>
            ))}
          </select>

          <input
            name="phone"
            value={warden.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border p-3 rounded-xl w-full"
          />

          <select
            name="gender"
            value={warden.gender}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
            required
          >
            <option value="">Select Gender</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="dob"
            value={warden.dob}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
          />

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

      {/* ---------------- TOAST ---------------- */}
      {toast.visible && (
        <div
          className="fixed top-6 right-6 bg-yellow-400 text-black px-5 py-3 rounded-lg shadow-lg font-semibold z-50 animate-slide-in"
        >
          Temporary Password: {toast.message} (Copied!)
        </div>
      )}
    </div>
  );
}
