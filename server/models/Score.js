import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 20, // Stableford format PRD constraint
    },
    datePlayed: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Score", scoreSchema);
