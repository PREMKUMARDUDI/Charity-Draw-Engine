import mongoose from "mongoose";

const winnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    draw: { type: mongoose.Schema.Types.ObjectId, ref: "Draw", required: true },
    matchTier: { type: Number, enum: [3, 4, 5], required: true },
    prizeAmount: { type: Number, required: true },

    // Section 09 PRD Requirements
    verification: {
      status: {
        type: String,
        enum: ["pending_upload", "under_review", "approved", "rejected"],
        default: "pending_upload",
      },
      proofImageUrl: { type: String }, // URL from AWS S3 or Cloudinary
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Winner", winnerSchema);
