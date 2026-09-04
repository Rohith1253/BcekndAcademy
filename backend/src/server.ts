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
import { getHealth } from "./controllers/healthController";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Trust reverse proxy (Render, Vercel, AWS ALB) for secure cookies and accurate client IP
app.set("trust proxy", 1);

// Configure CORS allowed origins
const rawAllowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean) as string[];

const normalizedAllowedOrigins = Array.from(
  new Set(rawAllowedOrigins.map((origin) => origin.trim().replace(/\/+$/, "")))
);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server, health probes)
    if (!origin) {
      return callback(null, true);
    }
    const cleanOrigin = origin.trim().replace(/\/+$/, "");
    if (normalizedAllowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow localhost development ports in non-production environments
    try {
      const parsed = new URL(origin);
      if (
        (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
        (parsed.protocol === "http:" || parsed.protocol === "https:")
      ) {
        return callback(null, true);
      }
      // Allow Vercel preview and production subdomains
      if (parsed.protocol === "https:" && parsed.hostname.endsWith(".vercel.app")) {
        return callback(null, true);
      }
    } catch {}

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
app.get("/health", getHealth);

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

    // Auto-seed initial catalog if database is empty
    try {
      const { Course } = await import("./models/Course");
      const courseCount = await Course.countDocuments();
      if (courseCount === 0) {
        console.log("Empty course catalog detected. Auto-seeding 5 courses, 20 modules, 60 lessons...");
        const { seedCourses } = await import("./scripts/seedCourses");
        await seedCourses();
      }
      const { CodingChallenge } = await import("./models/CodingChallenge");
      const challengeCount = await CodingChallenge.countDocuments();
      if (challengeCount === 0) {
        console.log("Empty challenge catalog detected. Auto-seeding 15 challenges...");
        const { seedCodingChallenges } = await import("./scripts/seedCodingChallenges");
        await seedCodingChallenges();
      }
    } catch (seedErr) {
      console.warn("[AUTO-SEED WARNING]", seedErr);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`==================================================`);
      console.log(`  🚀 BACKEND LEARNING ACADEMY API SERVER ACTIVE  `);
      console.log(`  Listening on: http://0.0.0.0:${PORT}          `);
      console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`  Allowed Origins: ${normalizedAllowedOrigins.join(", ") || "(all allowed)"}`);
      console.log(`==================================================`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error);
    process.exit(1);
  }
}

startServer();
