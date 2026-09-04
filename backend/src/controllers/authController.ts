import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { RegisterSchema, LoginSchema, validateInput } from "../utils/validation";
import { getJwtSecret, AuthenticatedRequest } from "../middleware/auth";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = validateInput(RegisterSchema, req.body);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          totalXP: user.totalXP,
          currentLevel: user.currentLevel,
        },
        token,
      },
      message: "Registration successful",
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = validateInput(LoginSchema, req.body);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          totalXP: user.totalXP,
          currentLevel: user.currentLevel,
        },
        token,
      },
      message: "Login successful",
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || "Login failed" });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId).select("-password").lean();
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch profile" });
  }
}
