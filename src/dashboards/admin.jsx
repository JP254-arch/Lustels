import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock Data
const mockHostels = [
    {
        id: 1,
        name: 'Green View Hostel',
        location: 'Nairobi',
        totalRooms: 10,
        bedsPerRoom: 2,
        assignedWarden: 'Mary Warden',
        status: 'active',
        price: 12000,
    },
    {
        id: 2,
        name: 'Sunrise Hostel',
        location: 'Kisumu',
        totalRooms: 8,
        bedsPerRoom: 4,
        assignedWarden: 'John Warden',
        status: 'inactive',
        price: 10000,
    },
];

const mockWardens = [
    { id: 1, name: 'Mary Warden', email: 'mary@example.com', assignedHostel: 'Green View Hostel' },
    { id: 2, name: 'John Warden', email: 'john@example.com', assignedHostel: 'Sunrise Hostel' },
];

const mockResidents = [
    {
        id: 1,
        name: 'John Doe',
        hostel: 'Green View Hostel',
        roomType: 'Single',
        checkIn: '2026-01-01',
        checkOut: '2026-03-01',
        monthlyAmount: 12000,
        paid: 18000,
        loan: 5000,
    },
    {
        id: 2,
        name: 'Alice Smith',
        hostel: 'Sunrise Hostel',
        roomType: 'Double',
        checkIn: '2026-02-01',
        checkOut: '2026-04-01',
        monthlyAmount: 10000,
        paid: 20000,
        loan: 3000,
    },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminProfile, setAdminProfile] = useState({ username: 'Admin', email: 'admin@example.com' });

    // Totals
    const totalHostels = mockHostels.length;
    const totalWardens = mockWardens.length;
    const totalResidents = mockResidents.length;
    const totalRevenue = mockResidents.reduce((acc, r) => acc + r.paid, 0);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        alert('Profile updated (mock)');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-orange-900 text-white flex flex-col p-4">
                <h2 className="text-2xl font-bold mb-6">Admin Menu</h2>
                <nav className="flex flex-col gap-3">
                    <button onClick={() => navigate('/admin')} className="hover:bg-orange-700 px-4 py-2 rounded">Dashboard</button>
                    <button onClick={() => navigate('/admin/hostel-form')} className="hover:bg-orange-700 px-4 py-2 rounded">Add Hostel</button>
                    <button onClick={() => navigate('/admin/manage-hostels')} className="hover:bg-orange-700 px-4 py-2 rounded">Manage Hostels</button>
                    <button onClick={() => navigate('/admin/warden-form')} className="hover:bg-orange-700 px-4 py-2 rounded">Add Warden</button>
                    <button onClick={() => navigate('/admin/manage-wardens')} className="hover:bg-orange-700 px-4 py-2 rounded">Manage Wardens</button>
                    <button onClick={() => navigate('/admin/manage-residents')} className="hover:bg-orange-700 px-4 py-2 rounded">Manage Residents</button>
                    <button onClick={() => navigate('/admin/reports')} className="hover:bg-orange-700 px-4 py-2 rounded">Reports</button>
                    <button onClick={() => navigate('/login')} className="hover:bg-red-600 px-4 py-2 rounded mt-4">Logout</button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">👑 Admin Dashboard</h1>
                <span className="mb-6 block">Logged in as <strong>{adminProfile.username}</strong> ({adminProfile.email})</span>

                {/* Totals */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow text-center">🏨 Hostels: {totalHostels}</div>
                    <div className="bg-white p-4 rounded-xl shadow text-center">👥 Wardens: {totalWardens}</div>
                    <div className="bg-white p-4 rounded-xl shadow text-center">🧑‍🤝‍🧑 Residents: {totalResidents}</div>
                    <div className="bg-white p-4 rounded-xl shadow text-center">💰 Revenue: KES {totalRevenue.toLocaleString()}</div>
                </div>

                {/* Quick Links */}
                <div className="bg-white p-4 rounded-xl shadow mb-6">
                    <h2 className="font-bold mb-2">Quick Links</h2>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => navigate('/hostel-form')} className="bg-blue-600 text-white px-4 py-2 rounded">
                            ➕ Add Hostel
                        </button>
                        <button onClick={() => navigate('/manage-hostels')} className="bg-green-600 text-white px-4 py-2 rounded">
                            🛠️ Manage Hostels
                        </button>
                        <button onClick={() => navigate('/warden-form')} className="bg-yellow-600 text-white px-4 py-2 rounded">
                            ➕ Add Warden
                        </button>
                        <button onClick={() => navigate('/manage-wardens')} className="bg-purple-600 text-white px-4 py-2 rounded">
                            🛠️ Manage Wardens
                        </button>
                        <button onClick={() => navigate('/manage-residents')} className="bg-indigo-600 text-white px-4 py-2 rounded">
                            🛠️ Manage Residents
                        </button>
                        <button onClick={() => navigate('/reports')} className="bg-gray-600 text-white px-4 py-2 rounded">
                            📊 Reports
                        </button>
                    </div>
                </div>


                {/* Hostels Table */}
                <div className="bg-white p-4 rounded-xl shadow mb-6">
                    <h2 className="font-bold mb-2">🏨 Hostels</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Location</th>
                                <th className="border p-2">Total Rooms</th>
                                <th className="border p-2">Beds per Room</th>
                                <th className="border p-2">Assigned Warden</th>
                                <th className="border p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockHostels.map(h => (
                                <tr key={h.id} className="text-center border-t">
                                    <td className="border p-2">{h.name}</td>
                                    <td className="border p-2">{h.location}</td>
                                    <td className="border p-2">{h.totalRooms}</td>
                                    <td className="border p-2">{h.bedsPerRoom}</td>
                                    <td className="border p-2">{h.assignedWarden}</td>
                                    <td className="border p-2">{h.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Wardens Table */}
                <div className="bg-white p-4 rounded-xl shadow mb-6">
                    <h2 className="font-bold mb-2">👮 Wardens</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Assigned Hostel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockWardens.map(w => (
                                <tr key={w.id} className="text-center border-t">
                                    <td className="border p-2">{w.name}</td>
                                    <td className="border p-2">{w.email}</td>
                                    <td className="border p-2">{w.assignedHostel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Residents Table */}
                <div className="bg-white p-4 rounded-xl shadow mb-6">
                    <h2 className="font-bold mb-2">👥 Residents</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Hostel</th>
                                <th className="border p-2">Room Type</th>
                                <th className="border p-2">Check-in</th>
                                <th className="border p-2">Check-out</th>
                                <th className="border p-2">Amount Paid</th>
                                <th className="border p-2">Remaining</th>
                                <th className="border p-2">Loan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockResidents.map(r => {
                                const months = (new Date(r.checkOut).getFullYear() - new Date(r.checkIn).getFullYear()) * 12 + (new Date(r.checkOut).getMonth() - new Date(r.checkIn).getMonth()) + 1;
                                const totalAmount = months * r.monthlyAmount;
                                const remaining = totalAmount - r.paid;
                                return (
                                    <tr key={r.id} className="text-center border-t">
                                        <td className="border p-2">{r.name}</td>
                                        <td className="border p-2">{r.hostel}</td>
                                        <td className="border p-2">{r.roomType}</td>
                                        <td className="border p-2">{r.checkIn}</td>
                                        <td className="border p-2">{r.checkOut}</td>
                                        <td className="border p-2">KES {r.paid.toLocaleString()}</td>
                                        <td className="border p-2">KES {remaining.toLocaleString()}</td>
                                        <td className="border p-2">KES {r.loan.toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Profile Section */}
                <div className="bg-white p-4 rounded-xl shadow mb-6">
                    <h2 className="font-bold mb-2">👤 Profile</h2>
                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={adminProfile.username} readOnly className="border p-2 rounded bg-gray-100" />
                        <input type="email" value={adminProfile.email} onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })} className="border p-2 rounded" />
                        <button type="submit" className="bg-orange-900 text-white px-4 py-2 rounded md:col-span-2">Update Profile</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
