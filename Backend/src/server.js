const app = require("./app");
const connectDB = require("./config/db");
const https = require("https");
const http = require("http");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server started on port ${PORT}`);
});
