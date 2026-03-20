import mongoose from "mongoose";

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    totalRaised: { type: Number, default: 0 }, // Track global impact
    isActive: { type: Boolean, default: true }, // Admin can toggle charities
  },
  { timestamps: true },
);

export default mongoose.model("Charity", charitySchema);
