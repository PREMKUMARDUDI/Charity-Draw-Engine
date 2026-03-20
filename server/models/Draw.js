import mongoose from "mongoose";

const drawSchema = new mongoose.Schema(
  {
    drawMonth: { type: String, required: true }, // e.g., "March 2026"
    winningNumbers: [{ type: Number }], // Array of 5 numbers
    status: {
      type: String,
      enum: ["simulation", "published", "completed"],
      default: "simulation",
    },
    financials: {
      totalPrizePool: { type: Number, default: 0 },
      match5PayoutPerUser: { type: Number, default: 0 },
      match4PayoutPerUser: { type: Number, default: 0 },
      match3PayoutPerUser: { type: Number, default: 0 },
      rolledOverAmount: { type: Number, default: 0 }, // If no 5-match winners
    },
  },
  { timestamps: true },
);

export default mongoose.model("Draw", drawSchema);
