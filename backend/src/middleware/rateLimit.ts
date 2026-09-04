import { Request, Response, NextFunction } from "express";

const requestCounts = new Map<string, { count: number; startTime: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = process.env.RATE_LIMIT_MAX
  ? parseInt(process.env.RATE_LIMIT_MAX, 10)
  : process.env.NODE_ENV === "production"
  ? 500
  : 2000;

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, startTime: now });
    return next();
  }

  const record = requestCounts.get(ip)!;
  if (now - record.startTime > WINDOW_MS) {
    record.count = 1;
    record.startTime = now;
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    return res.status(429).json({ success: false, error: "Too many requests, please try again later." });
  }

  record.count++;
  next();
}
