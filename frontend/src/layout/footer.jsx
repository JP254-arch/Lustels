import React from "react";
import logo from "../assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Lustels Logo"
              className="w-14 h-14 rounded-full shadow-md"
            />
            <span className="text-2xl font-bold text-white">Lustels</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Smart hostel management made simple. Manage residents, payments,
            and hostels with confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-rose-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-rose-400 transition">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-rose-400 transition">
                Contact
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-rose-400 transition">
                Login
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="text-gray-400">
              123 School Lane, Education City
            </li>
            <li>
              <a
                href="tel:+1234567890"
                className="hover:text-rose-400 transition"
              >
                +123 456 7890
              </a>
            </li>
            <li>
              <a
                href="mailto:support@lustels.com"
                className="hover:text-rose-400 transition"
              >
                support@lustels.com
              </a>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold">Get Started</h4>
          <p className="text-sm text-gray-400">
            Create an account and start managing your hostel efficiently today.
          </p>
          <a
            href="/register"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Create an Account
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Lustels. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="/privacy" className="hover:text-rose-400 transition">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-rose-400 transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
