// 📁 models/Booking.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    resident: {
      type: Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    hostelName: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    roomType: {
      type: String,
      default: "",
    },
    roomNumber: {
      type: String,
      default: "",
    },
    bedNumber: {
      type: String,
      default: "",
    },
    assignedWarden: {
      type: String,
      default: "",
    },
    amenities: {
      type: [String],
      default: [],
    },
    pricePerMonth: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
