import Warden from "../models/Warden.js";
import User from "../models/User.js";
import Hostel from "../models/Hostel.js";
import Resident from "../models/Resident.js";

/* ================= CREATE WARDEN (ADMIN ONLY) ================= */
export const createWarden = async (req, res) => {
  try {
    const { name, email, gender, phone = "", dob = null, assignedHostels = [], password } = req.body;

    if (!name || !email || !gender) {
      return res.status(400).json({ message: "Name, email, and gender are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists." });

    // Generate temporary password if none provided
    const tempPassword = password || Math.random().toString(36).slice(-8);

    const user = await User.create({
      name,
      email,
      password: tempPassword, // hashed automatically by model
      role: "warden",
    });

    // Validate hostels exist
    for (const hostelId of assignedHostels) {
      const hostel = await Hostel.findById(hostelId);
      if (!hostel) return res.status(400).json({ message: `Hostel ${hostelId} does not exist.` });
    }

    // Create Warden
    const warden = await Warden.create({
      user: user._id,
      gender,
      phone,
      dob,
      assignedHostels,
    });

    // Assign warden to hostels
    if (assignedHostels.length) {
      await Hostel.updateMany(
        { _id: { $in: assignedHostels } },
        { $addToSet: { wardens: warden._id } }
      );
    }

    const populatedWarden = await Warden.findById(warden._id)
      .populate("user", "name email role")
      .populate("assignedHostels", "name location");

    res.status(201).json({
      message: "Warden created successfully",
      temporaryPassword: tempPassword,
      warden: populatedWarden,
    });
  } catch (err) {
    console.error("CREATE WARDEN ERROR:", err);
    res.status(500).json({ message: "Failed to create warden", error: err.message });
  }
};

/* ================= GET ALL WARDENS (ADMIN ONLY) ================= */
export const getAllWardens = async (req, res) => {
  try {
    const wardens = await Warden.find()
      .populate("user", "name email role")
      .populate("assignedHostels", "name location");
    res.json(wardens);
  } catch (err) {
    console.error("GET ALL WARDENS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch wardens", error: err.message });
  }
};

/* ================= GET SINGLE WARDEN BY ID OR NAME ================= */
export const getWardenByIdOrName = async (req, res) => {
  try {
    const { idOrName } = req.params;
    let warden;

    if (/^[0-9a-fA-F]{24}$/.test(idOrName)) {
      warden = await Warden.findById(idOrName)
        .populate("user", "name email role")
        .populate("assignedHostels", "name location");
    }

    if (!warden) {
      const user = await User.findOne({ name: idOrName, role: "warden" });
      if (user) {
        warden = await Warden.findOne({ user: user._id })
          .populate("user", "name email role")
          .populate("assignedHostels", "name location");
      }
    }

    if (!warden) return res.status(404).json({ message: "Warden not found" });

    res.json(warden);
  } catch (err) {
    console.error("GET WARDEN ERROR:", err);
    res.status(500).json({ message: "Failed to fetch warden", error: err.message });
  }
};

/* ================= UPDATE WARDEN (ADMIN ONLY) ================= */
export const updateWarden = async (req, res) => {
  try {
    const { name, email, gender, phone, dob, assignedHostels, password } = req.body;
    const warden = await Warden.findById(req.params.id);
    if (!warden) return res.status(404).json({ message: "Warden not found" });

    const user = await User.findById(warden.user);
    if (name) user.name = name;
    if (email && email !== user.email) {
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: "Email already in use." });
      user.email = email;
    }
    if (password) user.password = password; // hashed automatically
    await user.save();

    if (gender) warden.gender = gender;
    if (phone !== undefined) warden.phone = phone;
    if (dob !== undefined) warden.dob = dob;

    if (assignedHostels) {
      await Hostel.updateMany({ wardens: warden._id }, { $pull: { wardens: warden._id } });
      await Hostel.updateMany({ _id: { $in: assignedHostels } }, { $addToSet: { wardens: warden._id } });
      warden.assignedHostels = assignedHostels;
    }

    await warden.save();

    const populatedWarden = await Warden.findById(warden._id)
      .populate("user", "name email role")
      .populate("assignedHostels", "name location");

    res.json({ message: "Warden updated successfully", warden: populatedWarden });
  } catch (err) {
    console.error("UPDATE WARDEN ERROR:", err);
    res.status(500).json({ message: "Failed to update warden", error: err.message });
  }
};

/* ================= DELETE WARDEN (ADMIN ONLY) ================= */
export const deleteWarden = async (req, res) => {
  try {
    const warden = await Warden.findById(req.params.id);
    if (!warden) return res.status(404).json({ message: "Warden not found" });

    await User.findByIdAndDelete(warden.user);
    await Hostel.updateMany({ wardens: warden._id }, { $pull: { wardens: warden._id } });
    await warden.remove();

    res.json({ message: "Warden deleted successfully" });
  } catch (err) {
    console.error("DELETE WARDEN ERROR:", err);
    res.status(500).json({ message: "Failed to delete warden", error: err.message });
  }
};

/* ================= WARDEN DASHBOARD ================= */
export const getMe = async (req, res) => {
  try {
    const warden = await Warden.findOne({ user: req.user._id })
      .populate("user", "name email role")
      .populate("assignedHostels", "name location");
    if (!warden) return res.status(404).json({ message: "Warden profile not found" });
    res.json(warden);
  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { email, contact, profilePhoto } = req.body;
    const warden = await Warden.findOne({ user: req.user._id });
    if (!warden) return res.status(404).json({ message: "Warden profile not found" });

    if (contact !== undefined) warden.contact = contact;
    if (profilePhoto !== undefined) warden.profilePhoto = profilePhoto;

    const user = await User.findById(req.user._id);
    if (email && email !== user.email) {
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: "Email already in use." });
      user.email = email;
      await user.save();
    }

    await warden.save();
    const populatedWarden = await Warden.findById(warden._id)
      .populate("user", "name email role")
      .populate("assignedHostels", "name location");

    res.json({ message: "Profile updated successfully", warden: populatedWarden });
  } catch (err) {
    console.error("UPDATE MY PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

export const getMyHostels = async (req, res) => {
  try {
    const warden = await Warden.findOne({ user: req.user._id }).populate(
      "assignedHostels",
      "name location price totalRooms imageUrl"
    );
    if (!warden) return res.status(404).json({ message: "Warden profile not found" });
    res.json(warden.assignedHostels);
  } catch (err) {
    console.error("GET MY HOSTELS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch hostels", error: err.message });
  }
};

export const getMyResidents = async (req, res) => {
  try {
    const warden = await Warden.findOne({ user: req.user._id });
    if (!warden) return res.status(404).json({ message: "Warden profile not found" });

    const residents = await Resident.find({ hostel: { $in: warden.assignedHostels } })
      .populate("user", "name contact")
      .populate("hostel", "name price");

    res.json(residents);
  } catch (err) {
    console.error("GET MY RESIDENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch residents", error: err.message });
  }
};

/* ================= ADMIN: UPDATE WARDEN PASSWORD ================= */
export const updateWardenPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const warden = await Warden.findById(req.params.id);
    if (!warden) return res.status(404).json({ message: "Warden not found" });

    const user = await User.findById(warden.user);
    if (!user) return res.status(404).json({ message: "User not found for this warden" });

    user.password = password; // hashed automatically by model
    await user.save();

    res.json({ message: "Warden password updated successfully. Warden can now log in." });
  } catch (err) {
    console.error("UPDATE WARDEN PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to update password", error: err.message });
  }
};
