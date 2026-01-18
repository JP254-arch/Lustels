import express from "express";
import Resident from "../models/Resident.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= GET CURRENT LOGGED-IN RESIDENT ================= */
router.get("/me", protect, async (req, res) => {
  try {
    const resident = await Resident.findOne({ user: req.user._id })
      .populate("hostel", "name location image amenities")
      .populate("assignedWarden", "name email");

    if (!resident) {
      return res.json({
        user: req.user,
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
        availableLoan: 0,
        notes: "",
        amenities: [],
      });
    }

    res.json(resident);
  } catch (err) {
    console.error("GET CURRENT RESIDENT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch resident data" });
  }
});

/* ================= GET ALL RESIDENTS (ADMIN ONLY) ================= */
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const residents = await Resident.find()
      .populate("hostel", "name")
      .populate("assignedWarden", "name email");

    res.json(residents);
  } catch (err) {
    console.error("GET ALL RESIDENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch residents" });
  }
});

/* ================= GET RESIDENT BY ID (ADMIN ONLY) ================= */
router.get("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id)
      .populate("hostel", "name")
      .populate("assignedWarden", "name email");

    if (!resident) return res.status(404).json({ message: "Resident not found" });

    res.json(resident);
  } catch (err) {
    console.error("GET RESIDENT BY ID ERROR:", err);
    res.status(500).json({ message: "Failed to fetch resident" });
  }
});

/* ================= CREATE RESIDENT (ADMIN ONLY) ================= */
router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const resident = new Resident(req.body);
    const saved = await resident.save();

    await saved.populate("hostel", "name");
    await saved.populate("assignedWarden", "name email");

    res.status(201).json(saved);
  } catch (err) {
    console.error("CREATE RESIDENT ERROR:", err);
    res.status(400).json({ message: "Failed to create resident", error: err.message });
  }
});

/* ================= UPDATE RESIDENT (ADMIN ONLY) ================= */
router.put("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const updated = await Resident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Resident not found" });

    await updated.populate("hostel", "name");
    await updated.populate("assignedWarden", "name email");

    res.json(updated);
  } catch (err) {
    console.error("UPDATE RESIDENT ERROR:", err);
    res.status(400).json({ message: "Failed to update resident", error: err.message });
  }
});

/* ================= DELETE RESIDENT (ADMIN ONLY) ================= */
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const deleted = await Resident.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Resident not found" });
    res.json({ message: "Resident deleted successfully" });
  } catch (err) {
    console.error("DELETE RESIDENT ERROR:", err);
    res.status(500).json({ message: "Failed to delete resident" });
  }
});

export default router;
