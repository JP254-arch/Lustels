import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faBed, faUserTie, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  faUsers,
  faHome,
  faLock,
  faCog,
  faBolt,
  faChartBar,
  faMobileAlt,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:4000/api";

const Homepage = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/hostels`);
        const shuffled = data.sort(() => 0.5 - Math.random());
        setHostels(shuffled.slice(0, 2));
      } catch (error) {
        console.error("Failed to fetch hostels", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  const features = [
    { title: "Role-Based Access", desc: "Admins, wardens, and students access only what they are authorized to see.", icon: faUsers },
    { title: "Real-Time Allocation", desc: "Instant room assignment and occupancy tracking with zero conflicts.", icon: faHome },
    { title: "Secure Records", desc: "Encrypted credentials and protected student information.", icon: faLock },
    { title: "Scalable Architecture", desc: "Easily supports multiple hostels and thousands of students.", icon: faCog },
    { title: "Automated Workflows", desc: "Reduce paperwork with system-driven processes.", icon: faBolt },
    { title: "Audit & Reports", desc: "Track changes, payments, and activities with transparency.", icon: faChartBar },
    { title: "Mobile Friendly", desc: "Fully responsive dashboards across all devices.", icon: faMobileAlt },
    { title: "Future Ready", desc: "Designed to integrate payments, alerts, and analytics.", icon: faRocket },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ================= HERO ================= */}
      <section className="bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Smart Hostel Management Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Manage Hostels <br />
              <span className="text-blue-700">Smarter, Faster, Better</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mb-10">
              Lustels is a modern hostel management system built for schools and
              institutions to manage students, rooms, fees, and operations —
              securely and efficiently.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow hover:bg-blue-800 transition"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 rounded-xl font-semibold border hover:bg-slate-100 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl shadow-xl p-10 border">
              <h3 className="text-xl font-semibold text-blue-700 mb-6">
                What Lustels Solves
              </h3>
              <ul className="space-y-4 text-slate-600">
                <li>✔ Manual hostel records & errors</li>
                <li>✔ Room overbooking & confusion</li>
                <li>✔ Unclear fee tracking</li>
                <li>✔ Poor student visibility</li>
                <li>✔ Lack of accountability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Built for Modern Institutions</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Lustels combines automation, security, and real-time data to simplify
            hostel operations at every level.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-8 shadow hover:shadow-lg transition flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={feature.icon} className="text-blue-700 w-6 h-6" />
                <h4 className="font-semibold text-blue-700 text-lg">{feature.title}</h4>
              </div>
              <p className="text-sm text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOSTELS ================= */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-extrabold">Top Hostels</h2>
            <Link to="/hostels" className="text-blue-700 font-semibold hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <p className="text-slate-500">Loading hostels...</p>
          ) : hostels.length === 0 ? (
            <p className="text-slate-500">No hostels available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              {hostels
                .filter((h) => h.status === "active")
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .map((hostel) => (
                  <div
                    key={hostel._id}
                    className="bg-white rounded-2xl shadow border overflow-hidden hover:shadow-xl transition flex flex-col"
                  >
                    <img
                      src={hostel.imageUrl || "https://via.placeholder.com/400x200"}
                      alt={hostel.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-blue-700">{hostel.name}</h3>
                        {hostel.genderPolicy && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">
                            {hostel.genderPolicy}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 mb-1 flex items-center gap-1">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" /> {hostel.location}
                      </p>

                      <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                        <FontAwesomeIcon icon={faBed} className="text-green-500" /> {hostel.roomType} room · {hostel.totalRooms || "N/A"} rooms
                      </p>

                      <p className="text-sm text-slate-500 mb-2 flex items-center gap-1">
                        <FontAwesomeIcon icon={faUserTie} className="text-rose-500" /> Warden: <span className="font-medium">{hostel.assignedWarden?.user?.name || "Unassigned"}</span>
                      </p>

                      <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
                        {hostel.amenities?.slice(0, 3).map((amenity) => (
                          <span key={amenity} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                            <FontAwesomeIcon icon={faCheck} className="text-green-500 text-[0.7rem]" /> {amenity}
                          </span>
                        ))}
                        {hostel.amenities?.length > 3 && (
                          <span className="text-gray-400">+{hostel.amenities.length - 3} more</span>
                        )}
                      </div>

                      <p className="text-lg font-bold mb-4">
                        KES {hostel.price.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500"> / month</span>
                      </p>

                      <Link
                        to={`/hostels/${hostel._id}`}
                        className="mt-auto block text-center bg-blue-700 text-white py-2 rounded-xl hover:bg-blue-800 transition flex justify-center items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> View Details
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-blue-700 text-white py-24 px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-6">Start Managing Hostels the Right Way</h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
          Join institutions moving away from spreadsheets and manual processes.
          Lustels gives you control, clarity, and confidence.
        </p>
        <Link
          to="/login"
          className="bg-white text-blue-700 px-10 py-4 rounded-xl font-semibold shadow hover:scale-105 transition"
        >
          Access System
        </Link>
      </section>

    </div>
  );
};

export default Homepage;
