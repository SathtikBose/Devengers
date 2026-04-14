const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const errorHandler = require("./middleware/error.middleware");

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes.",
  },
});
app.use(limiter);

// Stricter limiter for auth — 10 req / 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
});

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());

app.use(hpp());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/auth", authLimiter, require("./routes/auth.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/scan", require("./routes/scan.routes"));
app.use("/content", require("./routes/content.routes"));

app.use(errorHandler);

module.exports = app;
