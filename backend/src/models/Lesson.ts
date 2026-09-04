import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  courseId?: mongoose.Types.ObjectId;
  moduleId?: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  order: number;
  estimatedMinutes: number;
  published: boolean;
  content: any; // Array of content blocks
  quiz?: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctOptionIndex: number;
    }>;
  };
  xpReward: number;
  estimatedTime: number; // minutes
  learningPoints: string[];
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    order: {
      type: Number,
      default: 1,
    },
    estimatedMinutes: {
      type: Number,
      default: 15,
    },
    published: {
      type: Boolean,
      default: true,
    },
    content: mongoose.Schema.Types.Mixed,
    quiz: {
      questions: [
        {
          id: String,
          question: String,
          options: [String],
          correctOptionIndex: Number,
        },
      ],
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    estimatedTime: {
      type: Number,
      default: 15,
    },
    learningPoints: [String],
  },
  { timestamps: true }
);

// Indexes
lessonSchema.index({ category: 1, difficulty: 1 });
lessonSchema.index({ courseId: 1, moduleId: 1, order: 1 });
lessonSchema.index({ moduleId: 1, order: 1 });

export const Lesson = mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", lessonSchema);
