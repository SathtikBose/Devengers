const app = require("./app");
const connectDB = require("./config/db");
const https = require("https");
const http = require("http");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server started on port ${PORT}`);
  startSelfPing();
});

function startSelfPing() {
  const renderUrl = process.env.RENDER_URL;
  if (!renderUrl) return;

  const client = renderUrl.startsWith("https") ? https : http;

  setInterval(
    () => {
      client.get(`${renderUrl}/health`, () => {}).on("error", () => {});
      console.log(`hello health check`);
    },
    2 * 60 * 1000,
  );
}
