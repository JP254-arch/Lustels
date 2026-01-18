// server.js
import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
import wardenRoutes from "./routes/wardenRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import paymentsRoute from "./routes/payments.js";

const app = express();

// ===== Middleware =====
app.use(
  cors({
    origin: process.env.CLIENT_URL.replace(/\/$/, ""),
    credentials: true,
  })
);

/**
 * ✅ IMPORTANT:
 * Increase payload size to allow Base64 images (profile photos)
 */
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use(morgan("dev"));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/wardens", wardenRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api", paymentsRoute); // Stripe payments

// ===== 404 Handler =====
app.use((req, res) =>
  res.status(404).json({ message: "Route not found" })
);

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ===== DB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ===== Server Start =====
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    "Stripe Key Loaded:",
    process.env.STRIPE_SECRET_KEY ? "✅ Yes" : "❌ No"
  );
});
