import mongoose, { Schema, Document } from "mongoose";

export interface ITestResultItem {
  name: string;
  passed: boolean;
  expected?: any;
  received?: any;
  error?: string;
}

export interface ICodingSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  challengeSlug: string;
  code: string;
  language: string;
  status: "passed" | "failed" | "error";
  testsPassed: number;
  totalTests: number;
  score: number; // 0-100 percentage
  earnedXP: number;
  executionTime: number; // ms
  testResults: ITestResultItem[];
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const testResultItemSchema = new Schema(
  {
    name: { type: String, required: true },
    passed: { type: Boolean, required: true },
    expected: { type: Schema.Types.Mixed },
    received: { type: Schema.Types.Mixed },
    error: { type: String },
  },
  { _id: false }
);

const codingSubmissionSchema = new Schema<ICodingSubmission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "CodingChallenge",
      required: true,
      index: true,
    },
    challengeSlug: {
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    status: {
      type: String,
      enum: ["passed", "failed", "error"],
      required: true,
    },
    testsPassed: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTests: {
      type: Number,
      required: true,
      default: 0,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    earnedXP: {
      type: Number,
      required: true,
      default: 0,
    },
    executionTime: {
      type: Number,
      default: 0,
    },
    testResults: {
      type: [testResultItemSchema],
      default: [],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

codingSubmissionSchema.index({ userId: 1, challengeSlug: 1, status: 1 });
codingSubmissionSchema.index({ userId: 1, createdAt: -1 });

export const CodingSubmission =
  mongoose.models.CodingSubmission ||
  mongoose.model<ICodingSubmission>("CodingSubmission", codingSubmissionSchema);
