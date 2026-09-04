import mongoose from "mongoose";
import { Progress, IProgress } from "../models/Progress";
import { User } from "../models/User";
import { Lesson } from "../models/Lesson";
import { Course } from "../models/Course";
import { QuizAttempt } from "../models/QuizAttempt";
import { CodingSubmission } from "../models/CodingSubmission";
import { ALL_COURSES } from "../data/multi-language-courses-data";
import { MULTI_LANGUAGE_LESSONS } from "../data/multi-language-lessons-data";
import { ALL_REAL_LESSONS } from "../data/all-lessons-content";
import { addXP, calculateLevelProgress } from "./xpService";
import { AchievementService } from "./achievementService";

export class ProgressService {
  /**
   * Records lesson completion with idempotent XP award and streak evaluation.
   */
  static async completeLesson(params: {
    userId: string | mongoose.Types.ObjectId;
    lessonId: string;
    courseId?: string;
    moduleId?: string;
    status?: "not-started" | "in-progress" | "completed";
    progressPercentage?: number;
    timeSpent?: number;
  }) {
    const {
      userId,
      lessonId,
      courseId,
      moduleId,
      status = "completed",
      progressPercentage = 100,
      timeSpent = 0,
    } = params;

    const userObjId = new mongoose.Types.ObjectId(String(userId));

    // 1. Find or create progress record
    let progress = await Progress.findOne({ userId: userObjId, lessonId });
    const isFirstTimeCompleted =
      status === "completed" && (!progress || progress.status !== "completed");

    if (!progress) {
      progress = new Progress({
        userId: userObjId,
        lessonId,
        courseId,
        moduleId,
        status,
        progressPercentage,
        timeSpent,
        startedAt: new Date(),
        lastAccessedAt: new Date(),
        completedAt: status === "completed" ? new Date() : undefined,
      });
    } else {
      progress.status = status;
      progress.progressPercentage = Math.max(progress.progressPercentage, progressPercentage);
      progress.timeSpent += timeSpent;
      progress.lastAccessedAt = new Date();
      if (status === "completed" && !progress.completedAt) {
        progress.completedAt = new Date();
      }
    }
    await progress.save();

    // 2. Award XP if first completion
    let xpAwarded = 0;
    let userLevelInfo = null;

    if (isFirstTimeCompleted) {
      // Find lesson definition to get XP
      const multiLesson = MULTI_LANGUAGE_LESSONS.find((l) => l.slug === lessonId);
      const legacyLesson = ALL_REAL_LESSONS.find((l) => l.slug === lessonId);
      const lessonXP = multiLesson?.xpReward || legacyLesson?.xpReward || 100;
      xpAwarded = lessonXP;

      const user = await User.findById(userObjId);
      if (user) {
        const xpResult = addXP(user.totalXP || 0, xpAwarded);
        user.totalXP = xpResult.newXP;
        user.currentLevel = xpResult.newLevel;
        await ProgressService.updateUserStreak(user);
        await user.save();
        userLevelInfo = calculateLevelProgress(user.totalXP);
      }
    }

    // 3. Auto-check achievements
    const achievementsResult = await AchievementService.checkAndUnlockAchievements(userObjId);

    return {
      progress,
      xpAwarded,
      isFirstTimeCompleted,
      userLevelInfo,
      unlockedAchievements: achievementsResult.unlocked,
    };
  }

  /**
   * Records a quiz attempt, awards XP, and prevents duplicate XP farming.
   */
  static async completeQuiz(params: {
    userId: string | mongoose.Types.ObjectId;
    lessonSlug: string;
    courseSlug?: string;
    answers: Array<{ questionId: string; selectedOptionIndex: number; isCorrect: boolean }>;
    score: number;
    timeSpentSeconds?: number;
  }) {
    const { userId, lessonSlug, courseSlug, answers, score, timeSpentSeconds = 0 } = params;
    const userObjId = new mongoose.Types.ObjectId(String(userId));

    const totalQuestions = answers.length;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;

    // Check previous best attempt
    const previousBest = await QuizAttempt.findOne({
      userId: userObjId,
      lessonSlug,
    }).sort({ score: -1 });

    const isPassed = score >= 70;
    let xpEarned = 0;

    // Award XP only on new passing score or improved score
    if (isPassed) {
      const completionXP = 20;
      const questionXP = correctAnswers * 5;
      const perfectBonus = score === 100 ? 50 : 0;
      const calculatedXP = completionXP + questionXP + perfectBonus;

      if (!previousBest || previousBest.score < 70) {
        xpEarned = calculatedXP;
      } else if (score > previousBest.score) {
        // Award proportional differential XP on improved score
        xpEarned = Math.round(calculatedXP * ((score - previousBest.score) / 100));
      }
    }

    const quizAttempt = new QuizAttempt({
      userId: userObjId,
      lessonSlug,
      courseSlug,
      score,
      correctAnswers,
      totalQuestions,
      xpEarned,
      timeSpentSeconds,
      answers,
      completedAt: new Date(),
    });
    await quizAttempt.save();

    let userLevelInfo = null;
    if (xpEarned > 0) {
      const user = await User.findById(userObjId);
      if (user) {
        const xpResult = addXP(user.totalXP || 0, xpEarned);
        user.totalXP = xpResult.newXP;
        user.currentLevel = xpResult.newLevel;
        await ProgressService.updateUserStreak(user);
        await user.save();
        userLevelInfo = calculateLevelProgress(user.totalXP);
      }
    }

    const achievementsResult = await AchievementService.checkAndUnlockAchievements(userObjId);

    return {
      quizAttempt,
      xpEarned,
      score,
      isPassed,
      userLevelInfo,
      unlockedAchievements: achievementsResult.unlocked,
    };
  }

  /**
   * Calculates progress for all 11 backend languages.
   */
  static async calculateLanguageProgress(userId?: string | mongoose.Types.ObjectId) {
    let completedSet = new Set<string>();

    if (userId) {
      const userObjId = new mongoose.Types.ObjectId(String(userId));
      const completedProgress = await Progress.find({ userId: userObjId, status: "completed" }).lean();
      completedSet = new Set(completedProgress.map((p) => p.lessonId));
    }

    const languageKeys = [
      { name: "JavaScript", slug: "javascript", icon: "Flame" },
      { name: "TypeScript", slug: "typescript", icon: "Code2" },
      { name: "Python", slug: "python", icon: "Terminal" },
      { name: "Java", slug: "java", icon: "Cpu" },
      { name: "C# (.NET)", slug: "csharp", icon: "Layers" },
      { name: "Go", slug: "go", icon: "Zap" },
      { name: "PHP", slug: "php", icon: "Globe" },
      { name: "Rust", slug: "rust", icon: "ShieldAlert" },
      { name: "Ruby", slug: "ruby", icon: "Gem" },
      { name: "Kotlin", slug: "kotlin", icon: "Boxes" },
      { name: "Elixir", slug: "elixir", icon: "Workflow" },
    ];

    return languageKeys.map((lang) => {
      const langCourses = ALL_COURSES.filter((c) => c.language.toLowerCase() === lang.slug);
      const totalCourses = langCourses.length;

      // Collect lessons for this language
      const courseSlugs = new Set(langCourses.map((c) => c.slug));
      const multiLessons = MULTI_LANGUAGE_LESSONS.filter((l) => courseSlugs.has(l.courseSlug));

      // Include legacy lessons if js/ts
      let legacyCount = 0;
      let legacyCompleted = 0;
      let legacyTotalXP = 0;
      if (lang.slug === "javascript") {
        legacyCount = 48; // legacy js lessons
        legacyTotalXP = 7380;
        legacyCompleted = ALL_REAL_LESSONS.filter(
          (l) => completedSet.has(l.slug) && !l.slug.startsWith("ts-")
        ).length;
      } else if (lang.slug === "typescript") {
        legacyCount = 12; // legacy ts lessons
        legacyTotalXP = 1830;
        legacyCompleted = ALL_REAL_LESSONS.filter(
          (l) => completedSet.has(l.slug) && l.slug.startsWith("ts-")
        ).length;
      }

      const totalLessons = multiLessons.length + legacyCount;
      const multiCompleted = multiLessons.filter((l) => completedSet.has(l.slug)).length;
      const completedLessons = multiCompleted + legacyCompleted;

      const progressPercentage =
        totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;

      const totalPossibleXP =
        multiLessons.reduce((acc, l) => acc + (l.xpReward || 100), 0) + legacyTotalXP;
      const earnedXP =
        multiLessons
          .filter((l) => completedSet.has(l.slug))
          .reduce((acc, l) => acc + (l.xpReward || 100), 0) +
        (legacyCompleted * 150);

      // Completed courses count
      const completedCourses = langCourses.filter((course) => {
        const cLessons = MULTI_LANGUAGE_LESSONS.filter((l) => l.courseSlug === course.slug);
        if (cLessons.length === 0) return false;
        return cLessons.every((l) => completedSet.has(l.slug));
      }).length;

      let currentLevel = "Beginner";
      if (progressPercentage >= 80) currentLevel = "Advanced";
      else if (progressPercentage >= 40) currentLevel = "Intermediate";

      return {
        language: lang.name,
        slug: lang.slug,
        icon: lang.icon,
        totalCourses,
        completedCourses,
        totalLessons,
        completedLessons,
        progressPercentage,
        totalPossibleXP,
        xpEarned: earnedXP,
        currentLevel,
      };
    });
  }

  /**
   * Detects the smart resume learning target for the user.
   */
  static async getContinueLearning(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));

    const [inProgress, completed] = await Promise.all([
      Progress.find({ userId: userObjId, status: "in-progress" })
        .sort({ lastAccessedAt: -1 })
        .limit(1)
        .lean(),
      Progress.find({ userId: userObjId, status: "completed" })
        .sort({ completedAt: -1 })
        .limit(1)
        .lean(),
    ]);

    // 1. Resume in-progress lesson if available
    if (inProgress.length > 0) {
      const active = inProgress[0];
      const lesson =
        MULTI_LANGUAGE_LESSONS.find((l) => l.slug === active.lessonId) ||
        ALL_REAL_LESSONS.find((l) => l.slug === active.lessonId);

      const course = ALL_COURSES.find((c) => c.slug === (lesson as any)?.courseSlug) || ALL_COURSES[0];

      return {
        type: "lesson" as const,
        title: lesson?.title || "Continue Lesson",
        slug: active.lessonId,
        courseSlug: course.slug,
        courseTitle: course.title,
        language: course.language,
        progressPercentage: active.progressPercentage || 50,
        nextAction: "Resume Lesson",
        url: `/learn/${active.lessonId}`,
      };
    }

    // 2. Next lesson in recently completed course
    if (completed.length > 0) {
      const lastCompleted = completed[0];
      const multiLesson = MULTI_LANGUAGE_LESSONS.find((l) => l.slug === lastCompleted.lessonId);
      if (multiLesson) {
        const courseLessons = MULTI_LANGUAGE_LESSONS.filter(
          (l) => l.courseSlug === multiLesson.courseSlug
        ).sort((a, b) => a.order - b.order);

        const completedSet = new Set(
          (await Progress.find({ userId: userObjId, status: "completed" }).distinct("lessonId"))
        );

        const nextLesson = courseLessons.find((l) => !completedSet.has(l.slug));
        if (nextLesson) {
          const course = ALL_COURSES.find((c) => c.slug === nextLesson.courseSlug) || ALL_COURSES[0];
          return {
            type: "lesson" as const,
            title: nextLesson.title,
            slug: nextLesson.slug,
            courseSlug: course.slug,
            courseTitle: course.title,
            language: course.language,
            progressPercentage: 0,
            nextAction: "Next Lesson",
            url: `/learn/${nextLesson.slug}`,
          };
        }
      }
    }

    // 3. Fallback: Recommended starter course
    const defaultCourse = ALL_COURSES[0];
    return {
      type: "course" as const,
      title: defaultCourse.title,
      slug: "http-basics",
      courseSlug: defaultCourse.slug,
      courseTitle: defaultCourse.title,
      language: defaultCourse.language,
      progressPercentage: 0,
      nextAction: "Start Learning",
      url: `/learn/http-basics`,
    };
  }

  /**
   * Updates user consecutive daily streak.
   */
  private static async updateUserStreak(user: any) {
    const now = new Date();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;

    if (!lastLogin) {
      user.currentStreak = 1;
      user.longestStreak = Math.max(user.longestStreak || 0, 1);
      user.lastLoginDate = now;
      return;
    }

    const diffDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - lastLogin.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      user.currentStreak = (user.currentStreak || 0) + 1;
      user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
    } else if (diffDays > 1) {
      user.currentStreak = 1;
    }
    user.lastLoginDate = new Date();
  }
}
