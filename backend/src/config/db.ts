import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FATAL: Database connection URI is missing. Set MONGO_URI or MONGODB_URI in your production environment variables."
      );
    }
    return "mongodb://localhost:27017/backend-learning-platform";
  }
  return uri;
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
