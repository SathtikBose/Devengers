const mongoose = require("mongoose");

const ScanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["image", "barcode"], required: true },
    image: { type: String },
    barcode: { type: String },
    result: { type: Object, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Scan", ScanSchema);
