import { useState, useEffect } from "react";

export default function WardenForm({ wardenData = null, onSubmit, hostelOptions = [] }) {
  const [warden, setWarden] = useState({
    name: "",
    email: "",
    assignedHostel: "",
    contact: "",
    gender: "",
    dob: "",
  });

  const genderOptions = ["Male", "Female", "Other"];

  useEffect(() => {
    if (wardenData) {
      setWarden(wardenData);
    }
  }, [wardenData]);

  const handleChange = (e) => {
    setWarden({ ...warden, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(warden);
    alert(`Warden ${wardenData ? "updated" : "added"} successfully (mock)`);
    if (!wardenData) {
      setWarden({ name: "", email: "", assignedHostel: "", contact: "", gender: "", dob: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {wardenData ? "Update Warden" : "Add New Warden"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <input
            type="text"
            name="name"
            value={warden.name}
            onChange={handleChange}
            placeholder="Full Name"
            className={`border p-3 rounded-xl w-full ${wardenData ? "bg-gray-200" : ""}`}
            required
            readOnly={!!wardenData} // name read-only on update
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={warden.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-3 rounded-xl w-full"
            required
          />

          {/* ASSIGNED HOSTEL */}
          <select
            name="assignedHostel"
            value={warden.assignedHostel}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
          >
            <option value="">Select Assigned Hostel</option>
            {hostelOptions.map((hostel) => (
              <option key={hostel.id} value={hostel.name}>
                {hostel.name}
              </option>
            ))}
          </select>

          {/* CONTACT */}
          <input
            type="text"
            name="contact"
            value={warden.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            className="border p-3 rounded-xl w-full"
          />

          {/* GENDER */}
          <select
            name="gender"
            value={warden.gender}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
            required
          >
            <option value="">Select Gender</option>
            {genderOptions.map((g) => (
              <option key={g} value={g.toLowerCase()}>
                {g}
              </option>
            ))}
          </select>

          {/* DATE OF BIRTH */}
          <input
            type="date"
            name="dob"
            value={warden.dob}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
            required
          />

          {/* SUBMIT */}
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
