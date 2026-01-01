import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import BookingModal from "../components/PaymentModal"; // Updated to BookingModal

// ================= MOCK HOSTELS =================
const hostels = [
  {
    id: 1,
    name: "Green View Hostel",
    location: "Nairobi",
    address: "123 Nairobi Street",
    description:
      "Spacious rooms, WiFi, security, and meals included. Quiet environment ideal for students.",
    price: 12000,
    roomType: "single",
    totalRooms: 10,
    bedsPerRoom: 2,
    amenities: ["WiFi", "Water", "Security", "Meals"],
    status: "active",
    genderPolicy: "male",
    assignedWarden: "Warden A",
    imageUrl:
      "https://images.unsplash.com/photo-1633411187642-f84216917af1?w=1200&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "Sunrise Hostel",
    location: "Kisumu",
    address: "456 Kisumu Road",
    description:
      "Affordable shared rooms with 24/7 water and electricity. Friendly management.",
    price: 10000,
    roomType: "shared",
    totalRooms: 8,
    bedsPerRoom: 4,
    amenities: ["Water", "Electricity", "Meals"],
    status: "active",
    genderPolicy: "female",
    assignedWarden: "Warden B",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1676321688630-9558e7d2be10?w=1200&auto=format&fit=crop&q=60",
  },
];

export default function HostelDetails() {
  const { id } = useParams();
  const hostel = hostels.find((h) => h.id === Number(id));
  const [openBooking, setOpenBooking] = useState(false);

  if (!hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Hostel not found</p>
      </div>
    );
  }

  const totalBeds = hostel.totalRooms * hostel.bedsPerRoom;

  // Handle confirmed booking from modal
  const handleBookingConfirm = (bookingData) => {
    console.log("Booking Confirmed:", bookingData);
    // TODO: Save bookingData to your DB or API after payment success
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
        {/* Hostel Image */}
        <img
          src={hostel.imageUrl}
          alt={hostel.name}
          className="w-full h-72 object-cover"
        />

        {/* Hostel Info */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">{hostel.name}</h1>
              <p className="text-gray-600">{hostel.location}</p>
              <p className="text-sm text-gray-500">{hostel.address}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-2xl font-bold">KES {hostel.price}</p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{hostel.description}</p>
          </div>

          {/* Hostel Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-xl">
              <strong>Room Type</strong>
              <p className="capitalize">{hostel.roomType}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <strong>Gender Policy</strong>
              <p className="capitalize">{hostel.genderPolicy}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <strong>Status</strong>
              <p className="capitalize">{hostel.status}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <strong>Total Rooms</strong>
              <p>{hostel.totalRooms}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <strong>Beds per Room</strong>
              <p>{hostel.bedsPerRoom}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <strong>Total Beds</strong>
              <p>{totalBeds}</p>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="font-semibold mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {hostel.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Assigned Warden */}
          <div className="text-sm text-gray-600">
            <strong>Assigned Warden:</strong> {hostel.assignedWarden}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => setOpenBooking(true)}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Book / Reserve
            </button>
            <Link
              to="/hostels"
              className="border border-gray-300 px-6 py-3 rounded-xl text-center hover:bg-gray-50 transition"
            >
              Back to Hostels
            </Link>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {openBooking && (
        <BookingModal
          hostel={hostel}
          onClose={() => setOpenBooking(false)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
}
