import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || "super-secret-jwt-key-for-development";
}

export function generateToken(payload: { userId: string; email: string }, expiresIn: string = "7d"): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
