const app = require("./app");
const connectDB = require("./config/db");
const https = require("https");
const http = require("http");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  startSelfPing();
});

function startSelfPing() {
  const renderUrl = process.env.RENDER_URL;
  if (!renderUrl) return;

  const client = renderUrl.startsWith("https") ? https : http;

  setInterval(
    () => {
      client.get(`${renderUrl}/health`, () => {}).on("error", () => {});
    },
    10 * 60 * 1000,
  );
}
