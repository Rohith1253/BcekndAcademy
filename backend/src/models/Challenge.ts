import mongoose, { Schema, Document } from "mongoose";

export interface IChallengeSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: string;
  code: string;
  testsPassed: number;
  totalTests: number;
  success: boolean;
  timeSpent: number; // milliseconds
  xpEarned: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const challengeSubmissionSchema = new Schema<IChallengeSubmission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    testsPassed: {
      type: Number,
      required: true,
    },
    totalTests: {
      type: Number,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for user challenge submissions and replay lookup
challengeSubmissionSchema.index({ userId: 1, challengeId: 1, success: 1 });

export const ChallengeSubmission =
  mongoose.models.ChallengeSubmission ||
  mongoose.model<IChallengeSubmission>("ChallengeSubmission", challengeSubmissionSchema);
