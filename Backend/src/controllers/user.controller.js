const { Readable } = require("stream");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const { refreshUserHealthProfile } = require("../services/health-score.service");

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function parseAllergiesBody(value) {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

exports.getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

exports.getHealthDashboard = async (req, res, next) => {
  try {
    const payload = await refreshUserHealthProfile(req.user._id);
    res.json(payload);
  } catch (err) {
    next(err);
  }
};

/**
 * JSON partial update (name, age, diet, allergies) — no file upload.
 */
exports.patchProfile = async (req, res, next) => {
  try {
    const { name, diet, age, allergies } = req.body;
    const updates = {};

    if (name !== undefined) {
      const trimmed = String(name || "").trim();
      if (trimmed) updates.name = trimmed;
    }
    if (diet !== undefined) {
      updates.diet = diet ? String(diet).trim() : null;
    }
    if (age !== undefined) {
      if (age === null || age === "") {
        updates.age = null;
      } else {
        const n = Number(age);
        if (!Number.isNaN(n)) updates.age = n;
      }
    }
    if (allergies !== undefined) {
      updates.allergies = Array.isArray(allergies)
        ? allergies.filter(Boolean).map(String)
        : parseAllergiesBody(allergies);
    }

    if (Object.keys(updates).length === 0) {
      const current = await User.findById(req.user._id).select("-password");
      return res.json(current);
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, diet, age } = req.body;
    let avatar = req.user.avatar;

    if (req.file?.buffer) {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "avatars" },
          (err, result) => {
            if (err) return reject(err);
            avatar = result.secure_url;
            resolve();
          },
        );
        bufferToStream(req.file.buffer).pipe(uploadStream);
      });
    }

    const updates = {};
    if (name !== undefined && String(name).trim() !== "") {
      updates.name = String(name).trim();
    }
    if (diet !== undefined) {
      updates.diet = req.body.diet ? String(req.body.diet).trim() : null;
    }
    if (age !== undefined && age !== null && String(age).trim() !== "") {
      const n = Number(age);
      if (!Number.isNaN(n)) updates.age = n;
    }
    const parsedAllergies = parseAllergiesBody(req.body.allergies);
    if (parsedAllergies !== undefined) {
      updates.allergies = parsedAllergies;
    }
    if (req.file) {
      updates.avatar = avatar;
    }

    if (Object.keys(updates).length === 0) {
      const current = await User.findById(req.user._id).select("-password");
      return res.json(current);
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
