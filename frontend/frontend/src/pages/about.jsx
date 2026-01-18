import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-gray-800">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-5xl font-extrabold text-rose-600 mb-4">
            About <span className="text-indigo-700">Lustels</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Lustels is a modern, secure, and efficient hostel management system.
            We’re more than a system; we’re a platform built on transparency, security, and convenience for schools.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div
            className="floating-card bg-white shadow-lg rounded-2xl p-8 border-t-4 border-rose-400"
            data-aos="fade-right"
          >
            <h2 className="text-2xl font-bold text-rose-600 mb-4">🎯 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To simplify hostel management and empower schools with tools for student tracking, room allocation, and fee management.
            </p>
          </div>
          <div
            className="floating-card bg-white shadow-lg rounded-2xl p-8 border-t-4 border-indigo-400"
            data-aos="fade-left"
          >
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">🌍 Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              We envision a world where hostel management is seamless, transparent, and accessible, ensuring a better experience for students and staff alike.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div
          className="floating-card bg-gradient-to-r from-indigo-100 to-rose-100 rounded-2xl shadow-xl p-10 mb-16"
          data-aos="zoom-in"
        >
          <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">📖 Our Story</h2>
          <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed text-center">
            Lustels was created to make hostel management simple and efficient.
            It centralizes student data, room allocations, fee management, and communications all in one platform.
            <br /><br />
            Through technology and community-driven design, Lustels transforms how schools manage hostels.
          </p>
        </div>

        {/* What We Offer */}
        <div className="text-center mb-20" data-aos="fade-up">
          <h2 className="text-3xl font-extrabold text-rose-600 mb-10">💎 What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="floating-card bg-white rounded-2xl shadow-md p-6" data-aos="fade-up" data-aos-delay="100">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">Role-based Dashboards</h3>
              <p className="text-gray-600">
                Separate dashboards for Admins, Wardens, Accounts, and Students for clear access control.
              </p>
            </div>
            <div className="floating-card bg-white rounded-2xl shadow-md p-6" data-aos="fade-up" data-aos-delay="200">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">Smart Room Management</h3>
              <p className="text-gray-600">
                Real-time room allocation and tracking with transparent records for all students.
              </p>
            </div>
            <div className="floating-card bg-white rounded-2xl shadow-md p-6" data-aos="fade-up" data-aos-delay="300">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">Fee Tracking</h3>
              <p className="text-gray-600">
                Secure fee management, payment tracking, and reporting for full transparency.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-3xl font-extrabold text-rose-600 mb-4">Join the Lustels Experience</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Experience the simplicity, transparency, and security of Lustels today. Manage hostels efficiently, all in one place.
          </p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 py-3 rounded-lg shadow-md font-semibold transition-all duration-200 transform hover:-translate-y-1"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* Floating & Hover Animations */}
      <style>
        {`
          .floating-card {
            transition: transform 0.5s ease, box-shadow 0.5s ease;
          }
          .floating-card:hover {
            transform: translateY(-10px) rotate(-1deg) scale(1.02);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          }
        `}
      </style>
    </div>
  );
};

export default About;
