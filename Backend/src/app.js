const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error.middleware");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/health-check", (req, res) => {
  res.send("working");
});

app.use("/auth", require("./routes/auth.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/scan", require("./routes/scan.routes"));
app.use("/content", require("./routes/content.routes"));

app.use(errorHandler);

module.exports = app;
