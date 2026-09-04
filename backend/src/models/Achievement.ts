import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  category: "social" | "learning" | "milestone" | "challenge" | "streak";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  earnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    achievementId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["social", "learning", "milestone", "challenge", "streak"],
      required: true,
    },
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "epic", "legendary"],
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate achievements
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const Achievement =
  mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", achievementSchema);
