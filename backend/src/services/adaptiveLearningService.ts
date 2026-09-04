import mongoose from "mongoose";
import { CodingSubmission } from "../models/CodingSubmission";
import { QuizAttempt } from "../models/QuizAttempt";
import { ALL_REAL_LESSONS } from "../data/all-lessons-content";
import { MULTI_LANGUAGE_LESSONS } from "../data/multi-language-lessons-data";

export class AdaptiveLearningService {
  /**
   * Evaluates user challenge and quiz performance to adapt difficulty dynamically.
   */
  static async getAdaptiveProfile(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));

    const [submissions, quizAttempts] = await Promise.all([
      CodingSubmission.find({ userId: userObjId }).sort({ createdAt: -1 }).limit(20).lean(),
      QuizAttempt.find({ userId: userObjId }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    const totalSubmissions = submissions.length;
    const passedSubmissions = submissions.filter((s) => s.status === "passed").length;
    const challengeSuccessRate = totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 100;

    const totalQuizzes = quizAttempts.length;
    const avgQuizScore = totalQuizzes > 0
      ? Math.round(quizAttempts.reduce((acc, q) => acc + (q.score || 0), 0) / totalQuizzes)
      : 85;

    // Aggregate overall success rate
    const combinedSuccessRate = Math.round((challengeSuccessRate + avgQuizScore) / 2);

    // Adaptive difficulty rule:
    // > 85% -> harder
    // 60 - 85% -> medium
    // < 60% -> easier
    let recommendedDifficulty: "beginner" | "easy" | "medium" | "hard" = "medium";
    if (combinedSuccessRate > 85) {
      recommendedDifficulty = "hard";
    } else if (combinedSuccessRate >= 60) {
      recommendedDifficulty = "medium";
    } else {
      recommendedDifficulty = "easy";
    }

    // Detect repeated failures on specific challenges or topics
    const failureCountMap = new Map<string, number>();
    submissions.filter((s) => s.status !== "passed").forEach((s) => {
      const key = s.challengeSlug || s.language;
      failureCountMap.set(key, (failureCountMap.get(key) || 0) + 1);
    });

    const weakAreas = Array.from(failureCountMap.entries())
      .map(([topic, fails]) => ({ topic, failures: fails }))
      .filter((w) => w.failures >= 2);

    // Suggested actions
    const suggestedActions = [];
    if (weakAreas.length > 0) {
      suggestedActions.push({
        type: "review_material",
        title: `Review foundational concepts for ${weakAreas[0].topic}`,
        description: `You had ${weakAreas[0].failures} failed attempts. We recommend reviewing the related lesson before attempting more challenges.`,
        actionUrl: "/courses",
      });
    }

    if (combinedSuccessRate > 85) {
      suggestedActions.push({
        type: "level_up_challenge",
        title: "Tackle Advanced Challenges",
        description: "Your success rate is high (>85%). Push your skills with Hard and Expert challenges!",
        actionUrl: "/challenges?difficulty=hard",
      });
    } else if (combinedSuccessRate < 60) {
      suggestedActions.push({
        type: "practice_fundamentals",
        title: "Reinforce Core Concepts",
        description: "Focus on beginner and easy challenges to build rock-solid confidence.",
        actionUrl: "/challenges?difficulty=easy",
      });
    }

    // Confidence Score (0-100)
    const confidenceScore = Math.min(100, Math.max(20, Math.round(combinedSuccessRate * 0.9 + Math.min(totalSubmissions, 10))));

    return {
      recommendedDifficulty,
      successRate: combinedSuccessRate,
      challengeSuccessRate,
      avgQuizScore,
      weakAreas,
      suggestedActions,
      confidenceScore,
      totalEvaluated: totalSubmissions + totalQuizzes,
    };
  }
}
