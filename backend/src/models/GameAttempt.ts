import mongoose, { Schema, Document } from "mongoose";

export interface IGameAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  gameId: string;
  score: number; // 0 to 100
  completed: boolean;
  stars: "bronze" | "silver" | "gold" | "none";
  xpEarned: number;
  timeSpent: number; // Seconds
  attemptsCount: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const gameAttemptSchema = new Schema<IGameAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameId: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    stars: {
      type: String,
      enum: ["bronze", "silver", "gold", "none"],
      default: "none",
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    attemptsCount: {
      type: Number,
      default: 1,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

// Indexes for fast user queries and anti-farming verification
gameAttemptSchema.index({ userId: 1, gameId: 1 }, { unique: true });
gameAttemptSchema.index({ userId: 1, completed: 1 });

export const GameAttempt =
  mongoose.models.GameAttempt ||
  mongoose.model<IGameAttempt>("GameAttempt", gameAttemptSchema);
