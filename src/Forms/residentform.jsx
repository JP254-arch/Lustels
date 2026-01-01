import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= MOCK DATA ================= */
const hostels = [
  { id: 1, name: "Green View Hostel", totalRooms: 10, roomType: "Single", bedsPerRoom: 2, price: 12000, assignedWarden: "Mary Warden" },
  { id: 2, name: "Sunrise Hostel", totalRooms: 8, roomType: "Double", bedsPerRoom: 4, price: 10000, assignedWarden: "John Warden" },
];

const residents = [
  { id: 1, fullName: "John Doe", hostel: "Green View Hostel" },
  { id: 2, fullName: "Alice Smith", hostel: "Sunrise Hostel" },
];

const initialState = {
  fullName: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  hostel: "",
  roomType: "",
  bedsPerRoom: "",
  price: "",
  assignedWarden: "",
  totalRooms: 0,
  occupiedRooms: 0,
  availableRooms: 0,
  roomNumber: "",
  checkIn: "",
  checkOut: "",
  monthlyRent: "",
  deposit: "",
  amountPaid: "",
  status: "active",
  emergencyName: "",
  emergencyPhone: "",
  notes: "",
  photo: null,
};

export default function ResidentForm({ residentData = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (residentData) {
      setForm(residentData);
      setPreview(residentData.photo || null);
    }
  }, [residentData]);

  // -------------------- HANDLERS --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleHostelChange = (e) => {
    const selected = hostels.find(h => h.name === e.target.value);
    if (selected) {
      const hostelResidents = residents.filter(r => r.hostel === selected.name);
      const occupied = hostelResidents.length;
      const available = selected.totalRooms - occupied;

      setForm({
        ...form,
        hostel: selected.name,
        roomType: selected.roomType,
        bedsPerRoom: selected.bedsPerRoom,
        price: selected.price,
        assignedWarden: selected.assignedWarden,
        totalRooms: selected.totalRooms,
        occupiedRooms: occupied,
        availableRooms: available,
      });
    }
  };

  // -------------------- FINANCIAL CALCULATIONS --------------------
  const calculateMonths = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    return months > 0 ? months : 0;
  };

  const amount = calculateMonths() * Number(form.monthlyRent || 0);
  const paid = Number(form.amountPaid || 0) + Number(form.deposit || 0);
  const balance = amount - paid;

  // -------------------- SUBMIT --------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.hostel || !form.checkIn) {
      alert("Please fill all required fields.");
      return;
    }
    if (onSubmit) onSubmit({ ...form, amount, paid, balance });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">{residentData ? "Edit Resident" : "Add Resident"}</h1>
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* PERSONAL INFO */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="border p-3 rounded-xl w-full" required />
              <select name="gender" value={form.gender} onChange={handleChange} className="border p-3 rounded-xl w-full">
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} className="border p-3 rounded-xl w-full" />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-3 rounded-xl w-full" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-3 rounded-xl w-full" />
              <input type="file" accept="image/*" onChange={handleImage} className="border p-3 rounded-xl w-full" />
            </div>
            {preview && <img src={preview} alt="Preview" className="mt-4 h-28 w-28 object-cover rounded-full border" />}
          </section>

          {/* ACCOMMODATION */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Accommodation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="hostel"
                value={form.hostel}
                onChange={handleHostelChange}
                className="border p-3 rounded-xl w-full"
                required
              >
                <option value="">Select Hostel</option>
                {hostels.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
              </select>
              <input name="roomType" value={form.roomType} readOnly placeholder="Room Type" className="border p-3 rounded-xl bg-gray-100 w-full" />
              <input name="bedsPerRoom" value={form.bedsPerRoom} readOnly placeholder="Beds per Room" className="border p-3 rounded-xl bg-gray-100 w-full" />
              <input name="price" value={form.price} readOnly placeholder="Price per Month" className="border p-3 rounded-xl bg-gray-100 w-full" />
              <input name="assignedWarden" value={form.assignedWarden} readOnly placeholder="Assigned Warden" className="border p-3 rounded-xl bg-gray-100 w-full" />
              <input name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="Room / Bed No" className="border p-3 rounded-xl w-full" />
              <div className="col-span-1 md:col-span-1 flex flex-col gap-2">
                <input value={`Available Rooms: ${form.availableRooms || 0}`} readOnly className="border p-2 rounded-xl bg-green-100 text-green-800 font-semibold" />
                <input value={`Occupied Rooms: ${form.occupiedRooms || 0}`} readOnly className="border p-2 rounded-xl bg-red-100 text-red-800 font-semibold" />
              </div>
              <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} className="border p-3 rounded-xl w-full" required />
              <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} className="border p-3 rounded-xl w-full" />
              <select name="status" value={form.status} onChange={handleChange} className="border p-3 rounded-xl w-full">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="checked-out">Checked Out</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </section>

          {/* FINANCIAL */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                name="monthlyRent"
                value={form.monthlyRent}
                onChange={handleChange}
                placeholder="Monthly Rent"
                type="number"
                className="border p-3 rounded-xl w-full"
              />
              <input
                name="deposit"
                value={form.deposit}
                onChange={handleChange}
                placeholder="Deposit"
                type="number"
                className="border p-3 rounded-xl w-full"
              />
              <input
                name="amountPaid"
                value={form.amountPaid}
                onChange={handleChange}
                placeholder="Amount Paid"
                type="number"
                className="border p-3 rounded-xl w-full"
              />
              <input
                value={`Months: ${calculateMonths()}`}
                readOnly
                className="border p-3 rounded-xl bg-gray-100 w-full"
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
              <div className="p-2 border rounded-xl text-center">
                <p className="font-semibold">Amount</p>
                <p>KES {amount.toLocaleString()}</p>
              </div>
              <div className="p-2 border rounded-xl text-center">
                <p className="font-semibold">Paid</p>
                <p>KES {paid.toLocaleString()}</p>
              </div>
              <div className="p-2 border rounded-xl text-center">
                <p className="font-semibold">Balance</p>
                <p className={balance > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                  KES {balance.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* EMERGENCY */}
          <section>
            <h2 className="font-semibold mb-4 text-lg">Emergency & Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="emergencyName" value={form.emergencyName} onChange={handleChange} placeholder="Emergency Contact Name" className="border p-3 rounded-xl w-full" />
              <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} placeholder="Emergency Contact Phone" className="border p-3 rounded-xl w-full" />
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="border p-3 rounded-xl md:col-span-2 w-full" />
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onCancel || (() => navigate(-1))} className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-orange-900 text-white hover:bg-orange-700">{residentData ? "Update Resident" : "Save Resident"}</button>
          </div>

        </form>
      </div>
    </div>
  );
}
