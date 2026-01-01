// =============================
// Hostels.jsx (Unified & Clean Public Listing)
// =============================
import { Link } from "react-router-dom";

// TEMP MOCK DATA (will be replaced by API / MongoDB)
const hostels = [
  {
    id: 1,
    name: "Green View Hostel",
    location: "Nairobi",
    address: "123 Nairobi Street",
    description: "Spacious rooms, WiFi, security, and meals included.",
    price: 12000,
    roomType: "single",
    totalRooms: 10,
    bedsPerRoom: 2,
    amenities: ["WiFi", "Water", "Security", "Meals"],
    status: "active",
    genderPolicy: "male",
    assignedWarden: "Warden A",
    imageUrl:
      "https://images.unsplash.com/photo-1633411187642-f84216917af1?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "Sunrise Hostel",
    location: "Kisumu",
    address: "456 Kisumu Road",
    description: "Affordable rooms with 24/7 water and electricity.",
    price: 10000,
    roomType: "shared",
    totalRooms: 8,
    bedsPerRoom: 4,
    amenities: ["Water", "Electricity", "Meals"],
    status: "active",
    genderPolicy: "female",
    assignedWarden: "Warden B",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1676321688630-9558e7d2be10?w=800&auto=format&fit=crop&q=60",
  },
];

export default function Hostels() {
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
              key={hostel.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* Image */}
              <img
                src={hostel.imageUrl}
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

                {/* Amenities Preview */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  {hostel.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-gray-100 px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hostel.amenities.length > 3 && (
                    <span className="text-gray-400">
                      +{hostel.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Price */}
                <p className="text-lg font-bold pt-2">
                  KES {hostel.price}
                  <span className="text-sm font-normal text-gray-500">
                    / month
                  </span>
                </p>

                {/* Action */}
                <Link
                  to={`/hostels/${hostel.id}`}
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
