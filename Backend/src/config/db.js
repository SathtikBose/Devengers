const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    if (!process.env.MONGO_URI) {
      console.error("❌ CRITICAL: MONGO_URI is not defined in environment variables!");
      return;
    }

    // ✅ Optimization for Vercel: Fail fast and disable buffering
    mongoose.set("bufferCommands", false); 

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for initial connection
      connectTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};


module.exports = connectDB;
