const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    allergies: [{ type: String }],
    diet: { type: String },
    healthProfile: {
      score: { type: Number, default: 70 },
      status: { type: String, default: "BALANCED" },
      insight: { type: String, default: "Start scanning products to build your health profile." },
      averageProductScore: { type: Number, default: 0 },
      healthyScanCount: { type: Number, default: 0 },
      harmfulScanCount: { type: Number, default: 0 },
      totalScans: { type: Number, default: 0 },
      trend: { type: Number, default: 0 },
      lastUpdated: { type: Date },
    },
    passwordResetToken: { type: String },
    passwordResetCode: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
