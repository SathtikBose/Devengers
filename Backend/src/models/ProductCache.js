const mongoose = require("mongoose");

const ProductCacheSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // image hash or barcode
    result: { type: Object, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProductCache", ProductCacheSchema);
