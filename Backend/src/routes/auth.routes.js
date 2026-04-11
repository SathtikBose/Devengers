const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  signup,
  login,
  changePassword,
  forgotPassword,
  verifyForgotPasswordCode,
  resetPasswordWithCode,
  renderResetPasswordPage,
  resetPassword,
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/change-password", auth, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/send-code", forgotPassword);
router.post("/forgot-password/verify-code", verifyForgotPasswordCode);
router.post("/forgot-password/reset", resetPasswordWithCode);
router.get("/reset-password", renderResetPasswordPage);
router.post("/reset-password", resetPassword);

module.exports = router;
