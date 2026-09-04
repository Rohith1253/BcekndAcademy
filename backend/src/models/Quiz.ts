import mongoose, { Schema, Document } from "mongoose";

export interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  score: number; // percentage
  answers: Array<{
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }>;
  timeSpent: number; // milliseconds
  xpEarned: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const quizResultSchema = new Schema<IQuizResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    answers: [
      {
        questionId: String,
        selectedOptionIndex: Number,
        isCorrect: Boolean,
      },
    ],
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

// Compound index for fast user quiz history and replay checks
quizResultSchema.index({ userId: 1, lessonId: 1, score: -1 });

export const QuizResult =
  mongoose.models.QuizResult || mongoose.model<IQuizResult>("QuizResult", quizResultSchema);
