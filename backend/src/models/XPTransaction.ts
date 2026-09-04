import mongoose, { Schema, Document } from "mongoose";

export type XPSourceType =
  | "lesson_completion"
  | "course_completion"
  | "coding_challenge"
  | "quiz"
  | "daily_challenge"
  | "streak_bonus"
  | "achievement"
  | "milestone"
  | "perfect_score";

export interface IXPTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  sourceType: XPSourceType;
  sourceId: string;
  idempotencyKey: string;
  xpAmount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const xpTransactionSchema = new Schema<IXPTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sourceType: {
      type: String,
      required: true,
      enum: [
        "lesson_completion",
        "course_completion",
        "coding_challenge",
        "quiz",
        "daily_challenge",
        "streak_bonus",
        "achievement",
        "milestone",
        "perfect_score",
      ],
    },
    sourceId: {
      type: String,
      required: true,
      trim: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    xpAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Compound indexes for fast query and database-level uniqueness
xpTransactionSchema.index({ userId: 1, sourceType: 1, sourceId: 1 });
xpTransactionSchema.index({ userId: 1, createdAt: -1 });

export const XPTransaction =
  mongoose.models.XPTransaction || mongoose.model<IXPTransaction>("XPTransaction", xpTransactionSchema);
