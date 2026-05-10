const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    if (!process.env.MONGO_URI) {
      console.error("❌ CRITICAL: MONGO_URI is not defined in environment variables!");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Don't process.exit(1) on Vercel
  }
};


module.exports = connectDB;
