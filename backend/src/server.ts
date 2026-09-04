import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import authRoutes from "./routes/authRoutes";
import { rateLimiter } from "./middleware/rateLimit";
import courseRoutes from "./routes/courseRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import progressRoutes from "./routes/progressRoutes";
import quizRoutes from "./routes/quizRoutes";
import challengeRoutes from "./routes/challengeRoutes";
import gameRoutes from "./routes/gameRoutes";
import noteRoutes from "./routes/noteRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import healthRoutes from "./routes/healthRoutes";
import codingLabRoutes from "./routes/codingLabRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// CORS & Middleware Configuration
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// Mount API Routes
app.use(rateLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/coding-lab", codingLabRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/health", healthRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[SERVER ERROR]", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`  🚀 BACKEND LEARNING ACADEMY API SERVER ACTIVE  `);
      console.log(`  Listening on: http://localhost:${PORT}        `);
      console.log(`  CORS Allowed Origin: ${CLIENT_URL}             `);
      console.log(`==================================================`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error);
    process.exit(1);
  }
}

startServer();
