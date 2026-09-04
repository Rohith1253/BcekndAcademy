import mongoose, { Schema, Document } from "mongoose";

export interface IModule extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  totalLessons: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModule>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
    estimatedMinutes: {
      type: Number,
      default: 60,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
moduleSchema.index({ courseId: 1, order: 1 });
moduleSchema.index({ courseId: 1, slug: 1 }, { unique: true });

export const Module = mongoose.models.Module || mongoose.model<IModule>("Module", moduleSchema);
