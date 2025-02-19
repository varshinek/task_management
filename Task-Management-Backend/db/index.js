import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env-config.js";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false); // Prevents deprecation warnings

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
    });

    console.log("✅ Connected to MongoDB successfully");

    // Event listeners for better error handling
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Reconnecting...");
    });

    // Gracefully handle app termination
    process.on("SIGINT", async () => {
      console.log("🔌 Closing MongoDB connection...");
      await mongoose.connection.close();
      process.exit(0);
    });
    
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
