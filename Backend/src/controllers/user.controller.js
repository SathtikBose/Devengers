const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

exports.getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
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
