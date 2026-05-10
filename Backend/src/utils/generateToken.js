const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    const err = new Error("JWT_SECRET is not defined in environment variables");
    err.status = 500;
    throw err;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
