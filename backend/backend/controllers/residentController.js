// 📁 controllers/residentController.js
import Resident from "../models/Resident.js";
import User from "../models/User.js";

// ================= GET CURRENT RESIDENT =================
export const getCurrentResident = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const resident = await Resident.findOne({ user: userId })
      .populate("user", "name email contact role gender profilePhoto")
      .populate("hostel", "name location image amenities")
      .populate("assignedWarden", "name email");

    if (!resident) {
      // If resident record doesn't exist yet, return safe defaults
      const user = await User.findById(userId).select(
        "name email contact role gender profilePhoto"
      );
      return res.json({
        _id: null,
        user,
        hostel: null,
        roomType: null,
        roomNumber: null,
        bedNumber: null,
        assignedWarden: null,
        status: "active",
        checkIn: null,
        checkOut: null,
        amountPerMonth: 0,
        amountPaid: 0,
        amenities: [],
        notes: "",
      });
    }

    // Ensure safe defaults and format dates for frontend
    const safeResident = {
      ...resident.toObject(),
      roomType: resident.roomType || null,
      roomNumber: resident.roomNumber || null,
      bedNumber: resident.bedNumber || null,
      status: resident.status || "active",
      checkIn: resident.checkIn ? new Date(resident.checkIn).toISOString() : null,
      checkOut: resident.checkOut ? new Date(resident.checkOut).toISOString() : null,
      amountPerMonth: resident.amountPerMonth || 0,
      amountPaid: resident.amountPaid || 0,
      availableLoan: resident.availableLoan || 0,
      notes: resident.notes || "",
      amenities: resident.hostel?.amenities || [],
    };

    res.json(safeResident);
  } catch (err) {
    console.error("GET CURRENT RESIDENT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch resident data" });
  }
};

// ================= UPDATE RESIDENT =================
export const updateResident = async (req, res) => {
  try {
    const { hostel, roomNumber, bedNumber, checkIn, checkOut, ...rest } = req.body;

    const updateData = { ...rest, hostel, roomNumber, bedNumber };

    // Auto-set check-in to today if hostel assigned and null
    if (hostel && !checkIn) {
      updateData.checkIn = new Date();
    } else if (checkIn) {
      updateData.checkIn = new Date(checkIn);
    }

    // Auto-set check-out to one month from today if null
    if (hostel && !checkOut) {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      updateData.checkOut = nextMonth;
    } else if (checkOut) {
      updateData.checkOut = new Date(checkOut);
    }

    const updatedResident = await Resident.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("hostel", "name location image amenities")
      .populate("assignedWarden", "name email");

    res.json(updatedResident);
  } catch (err) {
    console.error("UPDATE RESIDENT ERROR:", err);
    res.status(400).json({ message: "Failed to update resident", error: err.message });
  }
};
