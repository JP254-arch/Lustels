import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();

  // AUTH STATE
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = Boolean(token && user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserMenu(false);
    navigate("/login");
  };

  const dashboardRoute =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "warden"
      ? "/warden"
      : user?.role === "resident"
      ? "/resident"
      : "/";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-bold text-blue-700 text-lg">Lustels</span>
        </Link>

        {/* DESKTOP LINKS (ALWAYS PUBLIC) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-700 font-medium">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-700 font-medium">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-700 font-medium">
            Contact
          </Link>
          <Link to="/hostels" className="text-gray-700 hover:text-blue-700 font-medium">
            Hostels
          </Link>

          {/* USER ICON */}
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 transition shadow-sm"
            >
              <i className="fa fa-user text-gray-700" />
            </button>

            {userMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="block px-4 py-2 text-gray-700 font-medium truncate">
                      {user.name}
                    </span>
                    <Link
                      to={dashboardRoute}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-blue-700">
            <i className="fa fa-bars text-2xl" />
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl p-2 space-y-1 md:hidden z-40">
            <Link to="/" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Home
            </Link>
            <Link to="/about" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              About
            </Link>
            <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Contact
            </Link>
            <Link to="/hostels" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Hostels
            </Link>

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={dashboardRoute}
                  className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
