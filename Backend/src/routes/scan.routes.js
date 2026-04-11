const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  scanImage,
  scanBarcode,
  getHistory,
} = require("../controllers/scan.controller");

router.post("/image", auth, scanImage);
router.post("/barcode", auth, scanBarcode);
router.get("/history", auth, getHistory);

module.exports = router;
