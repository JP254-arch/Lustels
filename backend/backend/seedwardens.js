const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Warden = require("./models/Warden");
const Hostel = require("./models/Hostel");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected for seeding wardens"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

async function seedWardens() {
  try {
    // Clear existing wardens
    await Warden.deleteMany();

    // Get hostels to assign
    const hostels = await Hostel.find();

    const wardenData = [
      {
        name: "John Doe",
        email: "john@example.com",
        assignedHostels: [hostels[0]?._id].filter(Boolean),
        phone: "0712345678",
        gender: "male",
        dob: new Date("1990-05-15"),
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        assignedHostels: [hostels[1]?._id].filter(Boolean),
        phone: "0723456789",
        gender: "female",
        dob: new Date("1992-08-22"),
      },
      {
        name: "Mark Wilson",
        email: "mark@example.com",
        assignedHostels: hostels.map(h => h._id), // assign to all hostels
        phone: "0701234567",
        gender: "male",
        dob: new Date("1988-02-10"),
      },
      {
        name: "Lucy Adams",
        email: "lucy@example.com",
        assignedHostels: [hostels[0]?._id, hostels[1]?._id].filter(Boolean),
        phone: "0734567890",
        gender: "female",
        dob: new Date("1991-11-30"),
      },
    ];

    const created = await Warden.insertMany(wardenData);

    console.log(`✅ Seeded ${created.length} wardens`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedWardens();
