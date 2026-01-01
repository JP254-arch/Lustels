import { useState, useEffect } from "react";

export default function WardenForm({ wardenData = null, onSubmit, hostelOptions = [] }) {
  const [warden, setWarden] = useState({
    name: "",
    email: "",
    assignedHostels: [],
    phone: "",
    gender: "",
    dob: "",
  });

  const genderOptions = ["Male", "Female", "Other"];

  useEffect(() => {
    if (wardenData) {
      setWarden({
        name: wardenData.name || "",
        email: wardenData.email || "",
        assignedHostels: wardenData.assignedHostels || [],
        phone: wardenData.phone || "",
        gender: wardenData.gender || "",
        dob: wardenData.dob ? wardenData.dob.split("T")[0] : "",
      });
    }
  }, [wardenData]);

  const handleChange = (e) => {
    setWarden({ ...warden, [e.target.name]: e.target.value });
  };

  const handleHostelChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setWarden(prev => ({ ...prev, assignedHostels: selected }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(warden);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {wardenData ? "Update Warden" : "Add New Warden"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
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
          <select
            multiple
            name="assignedHostels"
            value={warden.assignedHostels}
            onChange={handleHostelChange}
            className="border p-3 rounded-xl w-full"
          >
            {hostelOptions.map(h => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
          <input
            type="text"
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
            {genderOptions.map(g => (
              <option key={g} value={g.toLowerCase()}>{g}</option>
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
            className="bg-orange-900 text-white px-5 py-3 rounded-xl w-full hover:bg-orange-800 transition"
          >
            {wardenData ? "Update Warden" : "Add Warden"}
          </button>
        </form>
      </div>
    </div>
  );
}
