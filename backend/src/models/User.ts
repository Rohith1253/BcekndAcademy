import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  bio?: string;
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
  totalActiveDays?: number;
  lastLoginDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: String,
    bio: String,
    totalXP: {
      type: Number,
      default: 0,
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: Date,
    totalActiveDays: {
      type: Number,
      default: 0,
    },
    lastLoginDate: Date,
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
