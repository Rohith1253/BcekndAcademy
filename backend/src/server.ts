import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { rateLimiter } from "./middleware/rateLimit";
import { getHealth } from "./controllers/healthController";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import progressRoutes from "./routes/progressRoutes";
import quizRoutes from "./routes/quizRoutes";
import challengeRoutes from "./routes/challengeRoutes";
import codeRoutes from "./routes/codeRoutes";
import learningRoutes from "./routes/learningRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import codingLabRoutes from "./routes/codingLabRoutes";
import gameRoutes from "./routes/gameRoutes";
import noteRoutes from "./routes/noteRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import languageRoutes from "./routes/languageRoutes";
import gamificationRoutes from "./routes/gamificationRoutes";
import apiLabRoutes from "./routes/apiLabRoutes";
import architectureLabRoutes from "./routes/architectureLabRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import healthRoutes from "./routes/healthRoutes";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// Robust CORS Configuration
const rawOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

// Support comma-separated origins in env
const allowedOrigins: string[] = [];
for (const item of rawOrigins) {
  item.split(",").forEach(o => {
    const trimmed = o.trim();
    if (trimmed) allowedOrigins.push(trimmed);
  });
}

const normalizedAllowedOrigins = allowedOrigins.map(origin =>
  origin.replace(/\/+$/, "")
);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/+$/, "");
    if (
      normalizedAllowedOrigins.includes(normalizedOrigin) ||
      process.env.NODE_ENV !== "production"
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "x-request-id"
  ],
  exposedHeaders: ["Set-Cookie", "x-request-id"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Security Headers & Request Correlation
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  const reqId = (req.headers["x-request-id"] as string) || "req_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
  res.setHeader("X-Request-Id", reqId);
  (req as any).id = reqId;
  next();
});

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
app.use("/api/quizzes", quizRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/coding-lab", codingLabRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/backend-languages", languageRoutes);
app.use("/api/api-labs", apiLabRoutes);
app.use("/api/architecture-labs", architectureLabRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api", gamificationRoutes);
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
      console.log("==================================================");
      console.log("  🚀 BACKEND LEARNING ACADEMY API SERVER ACTIVE  ");
      console.log("  Listening on: http://0.0.0.0:" + PORT);
      console.log("  Environment: " + (process.env.NODE_ENV || "development"));
      console.log("  Allowed Origins: " + (normalizedAllowedOrigins.join(", ") || "(all allowed)"));
      console.log("==================================================");
    });
  } catch (error) {
    console.error("Failed to start backend server:", error);
    process.exit(1);
  }
}

startServer();
