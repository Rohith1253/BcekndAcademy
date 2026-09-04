import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  language: string;
  frameworks: string[];
  learningPath: string;
  codeSnippet?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  level: string;
  thumbnail?: string;
  instructor?: string;
  estimatedHours: number;
  totalModules: number;
  totalLessons: number;
  totalXP: number;
  tags: string[];
  prerequisites: string[];
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      default: "Backend",
    },
    language: {
      type: String,
      default: "javascript",
      lowercase: true,
      trim: true,
    },
    frameworks: {
      type: [String],
      default: [],
    },
    learningPath: {
      type: String,
      default: "backend-javascript",
      trim: true,
    },
    codeSnippet: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    level: {
      type: String,
      default: "Beginner to Advanced",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    instructor: {
      type: String,
      default: "Backend Engineering Team",
    },
    estimatedHours: {
      type: Number,
      default: 10,
    },
    totalModules: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    totalXP: {
      type: Number,
      default: 0,
    },
    tags: [String],
    prerequisites: [String],
    published: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Indexes
courseSchema.index({ published: 1, order: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ language: 1, published: 1 });
courseSchema.index({ learningPath: 1 });

export const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);
