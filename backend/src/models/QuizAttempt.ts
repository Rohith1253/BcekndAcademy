import mongoose, { Schema, Document } from "mongoose";

export interface IQuizAttemptAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  lessonSlug: string;
  courseSlug?: string;
  score: number; // 0-100 percentage
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  timeSpentSeconds: number;
  answers: IQuizAttemptAnswer[];
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const quizAttemptAnswerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    selectedOptionIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lessonSlug: {
      type: String,
      required: true,
      index: true,
    },
    courseSlug: {
      type: String,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    correctAnswers: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
    },
    xpEarned: {
      type: Number,
      required: true,
      default: 0,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    answers: {
      type: [quizAttemptAnswerSchema],
      default: [],
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ userId: 1, lessonSlug: 1, score: -1 });
quizAttemptSchema.index({ userId: 1, createdAt: -1 });

export const QuizAttempt =
  mongoose.models.QuizAttempt ||
  mongoose.model<IQuizAttempt>("QuizAttempt", quizAttemptSchema);
