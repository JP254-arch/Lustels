import { useParams } from "react-router-dom";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";

const hostels = [
  {
    id: 1,
    name: "Green View Hostel",
    location: "Nairobi",
    description: "Spacious rooms, WiFi, security, and meals included.",
    price: 12000,
    image: "https://images.unsplash.com/photo-1633411187642-f84216917af1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9zdGVsc3xlbnwwfHwwfHx8MA%3D%3D/800x300",
  },
  {
    id: 2,
    name: "Sunrise Hostel",
    location: "Kisumu",
    description: "Affordable rooms with 24/7 water and electricity.",
    price: 10000,
    image: "https://plus.unsplash.com/premium_photo-1676321688630-9558e7d2be10?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWxzfGVufDB8fDB8fHww/800x300",
  },
];

export default function HostelDetails() {
  const { id } = useParams();
  const hostel = hostels.find((h) => h.id === Number(id));
  const [open, setOpen] = useState(false);

  if (!hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Hostel not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
        <img
          src={hostel.image}
          alt={hostel.name}
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          <h1 className="text-2xl font-bold">{hostel.name}</h1>
          <p className="text-gray-600 mt-1">{hostel.location}</p>

          <p className="mt-4 text-gray-700">{hostel.description}</p>

          <p className="mt-4 text-lg font-bold">
            KES {hostel.price} / month
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-6 bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Book / Reserve
          </button>
        </div>
      </div>

      <PaymentModal
        open={open}
        onClose={() => setOpen(false)}
        hostel={hostel}
      />
    </div>
  );
}
