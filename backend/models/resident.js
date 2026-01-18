import mongoose from "mongoose";

const residentSchema = new mongoose.Schema(
  {
    // 🔗 Link to User (auth)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one user → one resident profile
    },

    // 🧾 Identity snapshot (for fast access & safety)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    contact: {
      type: String,
      default: "",
    },

    // 🏢 Admin-assigned fields
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      default: null,
    },

    roomType: {
      type: String,
      enum: ["single", "double", "shared"],
      default: null,
    },

    roomNumber: {
      type: String,
      default: null,
    },

    bedNumber: {
      type: String,
      default: null,
    },

    assignedWarden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 📌 Status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // 📅 Stay dates
    checkIn: {
      type: Date,
      default: null,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    // 💰 Financials
    amountPerMonth: {
      type: Number,
      default: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    availableLoan: {
      type: Number,
      default: 0,
    },

    // 📝 Admin notes
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resident", residentSchema);
