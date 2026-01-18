import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  /* ================= AUTH STATE ================= */
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = Boolean(token && user);

  const dashboardRoute =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "warden"
      ? "/warden"
      : user?.role === "resident"
      ? "/resident"
      : "/";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Lustels Logo"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-rose-600">
              Lustels
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/hostels">Hostels</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <FontAwesomeIcon icon={faUser} className="text-gray-700" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border py-2">
                  {!isAuthenticated ? (
                    <>
                      <MenuLink to="/login" onClick={() => setUserMenuOpen(false)}>
                        Sign In
                      </MenuLink>
                      <MenuLink to="/register" onClick={() => setUserMenuOpen(false)}>
                        Create Account
                      </MenuLink>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 truncate">
                        {user.name}
                      </div>
                      <MenuLink to={dashboardRoute} onClick={() => setUserMenuOpen(false)}>
                        Dashboard
                      </MenuLink>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={mobileOpen ? faXmark : faBars}
              className="text-2xl"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl transition-all duration-300 ${
            mobileOpen ? "max-h-screen py-4" : "max-h-0 overflow-hidden"
          }`}
        >
          <MobileLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
          <MobileLink to="/hostels" onClick={() => setMobileOpen(false)}>Hostels</MobileLink>
          <MobileLink to="/about" onClick={() => setMobileOpen(false)}>About</MobileLink>
          <MobileLink to="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileLink>

          <div className="border-t pt-3">
            {!isAuthenticated ? (
              <>
                <MobileLink to="/login" onClick={() => setMobileOpen(false)}>Sign In</MobileLink>
                <MobileLink to="/register" onClick={() => setMobileOpen(false)}>Create Account</MobileLink>
              </>
            ) : (
              <>
                <MobileLink to={dashboardRoute} onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

/* ================= Reusable Components ================= */
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-700 font-medium hover:text-rose-600 transition"
  >
    {children}
  </Link>
);

const MenuLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
  >
    {children}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition"
  >
    {children}
  </Link>
);

export default Navbar;
