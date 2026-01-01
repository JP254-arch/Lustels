import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch hostels
        const hostelsRes = await axios.get("http://localhost:4000/api/hostels");

        // Fetch wardens
        const wardensRes = await axios.get("http://localhost:4000/api/wardens");

        setHostels(hostelsRes.data);
        setWardens(wardensRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch hostels or wardens.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to get warden name by ID or name field
  const getWardenName = (assignedWarden) => {
    if (!assignedWarden) return "Unassigned";

    // If the assignedWarden is a string, return it directly
    if (typeof assignedWarden === "string") return assignedWarden;

    // If it's an ID, find the warden
    const w = wardens.find((w) => w._id === assignedWarden);
    return w ? w.name : "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading hostels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold">Available Hostels</h1>
        <p className="text-gray-600 text-sm">
          Browse verified hostels and choose the best option for you
        </p>
      </div>

      {/* Hostel Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels
          .filter((hostel) => hostel.status === "active")
          .map((hostel) => (
            <div
              key={hostel._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* Image */}
              <img
                src={hostel.imageUrl || "https://via.placeholder.com/400x200"}
                alt={hostel.name}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold">{hostel.name}</h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">
                    {hostel.genderPolicy}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">{hostel.location}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {hostel.roomType} room · {hostel.totalRooms} rooms
                </p>

                {/* Assigned Warden */}
                <p className="text-sm text-gray-500">
                  Warden:{" "}
                  <span className="font-medium">{getWardenName(hostel.assignedWarden)}</span>
                </p>

                {/* Amenities Preview */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  {hostel.amenities?.slice(0, 3).map((amenity) => (
                    <span key={amenity} className="bg-gray-100 px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                  {hostel.amenities?.length > 3 && (
                    <span className="text-gray-400">
                      +{hostel.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Price */}
                <p className="text-lg font-bold pt-2">
                  KES {hostel.price}
                  <span className="text-sm font-normal text-gray-500">/ month</span>
                </p>

                {/* Action */}
                <Link
                  to={`/hostels/${hostel._id}`}
                  className="block text-center bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
