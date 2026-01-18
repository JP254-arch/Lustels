import { useState, useEffect } from "react";
import api from "../api/axios"; // Auth-enabled Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMapMarkerAlt,
  faCoins,
  faBed,
  faHouseChimney,
  faLock,
  faWifi,
  faCar,
  faUtensils,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

export default function AddOrUpdateHostel({ hostelData = null, onSubmit }) {
  const initialState = {
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
    imageUrl: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wardens, setWardens] = useState([]);
  const [wardensLoading, setWardensLoading] = useState(true);
  const [wardensError, setWardensError] = useState("");

  const amenitiesList = [
    { name: "WiFi", icon: faWifi },
    { name: "Water", icon: faUtensils },
    { name: "Electricity", icon: faLightbulb },
    { name: "Security", icon: faLock },
    { name: "Meals", icon: faUtensils },
    { name: "Parking", icon: faCar },
    { name: "Study Room", icon: faHome },
  ];

  // ---------------- FETCH WARDENS ----------------
  useEffect(() => {
    const fetchWardens = async () => {
      try {
        setWardensLoading(true);
        const res = await api.get("/wardens"); // Auth token included
        setWardens(res.data);
      } catch (err) {
        console.error(err);
        setWardensError("Failed to fetch wardens");
      } finally {
        setWardensLoading(false);
      }
    };
    fetchWardens();
  }, []);

  // ---------------- POPULATE FORM IF EDITING ----------------
  useEffect(() => {
    if (hostelData) {
      setFormData({
        ...initialState,
        ...hostelData,
        assignedWarden: hostelData.assignedWarden?._id || "",
      });
    }
  }, [hostelData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      price: Number(formData.price),
      totalRooms: Number(formData.totalRooms),
      bedsPerRoom: Number(formData.bedsPerRoom),
      totalBeds: Number(formData.totalRooms) * Number(formData.bedsPerRoom),
    };

    try {
      let res;
      if (hostelData?._id) {
        res = await api.put(`/hostels/${hostelData._id}`, payload);
      } else {
        res = await api.post("/hostels", payload);
      }

      setSuccess(
        hostelData
          ? "Hostel updated successfully!"
          : "Hostel added successfully!"
      );
      if (onSubmit) onSubmit(res.data);
      if (!hostelData) setFormData(initialState);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save hostel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* HEADER */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold">
            {hostelData ? "Update Hostel" : "Add New Hostel"}
          </h1>
          <p className="text-sm text-gray-500">
            Fill in accurate hostel details for students and administrators
          </p>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
                <FontAwesomeIcon icon={faHome} className="text-gray-500" />
                <input
                  type="text"
                  name="name"
                  placeholder="Hostel Name"
                  className="w-full outline-none"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />
                <input
                  type="text"
                  name="location"
                  placeholder="City / Area"
                  className="w-full outline-none"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Full Address"
                className="border p-3 rounded-xl md:col-span-2 focus:ring-2 focus:ring-orange-900 outline-none"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* DESCRIPTION */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Description</h2>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe the hostel, rules, and important notes"
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-900 outline-none"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </section>

          {/* PRICING & CAPACITY */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Pricing & Capacity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
                <FontAwesomeIcon icon={faCoins} className="text-gray-500" />
                <input
                  type="number"
                  name="price"
                  placeholder="Monthly Price (KES)"
                  className="w-full outline-none"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <select
                name="roomType"
                className="border p-3 rounded-xl focus:ring-2 focus:ring-orange-900 outline-none"
                value={formData.roomType}
                onChange={handleChange}
                required
              >
                <option value="">Select Room Type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="shared">Shared / Dormitory</option>
              </select>
              <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
                <FontAwesomeIcon icon={faHouseChimney} className="text-gray-500" />
                <input
                  type="number"
                  name="totalRooms"
                  placeholder="Total Rooms"
                  className="w-full outline-none"
                  value={formData.totalRooms}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center gap-2 border p-3 rounded-xl focus-within:ring-2 focus-within:ring-orange-900">
                <FontAwesomeIcon icon={faBed} className="text-gray-500" />
                <input
                  type="number"
                  name="bedsPerRoom"
                  placeholder="Beds Per Room"
                  className="w-full outline-none"
                  value={formData.bedsPerRoom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {formData.totalRooms && formData.bedsPerRoom && (
              <p className="mt-3 text-sm text-gray-600">
                Total Beds:{" "}
                <span className="font-semibold">
                  {formData.totalRooms * formData.bedsPerRoom}
                </span>
              </p>
            )}
          </section>

          {/* AMENITIES */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity.name}
                  className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity.name)}
                    onChange={() => handleAmenityChange(amenity.name)}
                  />
                  <FontAwesomeIcon icon={amenity.icon} className="text-gray-500" />
                  <span>{amenity.name}</span>
                </label>
              ))}
            </div>
          </section>

          {/* POLICIES & MANAGEMENT */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Policies & Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-3 rounded-xl focus:ring-2 focus:ring-orange-900 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                name="genderPolicy"
                value={formData.genderPolicy}
                onChange={handleChange}
                className="border p-3 rounded-xl focus:ring-2 focus:ring-orange-900 outline-none"
              >
                <option value="">Gender Policy</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select
                name="assignedWarden"
                value={formData.assignedWarden}
                onChange={handleChange}
                className="border p-3 rounded-xl md:col-span-2 focus:ring-2 focus:ring-orange-900 outline-none"
                disabled={wardensLoading || !!wardensError}
              >
                <option value="">
                  {wardensLoading
                    ? "Loading wardens..."
                    : wardensError
                    ? wardensError
                    : "Assign Warden"}
                </option>
                {wardens.map((warden) => (
                  <option key={warden._id} value={warden._id}>
                    {warden.user?.name || warden.name || "Unnamed"}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* IMAGE */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Hostel Image</h2>
            <input
              type="url"
              name="imageUrl"
              placeholder="Image URL"
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-900 outline-none"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </section>

          {/* SUBMIT */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-900 text-white py-3 rounded-xl w-full hover:bg-orange-800 transition font-semibold disabled:opacity-50"
            >
              {loading
                ? hostelData
                  ? "Updating..."
                  : "Adding..."
                : hostelData
                ? "Update Hostel"
                : "Add Hostel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
