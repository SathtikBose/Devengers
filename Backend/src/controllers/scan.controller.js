const Scan = require("../models/Scan");
const ProductCache = require("../models/ProductCache");
const aiService = require("../services/ai.service");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const { Readable } = require("stream");

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

exports.scanImage = async (req, res, next) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "Image is required" });
    // Convert base64 to buffer
    const buffer = Buffer.from(image, "base64");
    // Upload to Cloudinary
    let cloudinaryUrl;
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "scans" },
        (err, result) => {
          if (err) return reject(err);
          cloudinaryUrl = result.secure_url;
          resolve();
        },
      );
      bufferToStream(buffer).pipe(uploadStream);
    });
    // Use image hash as cache key
    const key = require("crypto")
      .createHash("sha256")
      .update(image)
      .digest("hex");
    let cached = await ProductCache.findOne({ key });
    let result;
    if (cached) {
      result = cached.result;
    } else {
      result = await aiService.analyzeImage(cloudinaryUrl);
      await ProductCache.create({ key, result });
    }
    const scan = await Scan.create({
      user: req.user._id,
      type: "image",
      image: cloudinaryUrl,
      result,
    });
    res.json({ scan, analysis: result });
  } catch (err) {
    next(err);
  }
};

exports.scanBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.body;
    if (!barcode)
      return res.status(400).json({ message: "Barcode is required" });
    let cached = await ProductCache.findOne({ key: barcode });
    let result;
    if (cached) {
      result = cached.result;
    } else {
      result = await aiService.analyzeBarcode(barcode);
      await ProductCache.create({ key: barcode, result });
    }
    const scan = await Scan.create({
      user: req.user._id,
      type: "barcode",
      barcode,
      result,
    });
    res.json({ scan, analysis: result });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const scans = await Scan.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(scans);
  } catch (err) {
    next(err);
  }
};
