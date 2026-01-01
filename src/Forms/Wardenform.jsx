import { useState, useEffect } from "react";

export default function WardenForm({
  wardenData = null,
  onSubmit,
  hostelOptions = [],
}) {
  const [warden, setWarden] = useState({
    name: "",
    email: "",
    assignedHostel: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const genderOptions = ["male", "female", "other"];

  useEffect(() => {
    if (wardenData) {
      setWarden({
        name: wardenData.name || "",
        email: wardenData.email || "",
        assignedHostel: wardenData.assignedHostel?._id || "",
        phone: wardenData.phone || "",
        gender: wardenData.gender || "",
        dob: wardenData.dob ? wardenData.dob.split("T")[0] : "",
      });
    }
  }, [wardenData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarden((prev) => ({ ...prev, [name]: value }));
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

          {/* HOSTEL DROPDOWN */}
          <select
            name="assignedHostel"
            value={warden.assignedHostel}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
            required
          >
            <option value="">Select Hostel</option>
            {hostelOptions.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
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
            className="bg-orange-900 text-white px-5 py-3 rounded-xl w-full hover:bg-orange-800 transition"
          >
            {wardenData ? "Update Warden" : "Add Warden"}
          </button>
        </form>
      </div>
    </div>
  );
}
