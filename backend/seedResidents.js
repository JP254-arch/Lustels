import mongoose from "mongoose";
import dotenv from "dotenv";
import Hostel from "./models/Hostel.js";
import Warden from "./models/Warden.js";
import Resident from "./models/Resident.js";

dotenv.config();

const residentsSeed = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined in .env");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch existing hostels & wardens
    const hostels = await Hostel.find();
    const wardens = await Warden.find();

    if (hostels.length === 0 || wardens.length === 0) {
      console.log("❌ No hostels or wardens found. Seed them first.");
      process.exit(1);
    }

    // Clear existing residents
    await Resident.deleteMany();
    console.log("🗑️ Cleared existing residents");

    const sampleResidents = [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "0712345678",
        gender: "male",
        hostel: hostels[0]._id,
        assignedWarden: wardens[0]._id,
        roomNumber: "101",
        bedNumber: "1",
        status: "active",
        checkInDate: new Date("2026-01-01"),
        checkOutDate: new Date("2026-06-01"),
        notes: "Prefers quiet rooms",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "0723456789",
        gender: "female",
        hostel: hostels[0]._id,
        assignedWarden: wardens[0]._id,
        roomNumber: "102",
        bedNumber: "2",
        status: "active",
        checkInDate: new Date("2026-02-01"),
        checkOutDate: new Date("2026-07-01"),
        notes: "Vegetarian",
      },
      {
        name: "Michael Brown",
        email: "michael@example.com",
        phone: "0734567890",
        gender: "male",
        hostel: hostels[1]?._id || hostels[0]._id,
        assignedWarden: wardens[1]?._id || wardens[0]._id,
        roomNumber: "201",
        bedNumber: "1",
        status: "inactive",
        checkInDate: new Date("2025-09-01"),
        checkOutDate: new Date("2025-12-01"),
        notes: "Temporary stay",
      },
    ];

    const createdResidents = await Resident.insertMany(sampleResidents);
    console.log(`✅ Seeded ${createdResidents.length} residents`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

residentsSeed();
