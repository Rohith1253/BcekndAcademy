import { Request, Response } from "express";
import mongoose from "mongoose";

export async function getHealth(req: Request, res: Response) {
  const isDbConnected = mongoose.connection.readyState === 1;
  return res.status(200).json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: isDbConnected ? "connected" : "disconnected",
      uptime: process.uptime(),
    },
  });
}
