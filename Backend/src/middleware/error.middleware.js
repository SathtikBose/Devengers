module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";
  res.status(status).json({
    error: {
      code: status,
      message: isProd
        ? status >= 500
          ? "An unexpected error occurred. Please try again later."
          : err.message || "Request failed."
        : err.message || "Server Error",
      details: isProd ? undefined : err.stack,
    },
  });
};
