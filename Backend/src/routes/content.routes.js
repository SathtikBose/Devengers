const express = require("express");
const router = express.Router();
const { getDailyQuote } = require("../controllers/content.controller");

router.get("/daily-quote", getDailyQuote);

module.exports = router;
