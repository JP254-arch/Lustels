import { useState } from "react";
import ResidentForm from "../Forms/residentform";

const mockResidents = [
  {
    id: 1,
    fullName: "John Doe",
    gender: "Male",
    hostel: "Green View Hostel",
    roomType: "Single",
    checkIn: "2026-01-01",
    checkOut: "2026-03-01",
    monthlyRent: 12000,
    deposit: 2000,
    amountPaid: 18000,
    status: "active",
    photo: "https://via.placeholder.com/100",
  },
];

export default function ManageResidents() {
  const [residents, setResidents] = useState(mockResidents);
  const [editingResident, setEditingResident] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ---------------- CALCULATIONS ----------------
  const calculateMonths = (r) => {
    if (!r.checkIn || !r.checkOut) return 0;
    const start = new Date(r.checkIn);
    const end = new Date(r.checkOut);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    return months > 0 ? months : 0;
  };

  const calculateAmount = (r) => calculateMonths(r) * Number(r.monthlyRent || 0);
  const calculatePaid = (r) => Number(r.amountPaid || 0) + Number(r.deposit || 0);
  const calculateBalance = (r) => calculateAmount(r) - calculatePaid(r);

  // ---------------- HANDLE SAVE ----------------
  const handleSave = (resident) => {
    if (editingResident) {
      setResidents(prev =>
        prev.map(r => r.id === editingResident.id ? { ...r, ...resident } : r)
      );
    } else {
      setResidents(prev => [...prev, { ...resident, id: prev.length + 1 }]);
    }
    setShowForm(false);
    setEditingResident(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Residents</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              ➕ Add Resident
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Photo</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Hostel</th>
                  <th className="p-2">Room</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Paid</th>
                  <th className="p-2">Balance</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {residents.map(r => {
                  const amount = calculateAmount(r);
                  const paid = calculatePaid(r);
                  const balance = calculateBalance(r);

                  return (
                    <tr key={r.id} className="text-center border-t">
                      <td className="p-2">
                        <img src={r.photo} alt="" className="w-12 h-12 rounded-full mx-auto" />
                      </td>
                      <td className="p-2">{r.fullName}</td>
                      <td className="p-2">{r.hostel}</td>
                      <td className="p-2">{r.roomType}</td>
                      <td className="p-2">KES {amount.toLocaleString()}</td>
                      <td className="p-2">KES {paid.toLocaleString()}</td>
                      <td className={`p-2 font-semibold ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
                        KES {balance.toLocaleString()}
                      </td>
                      <td className="p-2">
                        <span className={`px-3 py-1 rounded-full text-white text-sm ${r.status === "active" ? "bg-green-500" : "bg-gray-500"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => { setEditingResident(r); setShowForm(true); }}
                          className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <ResidentForm
          residentData={editingResident}
          onSubmit={handleSave}
          onCancel={() => { setShowForm(false); setEditingResident(null); }}
        />
      )}
    </div>
  );
}
