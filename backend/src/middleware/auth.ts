import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function getJwtSecret(): string {
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("FATAL: JWT_SECRET must be set in production");
  }
  return process.env.JWT_SECRET || "super-secret-jwt-key-for-development";
}

export function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token: string | undefined = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, getJwtSecret()) as { userId: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

export function optionalAuthenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token: string | undefined = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = jwt.verify(token, getJwtSecret()) as { userId: string; email: string };
      req.user = decoded;
    }
  } catch {
    // Ignore invalid token for optional auth
  }
  next();
}
