import React, { useState } from "react";
import logo from "../assets/logo.jpeg"; // Make sure this path is correct

const Navbar = () => {
  const [open, setOpen] = useState(false); // Mobile menu
  const [userMenu, setUserMenu] = useState(false); // Dropdown menu
  const [user, setUser] = useState(null); // Example auth state

  const handleLogout = () => {
    setUser(null);
    setUserMenu(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-bold text-blue-700 text-lg">Lustels</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-5">
          <a href="/" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Home
          </a>
          <a href="/about" className="text-gray-700 hover:text-blue-700 font-medium transition">
            About
          </a>
          <a href="/contact" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Contact
          </a>
          <a href="/hostels" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Hostels
          </a>
          <a href="/client" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Client Dashboard
          </a>
          <a href="/warden" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Warden Dashboard
          </a>
          <a href="/admin" className="text-gray-700 hover:text-blue-700 font-medium transition">
            Admin Dashboard
          </a>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-shadow shadow-sm focus:outline-none"
            >
              <i className="fa fa-user text-gray-700"></i>
            </button>

            {userMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                {user ? (
                  <>
                    <span className="block px-4 py-2 text-gray-700 font-medium truncate">
                      Hello, {user.name}
                    </span>
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Login
                    </a>
                    <a
                      href="/register"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Register
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hamburger (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="focus:outline-none text-blue-700"
          >
            <i className="fa fa-bars text-2xl"></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="absolute right-0 top-full mt-3 w-56 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden z-40 flex flex-col p-2 space-y-1 md:hidden">
            <a
              href="/"
              className="px-4 py-2 hover:bg-gray-100 transition rounded-lg"
            >
              Home
            </a>
            <a
              href="/about"
              className="px-4 py-2 hover:bg-gray-100 transition rounded-lg"
            >
              About
            </a>
            <a
              href="/contact"
              className="px-4 py-2 hover:bg-gray-100 transition rounded-lg"
            >
              Contact
            </a>
            <a
              href="/hostels"
              className="px-4 py-2 hover:bg-gray-100 transition rounded-lg"
            >
              Hostels
            </a>

            {user ? (
              <>
                <span className="block px-4 py-2 text-gray-700 font-medium truncate">
                  Hello, {user.name}
                </span>
                <a
                  href="/dashboard"
                  className="px-4 py-2 hover:bg-gray-100 transition rounded-lg"
                >
                  Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2 hover:bg-gray-100 transition rounded-lg"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 hover:bg-gray-100 transition rounded-lg"
                >
                  Register
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
