import mongoose, { Schema, Document } from "mongoose";

export interface ITestItem {
  name: string;
  description?: string;
  testCode: string;
  expectedOutput?: any;
}

export interface ICodingChallenge extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: "beginner" | "easy" | "medium" | "hard" | "advanced";
  language: string;
  supportedLanguages: string[];
  starterCode: string;
  solutionTemplate: string;
  instructions: string;
  visibleTests: ITestItem[];
  hiddenTests: ITestItem[];
  xpReward: number;
  estimatedMinutes: number;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    testCode: { type: String, required: true },
    expectedOutput: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const codingChallengeSchema = new Schema<ICodingChallenge>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["beginner", "easy", "medium", "hard", "advanced"],
      default: "easy",
      required: true,
    },
    language: { type: String, default: "javascript" },
    supportedLanguages: {
      type: [String],
      default: ["javascript", "typescript", "python", "go"],
    },
    starterCode: { type: String, required: true },
    solutionTemplate: { type: String, default: "" },
    instructions: { type: String, required: true },
    visibleTests: { type: [testItemSchema], default: [] },
    hiddenTests: { type: [testItemSchema], default: [] },
    xpReward: { type: Number, required: true, default: 50 },
    estimatedMinutes: { type: Number, default: 15 },
    order: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

codingChallengeSchema.index({ category: 1, difficulty: 1 });

export const CodingChallenge =
  mongoose.models.CodingChallenge ||
  mongoose.model<ICodingChallenge>("CodingChallenge", codingChallengeSchema);
