import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow py-12 px-4 w-full max-w-6xl mx-auto">
        {/* Outlet will render the matched route component */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
