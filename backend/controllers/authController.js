import User from "../models/User.js";
import Resident from "../models/Resident.js";
import jwt from "jsonwebtoken";

/* =========================================================
   REGISTER (RESIDENT ONLY)
   - Password is NOT hashed here
   - User schema pre-save hook handles hashing
========================================================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Plain password — hashing is handled by User model
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "resident",
      contact: contact?.trim() || "",
    });

    await Resident.create({
      user: user._id,
      name: user.name,
      email: user.email,
      contact: user.contact,
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
    });

    return res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/* =========================================================
   LOGIN (ALL ROLES)
========================================================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    let residentProfile = null;
    if (user.role === "resident") {
      residentProfile = await Resident.findOne({ user: user._id })
        .populate("hostel", "name location image amenities")
        .populate("assignedWarden", "name email");
    }

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        residentProfile,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* =========================================================
   GET / UPDATE CURRENT USER
========================================================= */
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ================= UPDATE PROFILE ================= */
    if (req.method === "PUT") {
      const { name, email, contact, password } = req.body;

      if (name) user.name = name.trim();
      if (email) user.email = email.toLowerCase().trim();
      if (contact !== undefined) user.contact = contact.trim();

      // ✅ Plain password only — schema hashes it
      if (password) {
        user.password = password;
      }

      await user.save();

      return res.json({
        message: "Profile updated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          contact: user.contact,
        },
      });
    }

    /* ================= FETCH PROFILE ================= */
    let residentProfile = null;
    if (user.role === "resident") {
      residentProfile = await Resident.findOne({ user: user._id })
        .populate("hostel", "name location image amenities")
        .populate("assignedWarden", "name email");
    }

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        residentProfile,
      },
    });
  } catch (error) {
    console.error("❌ Me Error:", error);
    return res.status(500).json({ message: "Failed to fetch/update user" });
  }
};
