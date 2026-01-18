import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faMapMarkerAlt,
  faCoins,
  faHouseChimney,
} from "@fortawesome/free-solid-svg-icons";

export default function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/hostels");
        setHostels(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch hostels.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getWardenName = (assignedWarden) =>
    assignedWarden?.user?.name || "Unassigned";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading hostels...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold"> <FontAwesomeIcon icon={faHouseChimney} />Available Hostels</h1>
        <p className="text-gray-600 text-sm">
          Browse verified hostels and choose the best option for you
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels
          .filter((h) => h.status === "active")
          .map((hostel) => (
            <div
              key={hostel._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={hostel.imageUrl || "https://via.placeholder.com/400x200"}
                alt={hostel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold">{hostel.name}</h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">
                    {hostel.genderPolicy}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{hostel.location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm capitalize">
                  <FontAwesomeIcon icon={faHouseChimney} />
                  <span>
                    {hostel.roomType} room · {hostel.totalRooms} rooms
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FontAwesomeIcon icon={faUserTie} />
                  <span>Warden: {getWardenName(hostel.assignedWarden)}</span>
                </div>

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

                <div className="flex items-center gap-2 text-lg font-bold pt-2">
                  <FontAwesomeIcon icon={faCoins} />
                  <span>
                    KES {hostel.price}
                    <span className="text-sm font-normal text-gray-500">/ month</span>
                  </span>
                </div>

                <Link
                  to={`/hostels/${hostel._id}`}
                  className="mt-3 block text-center bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
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
