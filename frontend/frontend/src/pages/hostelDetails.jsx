import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import BookingModal from "../components/PaymentModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faUsers,
  faMapMarkerAlt,
  faCoins,
  faHome,
  faBuilding,
  faUserShield,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:4000/api";
const MAX_STRIPE_AMOUNT = 999999; // KES limit

export default function HostelDetails() {
  const { id } = useParams();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/hostels/${id}`);
        setHostel(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch hostel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading hostel details...</p>
      </div>
    );

  if (error || !hostel)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error || "Hostel not found"}</p>
      </div>
    );

  const bedsPerRoom = Number(hostel.bedsPerRoom) || 0;
  const totalRooms = Number(hostel.totalRooms) || 0;
  const totalBeds = bedsPerRoom * totalRooms;

  const getWardenName = (assignedWarden) =>
    assignedWarden?.user?.name || "Unassigned";

  const handleBookingConfirm = async (bookingData) => {
    try {
      const amountInCents = bookingData.amount * 100;

      if (!amountInCents || amountInCents <= 0) {
        alert("Invalid payment amount.");
        return;
      }

      if (amountInCents > MAX_STRIPE_AMOUNT * 100) {
        alert(
          "Stripe card payments are limited to KES 999,999. Please reduce months."
        );
        return;
      }

      const res = await axios.post(`${API_BASE}/create-checkout-session`, {
        hostelId: hostel._id,
        hostelName: hostel.name,
        amount: amountInCents,
        paymentMethod: "card",
      });

      if (!res.data?.url) throw new Error("Stripe session URL not returned");

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Card payment could not be initiated. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
        {/* Hostel Image */}
        <img
          src={hostel.imageUrl || "https://via.placeholder.com/800x400"}
          alt={hostel.name}
          className="w-full h-72 md:h-96 object-cover"
        />

        {/* Hostel Info */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{hostel.name}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {hostel.location}
              </p>
              <p className="text-sm text-gray-500">{hostel.address}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold flex items-center justify-end gap-1">
                <FontAwesomeIcon icon={faCoins} />KES {hostel.price}
              </p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faHome} /> Description
            </h2>
            <p className="text-gray-700">{hostel.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Detail icon={faBuilding} label="Room Type" value={hostel.roomType} />
            <Detail icon={faUsers} label="Gender Policy" value={hostel.genderPolicy} />
            <Detail icon={faKey} label="Status" value={hostel.status} />
            <Detail icon={faBuilding} label="Total Rooms" value={totalRooms} />
            <Detail icon={faBed} label="Beds per Room" value={bedsPerRoom} />
            <Detail icon={faBed} label="Total Beds" value={totalBeds} />
          </div>

          <div>
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faUserShield} /> Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {hostel.amenities?.map((a) => (
                <span
                  key={a}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} />
            <strong>Assigned Warden:</strong> {getWardenName(hostel.assignedWarden)}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => setOpenBooking(true)}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition w-full sm:w-auto text-center"
            >
              Book & Pay (Card)
            </button>

            <Link
              to="/hostels"
              className="border border-gray-300 px-6 py-3 rounded-xl text-center hover:bg-gray-50 transition w-full sm:w-auto"
            >
              Back to Hostels
            </Link>
          </div>
        </div>
      </div>

      {openBooking && (
        <BookingModal
          hostel={hostel}
          onClose={() => setOpenBooking(false)}
          onConfirm={handleBookingConfirm}
          disableMpesa={true}
        />
      )}
    </div>
  );
}

function Detail({ label, value, icon }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-2">
      {icon && <FontAwesomeIcon icon={icon} className="text-blue-700 w-4 h-4" />}
      <div>
        <strong>{label}</strong>
        <p className="capitalize">{value}</p>
      </div>
    </div>
  );
}
