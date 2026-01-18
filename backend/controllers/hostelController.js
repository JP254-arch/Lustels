import Hostel from "../models/Hostel.js";
import Warden from "../models/Warden.js";

/* ======================================================
   GET ALL HOSTELS
   - Populates assigned wardens and their user names
====================================================== */
export const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find()
      .populate({
        path: "assignedWardens",
        populate: { path: "user", select: "name email" },
      });

    res.status(200).json(hostels);
  } catch (error) {
    console.error("GET HOSTELS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hostels" });
  }
};

/* ======================================================
   GET SINGLE HOSTEL
====================================================== */
export const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate({
      path: "assignedWardens",
      populate: { path: "user", select: "name email" },
    });

    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    res.status(200).json(hostel);
  } catch (error) {
    console.error("GET HOSTEL ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hostel" });
  }
};

/* ======================================================
   CREATE HOSTEL
   - Supports optional and multiple warden assignment
====================================================== */
export const createHostel = async (req, res) => {
  try {
    const { assignedWardens, ...hostelData } = req.body;

    // Create hostel first
    const hostel = await Hostel.create(hostelData);

    // If wardens are provided, update their assignedHostels
    if (assignedWardens?.length) {
      await Warden.updateMany(
        { _id: { $in: assignedWardens } },
        { $addToSet: { assignedHostels: hostel._id } }
      );

      hostel.assignedWardens = assignedWardens;
      await hostel.save();
    }

    const populatedHostel = await Hostel.findById(hostel._id).populate({
      path: "assignedWardens",
      populate: { path: "user", select: "name email" },
    });

    res.status(201).json(populatedHostel);
  } catch (error) {
    console.error("CREATE HOSTEL ERROR:", error);
    res.status(500).json({ message: "Failed to create hostel" });
  }
};

/* ======================================================
   UPDATE HOSTEL
   - Maintains consistency with multiple assigned wardens
====================================================== */
export const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    const { assignedWardens, ...updateData } = req.body;

    // Update hostel fields
    Object.assign(hostel, updateData);
    await hostel.save();

    if (assignedWardens) {
      // Remove hostel from wardens no longer assigned
      await Warden.updateMany(
        { assignedHostels: hostel._id, _id: { $nin: assignedWardens } },
        { $pull: { assignedHostels: hostel._id } }
      );

      // Add hostel to newly assigned wardens
      await Warden.updateMany(
        { _id: { $in: assignedWardens } },
        { $addToSet: { assignedHostels: hostel._id } }
      );

      hostel.assignedWardens = assignedWardens;
      await hostel.save();
    }

    const populatedHostel = await Hostel.findById(hostel._id).populate({
      path: "assignedWardens",
      populate: { path: "user", select: "name email" },
    });

    res.status(200).json(populatedHostel);
  } catch (error) {
    console.error("UPDATE HOSTEL ERROR:", error);
    res.status(500).json({ message: "Failed to update hostel" });
  }
};

/* ======================================================
   DELETE HOSTEL
   - Removes hostel from assigned wardens
====================================================== */
export const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    if (hostel.assignedWardens?.length) {
      await Warden.updateMany(
        { _id: { $in: hostel.assignedWardens } },
        { $pull: { assignedHostels: hostel._id } }
      );
    }

    await hostel.deleteOne();
    res.status(200).json({ message: "Hostel deleted successfully" });
  } catch (error) {
    console.error("DELETE HOSTEL ERROR:", error);
    res.status(500).json({ message: "Failed to delete hostel" });
  }
};
