import { Request, Response } from "express";
import mongoose from "mongoose";

export async function getHealth(req: Request, res: Response) {
  const isDbConnected = mongoose.connection.readyState === 1;
  return res.status(200).json({
    status: "ok",
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: isDbConnected ? "connected" : "disconnected",
      uptime: process.uptime(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    },
  });
}

export async function getLiveness(req: Request, res: Response) {
  return res.status(200).json({
    status: "alive",
    success: true,
    data: { live: true, uptime: process.uptime() }
  });
}

export async function getReadiness(req: Request, res: Response) {
  const isDbConnected = mongoose.connection.readyState === 1;
  if (!isDbConnected) {
    return res.status(503).json({
      status: "not_ready",
      success: false,
      data: { ready: false, database: "disconnected" }
    });
  }
  return res.status(200).json({
    status: "ready",
    success: true,
    data: { ready: true, database: "connected", uptime: process.uptime() }
  });
}
