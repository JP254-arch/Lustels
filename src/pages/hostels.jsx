import { Link } from "react-router-dom";

const hostels = [
  {
    id: 1,
    name: "Green View Hostel",
    location: "Nairobi",
    price: 12000,
    image: "https://images.unsplash.com/photo-1633411187642-f84216917af1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9zdGVsc3xlbnwwfHwwfHx8MA%3D%3D/400x200",
  },
  {
    id: 2,
    name: "Sunrise Hostel",
    location: "Kisumu",
    price: 10000,
    image: "https://plus.unsplash.com/premium_photo-1676321688630-9558e7d2be10?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWxzfGVufDB8fDB8fHww/400x200",
  },
];

export default function Hostels() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Available Hostels</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hostels.map((hostel) => (
          <div
            key={hostel.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <img
              src={hostel.image}
              alt={hostel.name}
              className="rounded-t-2xl w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold">{hostel.name}</h2>
              <p className="text-gray-600">{hostel.location}</p>

              <p className="font-bold mt-2">KES {hostel.price}</p>

              <Link
                to={`/hostels/${hostel.id}`}
                className="block mt-4 text-center bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Explore
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
