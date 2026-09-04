import mongoose from "mongoose";
import { ALL_COURSES } from "../data/multi-language-courses-data";
import { INITIAL_CODING_CHALLENGES, ChallengeSeedItem } from "../data/coding-challenges-data";
import { Progress } from "../models/Progress";
import { CodingSubmission } from "../models/CodingSubmission";
import { QuizAttempt } from "../models/QuizAttempt";
import { DailyGoalService } from "./dailyGoalService";
import { ProgressService, getLessonsForCourse } from "./progressService";

export class RecommendationService {
  /**
   * Generates personalized recommendations based on real progress, weak topics, and quiz/challenge performance.
   */
  static async getRecommendations(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));

    const [
      progressRecords,
      failedSubmissions,
      quizAttempts,
      dailyGoal,
    ] = await Promise.all([
      Progress.find({ userId: userObjId }).lean(),
      CodingSubmission.find({ userId: userObjId, status: { $ne: "passed" } }).lean(),
      QuizAttempt.find({ userId: userObjId }).sort({ createdAt: -1 }).limit(10).lean(),
      DailyGoalService.getTodayGoals(userObjId),
    ]);

    // 1. Continue Learning: active in-progress course & lesson
    const continueLearning = await ProgressService.getContinueLearning(userObjId);

    // 2. Recommended Course: first non-completed course in catalog
    const completedLessonIds = new Set(progressRecords.filter((p) => p.status === "completed").map((p) => p.lessonId));
    let recommendedCourse = null;

    for (const course of ALL_COURSES) {
      const courseLessons = getLessonsForCourse(course.slug);
      const isCourseDone = courseLessons.length > 0 && courseLessons.every((l: any) => completedLessonIds.has(l.slug));
      if (!isCourseDone) {
        recommendedCourse = {
          slug: course.slug,
          title: course.title,
          description: course.description,
          category: course.category,
          difficulty: course.difficulty,
          totalLessons: courseLessons.length,
        };
        break;
      }
    }

    // 3. Weak Topics: identify languages/categories with failures or low quiz scores (< 80)
    const weakTopicsMap = new Map<string, { topic: string; count: number; reason: string }>();

    failedSubmissions.forEach((sub) => {
      const lang = sub.language || "General";
      const existing = weakTopicsMap.get(lang);
      if (existing) {
        existing.count += 1;
      } else {
        weakTopicsMap.set(lang, {
          topic: lang,
          count: 1,
          reason: `Failed challenge attempts in ${lang}`,
        });
      }
    });

    quizAttempts.filter((q) => q.score < 80).forEach((q) => {
      const quizName = q.quizId || "Assessment";
      weakTopicsMap.set(quizName, {
        topic: quizName,
        count: (weakTopicsMap.get(quizName)?.count || 0) + 1,
        reason: `Low score (${q.score}%) on quiz`,
      });
    });

    const weakTopics = Array.from(weakTopicsMap.values()).slice(0, 3);

    // 4. Practice Challenges: prioritize challenges related to failed submissions or unmatched difficulty
    const failedSlugs = new Set(failedSubmissions.map((s) => s.challengeSlug));
    const practiceChallenges = INITIAL_CODING_CHALLENGES.filter((c: ChallengeSeedItem) => failedSlugs.has(c.slug))
      .slice(0, 3)
      .concat(
        INITIAL_CODING_CHALLENGES.filter((c: ChallengeSeedItem) => !failedSlugs.has(c.slug)).slice(0, 3)
      ).slice(0, 3);

    // 5. Recommended Quiz
    const lowQuiz = quizAttempts.find((q) => q.score < 80);
    const recommendedQuiz = lowQuiz
      ? { quizId: lowQuiz.quizId, reason: "Retake quiz to improve score" }
      : { quizId: "http-basics-quiz", reason: "Test backend fundamentals" };

    return {
      continueLearning,
      recommendedCourse,
      weakTopics,
      practiceChallenges,
      recommendedQuiz,
      dailyGoal,
    };
  }
}
