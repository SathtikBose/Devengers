const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  getProfile,
  getHealthDashboard,
  updateProfile,
} = require("../controllers/user.controller");

router.get("/profile", auth, getProfile);
router.get("/dashboard", auth, getHealthDashboard);
router.put("/update-profile", auth, upload.single("avatar"), updateProfile);

module.exports = router;
