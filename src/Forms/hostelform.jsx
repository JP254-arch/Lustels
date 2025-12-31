import { useState, useEffect } from "react";

export default function AddOrUpdateHostel({ hostelData = null, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    description: "",
    price: "",
    roomType: "",
    totalRooms: "",
    bedsPerRoom: "",
    amenities: [],
    status: "active",
    genderPolicy: "",
    assignedWarden: "",
    totalBeds: "",
    imageUrl: "",
    imageFile: null,
  });

  const amenitiesList = ["WiFi", "Water", "Electricity", "Security", "Meals", "Parking", "Study Room"];
  const genderOptions = ["Male", "Female", "Mixed"];
  const statusOptions = ["Active", "Inactive"];
  const wardens = ["Warden A", "Warden B", "Warden C"]; // example

  // Pre-fill form if updating
  useEffect(() => {
    if (hostelData) {
      setFormData({ ...formData, ...hostelData });
    }
  }, [hostelData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalBeds = formData.totalRooms * formData.bedsPerRoom;
    const dataToSubmit = { ...formData, totalBeds };
    if (onSubmit) onSubmit(dataToSubmit);
    alert(`Hostel ${hostelData ? "updated" : "added"} successfully (mock)`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {hostelData ? "Update Hostel" : "Add New Hostel"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <div>
            <h2 className="font-semibold mb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Hostel Name"
                className="border p-3 rounded-xl"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location (City / Area)"
                className="border p-3 rounded-xl"
                value={formData.location}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Full Address"
                className="border p-3 rounded-xl md:col-span-2"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="font-semibold mb-3">Description</h2>
            <textarea
              name="description"
              placeholder="Hostel description, rules, notes"
              className="border p-3 rounded-xl w-full"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* PRICING & CAPACITY */}
          <div>
            <h2 className="font-semibold mb-3">Pricing & Capacity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                placeholder="Price per Month (KES)"
                className="border p-3 rounded-xl"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <select
                name="roomType"
                className="border p-3 rounded-xl"
                value={formData.roomType}
                onChange={handleChange}
                required
              >
                <option value="">Select Room Type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="shared">Dormitory / Shared</option>
              </select>
              <input
                type="number"
                name="totalRooms"
                placeholder="Total Rooms"
                className="border p-3 rounded-xl"
                value={formData.totalRooms}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="bedsPerRoom"
                placeholder="Beds per Room"
                className="border p-3 rounded-xl"
                value={formData.bedsPerRoom}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* AMENITIES */}
          <div>
            <h2 className="font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ADDITIONAL OPTIONS */}
          <div>
            <h2 className="font-semibold mb-3">Additional Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-3 rounded-xl"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status.toLowerCase()}>
                    {status}
                  </option>
                ))}
              </select>
              <select
                name="genderPolicy"
                value={formData.genderPolicy}
                onChange={handleChange}
                className="border p-3 rounded-xl"
              >
                <option value="">Select Gender Policy</option>
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender.toLowerCase()}>
                    {gender}
                  </option>
                ))}
              </select>

              {/* Assigned Warden */}
              <select
                name="assignedWarden"
                value={formData.assignedWarden}
                onChange={handleChange}
                className="border p-3 rounded-xl md:col-span-2"
              >
                <option value="">Select Assigned Warden</option>
                {wardens.map((warden) => (
                  <option key={warden} value={warden}>
                    {warden}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="totalBeds"
                placeholder="Total Beds (auto-calculated)"
                className="border p-3 rounded-xl md:col-span-2"
                value={formData.totalRooms && formData.bedsPerRoom ? formData.totalRooms * formData.bedsPerRoom : ''}
                readOnly
              />

              {/* Image inputs */}
              <input
                type="url"
                name="imageUrl"
                placeholder="Hostel Image URL"
                className="border p-3 rounded-xl md:col-span-2"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                className="border p-3 rounded-xl md:col-span-2"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-orange-900 text-white px-6 py-3 rounded-xl hover:bg-orange-800 transition w-full"
            >
              {hostelData ? "Update Hostel" : "Add Hostel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
