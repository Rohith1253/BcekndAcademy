import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: string;
  courseId?: string;
  moduleId?: string;
  status: "not-started" | "in-progress" | "completed";
  progressPercentage: number;
  timeSpent: number;
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessonId: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: {
      type: String,
      trim: true,
    },
    moduleId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

// Indexes
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
progressSchema.index({ userId: 1, courseId: 1 });
progressSchema.index({ userId: 1, status: 1 });

export const Progress =
  mongoose.models.Progress || mongoose.model<IProgress>("Progress", progressSchema);
