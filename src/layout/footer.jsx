import React from 'react';
import logo from '../assets/logo.jpeg'; // Make sure the path is correct

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-auto overflow-hidden">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">

        {/* Logo Section */}
        <div className="text-center md:text-left">
          <a href="/" className="flex items-center justify-center md:justify-start mb-4">
            <img src={logo} alt="Lustels Logo" className="rounded-full w-20 h-20 md:w-24 md:h-24 shadow-lg" />
            <span className="ml-3 text-xl md:text-2xl font-bold text-blue-700">Lustels</span>
          </a>
          <p className="text-blue-400 opacity-80 animate-pulse-slow">Smart Hostel Management</p>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h5 className="text-blue-500 font-semibold mb-2">Address</h5>
          <p>123 School Lane, Education City</p>

          <h5 className="text-blue-500 font-semibold mt-4 mb-2">Contact</h5>
          <div className="flex flex-col space-y-1">
            <a href="tel:+1234567890" className="hover:text-blue-700 transition">+123 456 7890</a>
            <a href="mailto:support@lustels.com" className="hover:text-blue-700 transition">support@lustels.com</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h5 className="text-blue-500 font-semibold mb-2">Quick Links</h5>
          <div className="flex flex-col space-y-1 mb-4">
            <a href="/" className="hover:text-blue-700 transition">Home</a>
            <a href="/about" className="hover:text-blue-700 transition">About</a>
            <a href="/contact" className="hover:text-blue-700 transition">Contact</a>
          </div>
        </div>
      </div>

      <hr className="border-gray-700 my-4" />
      <div className="text-center text-gray-400 text-sm pb-4">
        © {new Date().getFullYear()} Lustels. All rights reserved.
      </div>

      <style>
        {`
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
        `}
      </style>
    </footer>
  );
};

export default Footer;
