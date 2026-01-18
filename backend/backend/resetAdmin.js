import mongoose from "mongoose";
import User from "./models/User.js";

const MONGO_URI = "mongodb://localhost:27017/Lustels";

const resetAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const email = "admin@example.com";

    const result = await User.deleteMany({
      $or: [{ role: "admin" }, { email }]
    });
    console.log(`🗑 Deleted ${result.deletedCount} existing admin(s)`);

    const admin = new User({
      name: "System Admin",
      email,
      password: "Admin@123", // plain password
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@example.com | Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting admin:", error);
    process.exit(1);
  }
};

resetAdmin();
