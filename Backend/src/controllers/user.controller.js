const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const { refreshUserHealthProfile } = require("../services/health-score.service");

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

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, allergies, diet } = req.body;
    let avatar = req.user.avatar;
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "avatars" },
        (error, result) => {
          if (error) throw error;
          avatar = result.secure_url;
        },
      );
    }
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, allergies, diet, avatar },
      { new: true },
    ).select("-password");
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
