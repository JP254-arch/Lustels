import React from 'react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-10 px-10 py-20 bg-blue-50">
        <div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Smart Hostel Management<br />for Modern Schools
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl">
            Lustels is a secure and efficient hostel management system designed to help schools manage students, rooms, fees, and discipline — all in one centralized platform.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800"
          >
            Get Started
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Why Lustels?</h3>
          <ul className="space-y-3 text-slate-600">
            <li>• Role-based dashboards</li>
            <li>• Real-time room allocation</li>
            <li>• Transparent fee tracking</li>
            <li>• Secure student records</li>
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="px-10 py-20">
        <h3 className="text-3xl font-bold text-center mb-14">Core System Features</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h4 className="font-semibold text-blue-700 mb-2">Admin Dashboard</h4>
            <p className="text-sm text-slate-600">
              Full system control including users, hostels, reports, and configurations.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <h4 className="font-semibold text-blue-700 mb-2">Warden Dashboard</h4>
            <p className="text-sm text-slate-600">
              Manage room allocations, attendance, discipline, and student movement.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <h4 className="font-semibold text-blue-700 mb-2">Accounts Dashboard</h4>
            <p className="text-sm text-slate-600">
              Track hostel fees, payments, balances, and generate financial reports.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <h4 className="font-semibold text-blue-700 mb-2">Student Dashboard</h4>
            <p className="text-sm text-slate-600">
              View room details, fee status, submit leave requests, and receive notices.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-blue-700 text-white px-10 py-20 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Simplify Hostel Management?</h3>
        <p className="mb-8 text-blue-100">
          Start using Lustels today and experience efficient, transparent, and secure hostel administration.
        </p>
        <a
          href="/login"
          className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold"
        >
          Access System
        </a>
      </section>
    </div>
  );
};

export default Homepage;
