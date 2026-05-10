module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";

  // ✅ Always log error for debugging (visible in Vercel/Render logs)
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  if (!isProd) console.error(err.stack);

  let message = "An unexpected error occurred. Please try again later.";

  if (isProd) {
    if (err.name === "MongoError" || err.name === "MongooseError" || err.name === "MongoNetworkError") {
      message = "Database connection issue. Please check if your IP is whitelisted (0.0.0.0/0).";
    } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      message = "Authentication error. Your session may have expired.";
    } else if (err.status < 500) {
      message = err.message || "Request failed.";
    }
  } else {
    message = err.message || "Server Error";
  }

  res.status(status).json({
    error: {
      code: status,
      message,
      details: isProd ? undefined : err.stack,
    },
  });
};
