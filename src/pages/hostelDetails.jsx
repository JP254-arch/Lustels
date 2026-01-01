import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import BookingModal from "../components/PaymentModal";

export default function HostelDetails() {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch hostel details with populated warden if possible
        const hostelRes = await axios.get(`http://localhost:4000/api/hostels/${id}`);
        setHostel(hostelRes.data);

        // Fetch all wardens
        const wardensRes = await axios.get("http://localhost:4000/api/wardens");
        setWardens(wardensRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch hostel details or wardens.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading hostel details...</p>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error || "Hostel not found"}</p>
      </div>
    );
  }

  const totalBeds = hostel.totalRooms * hostel.bedsPerRoom;

  // Resolve assigned warden name (supports both ObjectId and populated object)
  const assignedWardenName = () => {
    if (!hostel.assignedWarden) return "Unassigned";

    // If assignedWarden is already an object with name
    if (typeof hostel.assignedWarden === "object" && hostel.assignedWarden.name) {
      return hostel.assignedWarden.name;
    }

    // If assignedWarden is an ID
    const w = wardens.find((w) => w._id === hostel.assignedWarden);
    return w ? w.name : "Unknown";
  };

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
          src={hostel.imageUrl || "https://via.placeholder.com/800x400"}
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
              {hostel.amenities?.map((amenity) => (
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
            <strong>Assigned Warden:</strong> {assignedWardenName()}
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
