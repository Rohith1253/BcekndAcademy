import mongoose from "mongoose";

function getMongoUri(): string {
  return process.env.MONGODB_URI || "mongodb://localhost:27017/backend-learning-platform";
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    const mongoUri = getMongoUri();
    const connection = await mongoose.connect(mongoUri);
    console.log("✓ MongoDB connected successfully");
    return connection;
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error);
    throw error;
  }
}

export function getDB() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return mongoose;
}
