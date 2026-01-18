import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true },

    // Multiple wardens allowed
    assignedWardens: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Warden" },
    ],

    price: Number,
    amenities: [String],
    imageUrl: String,
    genderPolicy: { type: String, enum: ["male", "female", "coed"], default: "coed" },
    roomType: String,
    totalRooms: Number,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Hostel", hostelSchema);
