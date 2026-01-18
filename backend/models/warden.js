import mongoose from "mongoose";

const wardenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    phone: { type: String, match: [/^\+?\d{10,15}$/, "Invalid phone number"] },
    dob: { type: Date },
    assignedHostels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

// Auto-populate user
wardenSchema.pre(/^find/, function () {
  this.populate({ path: "user", select: "name email role" });
});

export default mongoose.model("Warden", wardenSchema);
