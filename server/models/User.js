import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscription: {
      status: {
        type: String,
        enum: ["active", "inactive", "lapsed"],
        default: "inactive",
      },
      plan: {
        type: String,
        enum: ["monthly", "yearly", "none"],
        default: "none",
      },
      stripeCustomerId: { type: String },
      renewalDate: { type: Date },
    },
    charityPreferences: {
      selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: "Charity" },
      contributionPercentage: { type: Number, default: 10, min: 10, max: 100 }, // PRD minimum is 10%
    },
  },
  { timestamps: true },
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema);
