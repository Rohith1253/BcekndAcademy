import mongoose from "mongoose";
import { Progress, IProgress } from "../models/Progress";
import { User } from "../models/User";
import { Lesson } from "../models/Lesson";
import { Course } from "../models/Course";
import { QuizAttempt } from "../models/QuizAttempt";
import { CodingSubmission } from "../models/CodingSubmission";
import { CodingChallenge } from "../models/CodingChallenge";
import { ALL_COURSES } from "../data/multi-language-courses-data";
import { MULTI_LANGUAGE_LESSONS } from "../data/multi-language-lessons-data";
import { ALL_REAL_LESSONS } from "../data/all-lessons-content";
import { addXP, calculateLevelProgress } from "./xpService";
import { AchievementService } from "./achievementService";

const COURSE1_SLUGS = new Set([
  "http-basics",
  "rest-apis",
  "http-methods-status-codes",
  "nodejs",
  "nodejs-modules",
  "npm-package-management",
  "express-fundamentals",
  "express-routing",
  "express-middleware",
  "mongodb-fundamentals",
  "mongoose-odm",
  "crud-apis",
]);

export function getLessonsForCourse(courseSlug: string): any[] {
  const multi = MULTI_LANGUAGE_LESSONS.filter((l) => l.courseSlug === courseSlug);
  if (multi.length > 0) return multi.sort((a, b) => a.order - b.order);

  if (courseSlug === "backend-node-js") {
    return ALL_REAL_LESSONS.filter((l) => COURSE1_SLUGS.has(l.slug)).map((l) => ({ ...l, courseSlug: "backend-node-js" }));
  } else if (courseSlug === "typescript-backend") {
    return ALL_REAL_LESSONS.filter((l) => l.slug.startsWith("ts-")).map((l) => ({ ...l, courseSlug: "typescript-backend" }));
  } else if (courseSlug === "express-rest-api") {
    return ALL_REAL_LESSONS.filter((l) =>
      l.slug.startsWith("express-") ||
      l.slug.startsWith("rest-") ||
      l.slug.startsWith("validation-") ||
      l.slug.startsWith("centralized-") ||
      l.slug.startsWith("api-") ||
      l.slug.startsWith("service-layer") ||
      l.slug.startsWith("production-api") ||
      l.slug.startsWith("logging-")
    ).map((l) => ({ ...l, courseSlug: "express-rest-api" }));
  } else if (courseSlug === "mongodb-database") {
    return ALL_REAL_LESSONS.filter((l) =>
      l.slug.startsWith("mongodb-") ||
      l.slug.startsWith("mongoose-") ||
      l.slug.startsWith("embedding-") ||
      l.slug.startsWith("schema-") ||
      l.slug.startsWith("database-") ||
      l.slug.startsWith("indexes-") ||
      l.slug.startsWith("aggregation-") ||
      l.slug.startsWith("large-dataset-") ||
      l.slug.startsWith("relationships-") ||
      l.slug.startsWith("transactions-")
    ).map((l) => ({ ...l, courseSlug: "mongodb-database" }));
  } else if (courseSlug === "backend-auth-security") {
    return ALL_REAL_LESSONS.filter((l) =>
      l.slug.startsWith("auth-") ||
      l.slug.startsWith("password-") ||
      l.slug.startsWith("sessions-") ||
      l.slug.startsWith("jwt-") ||
      l.slug.startsWith("access-") ||
      l.slug.startsWith("token-") ||
      l.slug.startsWith("input-") ||
      l.slug.startsWith("nosql-") ||
      l.slug.startsWith("rate-") ||
      l.slug.startsWith("rbac-") ||
      l.slug.startsWith("ownership-") ||
      l.slug.startsWith("secure-")
    ).map((l) => ({ ...l, courseSlug: "backend-auth-security" }));
  }

  return [];
}

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

    // 2. Resolve lesson & parent course
    const multiLesson = MULTI_LANGUAGE_LESSONS.find((l) => l.slug === lessonId);
    const legacyLesson = ALL_REAL_LESSONS.find((l) => l.slug === lessonId);
    const resolvedCourseSlug =
      courseId || multiLesson?.courseSlug || (legacyLesson as any)?.courseSlug || "backend-node-js";

    // 3. Award XP if first completion
    let xpAwarded = 0;
    let courseBonusXP = 0;
    let isCourseCompleted = false;
    let userLevelInfo = null;

    if (isFirstTimeCompleted) {
      const lessonXP = multiLesson?.xpReward || legacyLesson?.xpReward || 100;
      xpAwarded = lessonXP;

      // Check if this completes the entire course
      const courseLessons = getLessonsForCourse(resolvedCourseSlug);
      if (courseLessons.length > 0) {
        const completedSlugs = await Progress.find({
          userId: userObjId,
          status: "completed",
        }).distinct("lessonId");

        const allCourseLessonsDone = courseLessons.every((l) => completedSlugs.includes(l.slug) || l.slug === lessonId);
        if (allCourseLessonsDone) {
          isCourseCompleted = true;
          courseBonusXP = 500; // Bonus 500 XP for mastering course
          xpAwarded += courseBonusXP;
        }
      }

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

    // 4. Auto-check achievements
    const achievementsResult = await AchievementService.checkAndUnlockAchievements(userObjId);

    // 5. Find next lesson
    let nextLesson: { slug: string; title: string; order: number } | null = null;
    const allCourseLessons = getLessonsForCourse(resolvedCourseSlug);
    if (allCourseLessons.length > 0) {
      const currentIndex = allCourseLessons.findIndex((l) => l.slug === lessonId);
      if (currentIndex >= 0 && currentIndex < allCourseLessons.length - 1) {
        const next = allCourseLessons[currentIndex + 1];
        nextLesson = { slug: next.slug, title: next.title, order: next.order };
      }
    }

    return {
      progress,
      xpAwarded,
      isFirstTimeCompleted,
      isCourseCompleted,
      courseBonusXP,
      userLevelInfo,
      unlockedAchievements: achievementsResult.unlocked,
      nextLesson,
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
      score,
      correctAnswers,
      totalQuestions,
      isPassed,
      xpEarned,
      userLevelInfo,
      unlockedAchievements: achievementsResult.unlocked,
    };
  }

  /**
   * Updates user daily learning streak accurately.
   */
  static async updateUserStreak(user: any): Promise<void> {
    const now = new Date();
    const lastActive = user.lastLoginDate ? new Date(user.lastLoginDate) : null;

    if (!lastActive) {
      user.currentStreak = 1;
      user.longestStreak = Math.max(user.longestStreak || 0, 1);
      user.lastLoginDate = now;
      return;
    }

    const diffMs = now.getTime() - lastActive.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours >= 20 && diffHours <= 48) {
      user.currentStreak = (user.currentStreak || 0) + 1;
      user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
      user.lastLoginDate = now;
    } else if (diffHours > 48) {
      user.currentStreak = 1;
      user.lastLoginDate = now;
    }
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

      let legacyCount = 0;
      let legacyCompleted = 0;
      let legacyTotalXP = 0;
      if (lang.slug === "javascript") {
        legacyCount = 48;
        legacyTotalXP = 7380;
        legacyCompleted = ALL_REAL_LESSONS.filter(
          (l) => completedSet.has(l.slug) && !l.slug.startsWith("ts-")
        ).length;
      } else if (lang.slug === "typescript") {
        legacyCount = 12;
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

      const completedCourses = langCourses.filter((course) => {
        const cLessons = MULTI_LANGUAGE_LESSONS.filter((l) => l.courseSlug === course.slug);
        if (cLessons.length === 0) return false;
        return cLessons.every((l) => completedSet.has(l.slug));
      }).length;

      let currentLevel: "Beginner" | "Intermediate" | "Advanced" = "Beginner";
      if (progressPercentage >= 80) currentLevel = "Advanced";
      else if (progressPercentage >= 40) currentLevel = "Intermediate";

      return {
        name: lang.name,
        slug: lang.slug,
        icon: lang.icon,
        totalCourses,
        completedCourses,
        totalLessons,
        completedLessons,
        progressPercentage,
        totalPossibleXP,
        earnedXP,
        currentLevel,
      };
    });
  }

  /**
   * Detects the smart resume learning target for the user.
   * Priority:
   * 1. Incomplete lesson in progress
   * 2. Next lesson in active course
   * 3. Module quiz if all module lessons completed but quiz not passed
   * 4. Recommended coding challenge for current language
   * 5. Fallback starter course
   */
  static async getContinueLearning(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));

    const [inProgress, completed, passedQuizzes, solvedChallenges] = await Promise.all([
      Progress.find({ userId: userObjId, status: "in-progress" })
        .sort({ lastAccessedAt: -1 })
        .limit(1)
        .lean(),
      Progress.find({ userId: userObjId, status: "completed" })
        .sort({ completedAt: -1 })
        .lean(),
      QuizAttempt.find({ userId: userObjId, score: { $gte: 70 } }).distinct("lessonSlug"),
      CodingSubmission.find({ userId: userObjId, status: "passed" }).distinct("challengeSlug"),
    ]);

    const completedLessonSet = new Set(completed.map((p) => p.lessonId));

    // Priority 1: Resume in-progress lesson
    if (inProgress.length > 0) {
      const active = inProgress[0];
      const lesson =
        MULTI_LANGUAGE_LESSONS.find((l) => l.slug === active.lessonId) ||
        ALL_REAL_LESSONS.find((l) => l.slug === active.lessonId);

      const course = ALL_COURSES.find((c) => c.slug === (lesson as any)?.courseSlug) || ALL_COURSES[0];

      return {
        action: "lesson" as const,
        type: "lesson" as const,
        title: lesson?.title || "Continue Lesson",
        slug: active.lessonId,
        courseSlug: course.slug,
        courseTitle: course.title,
        language: course.language,
        progressPercentage: active.progressPercentage || 50,
        nextAction: "Resume Lesson",
        message: `Continue learning: ${lesson?.title || active.lessonId}`,
        url: `/learn/${active.lessonId}`,
      };
    }

    // Priority 2: Next lesson in recently active course
    if (completed.length > 0) {
      const lastCompleted = completed[0];
      const multiLesson = MULTI_LANGUAGE_LESSONS.find((l) => l.slug === lastCompleted.lessonId);
      if (multiLesson) {
        const courseLessons = MULTI_LANGUAGE_LESSONS.filter(
          (l) => l.courseSlug === multiLesson.courseSlug
        ).sort((a, b) => a.order - b.order);

        const nextLesson = courseLessons.find((l) => !completedLessonSet.has(l.slug));
        const course = ALL_COURSES.find((c) => c.slug === multiLesson.courseSlug) || ALL_COURSES[0];

        if (nextLesson) {
          const completedInCourse = courseLessons.filter((l) => completedLessonSet.has(l.slug)).length;
          const coursePct = Math.round((completedInCourse / courseLessons.length) * 100);

          return {
            action: "lesson" as const,
            type: "lesson" as const,
            title: nextLesson.title,
            slug: nextLesson.slug,
            courseSlug: course.slug,
            courseTitle: course.title,
            language: course.language,
            progressPercentage: coursePct,
            nextAction: "Next Lesson",
            message: `Next up in ${course.title}: ${nextLesson.title}`,
            url: `/learn/${nextLesson.slug}`,
          };
        }

        // If all lessons in course are completed, check if quiz needs completion
        const unpassedQuizLesson = courseLessons.find((l) => !passedQuizzes.includes(l.slug));
        if (unpassedQuizLesson) {
          return {
            action: "quiz" as const,
            type: "quiz" as const,
            title: `${unpassedQuizLesson.title} Assessment`,
            slug: unpassedQuizLesson.slug,
            courseSlug: course.slug,
            courseTitle: course.title,
            language: course.language,
            progressPercentage: 90,
            nextAction: "Take Module Quiz",
            message: `Complete assessment quiz for ${unpassedQuizLesson.title}`,
            url: `/learn/${unpassedQuizLesson.slug}#quiz`,
          };
        }

        // Recommend a challenge for this course's language
        const relevantChallenge = await CodingChallenge.findOne({
          $or: [{ language: course.language.toLowerCase() }, { supportedLanguages: course.language.toLowerCase() }],
          slug: { $nin: solvedChallenges },
        }).lean();

        if (relevantChallenge) {
          return {
            action: "challenge" as const,
            type: "challenge" as const,
            title: relevantChallenge.title,
            slug: relevantChallenge.slug,
            courseSlug: course.slug,
            courseTitle: course.title,
            language: course.language,
            progressPercentage: 100,
            nextAction: "Solve Challenge",
            message: `Practice with real code: ${relevantChallenge.title}`,
            url: `/challenges/${relevantChallenge.slug}`,
          };
        }
      }
    }

    // Priority 5: Default starter course
    const defaultCourse = ALL_COURSES[0];
    return {
      action: "course" as const,
      type: "course" as const,
      title: defaultCourse.title,
      slug: "http-basics",
      courseSlug: defaultCourse.slug,
      courseTitle: defaultCourse.title,
      language: defaultCourse.language,
      progressPercentage: 0,
      nextAction: "Start Learning",
      message: `Begin your backend engineering path with ${defaultCourse.title}`,
      url: `/learn/http-basics`,
    };
  }

  /**
   * Returns complete course learning summary including modules, lesson completion, quiz states, and coding challenge.
   */
  static async getCourseLearningSummary(params: {
    userId?: string | mongoose.Types.ObjectId;
    courseSlug: string;
  }) {
    const { userId, courseSlug } = params;

    const course = ALL_COURSES.find((c) => c.slug === courseSlug);
    const courseLessons = getLessonsForCourse(courseSlug);

    let completedSlugs: string[] = [];
    let passedQuizSlugs: string[] = [];
    let solvedChallengeSlugs: string[] = [];

    if (userId) {
      const userObjId = new mongoose.Types.ObjectId(String(userId));
      const [compProgress, compQuizzes, compChallenges] = await Promise.all([
        Progress.find({ userId: userObjId, status: "completed" }).distinct("lessonId"),
        QuizAttempt.find({ userId: userObjId, score: { $gte: 70 } }).distinct("lessonSlug"),
        CodingSubmission.find({ userId: userObjId, status: "passed" }).distinct("challengeSlug"),
      ]);
      completedSlugs = compProgress;
      passedQuizSlugs = compQuizzes;
      solvedChallengeSlugs = compChallenges;
    }

    // Group lessons by module
    const modulesMap = new Map<string, any>();
    courseLessons.forEach((lesson) => {
      const modSlug = lesson.moduleSlug || `mod-${Math.ceil(lesson.order / 3)}`;
      const modTitle = lesson.moduleName || `Module ${Math.ceil(lesson.order / 3)}`;

      if (!modulesMap.has(modSlug)) {
        modulesMap.set(modSlug, {
          slug: modSlug,
          title: modTitle,
          lessons: [],
        });
      }

      const isCompleted = completedSlugs.includes(lesson.slug);
      const isQuizPassed = passedQuizSlugs.includes(lesson.slug);

      modulesMap.get(modSlug).lessons.push({
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        durationMinutes: lesson.duration || 15,
        xpReward: lesson.xpReward || 100,
        isCompleted,
        isQuizPassed,
      });
    });

    const modules = Array.from(modulesMap.values()).map((mod, idx) => {
      const totalInMod = mod.lessons.length;
      const completedInMod = mod.lessons.filter((l: any) => l.isCompleted).length;
      const isModuleComplete = totalInMod > 0 && completedInMod === totalInMod;
      const isQuizUnlocked = isModuleComplete || completedInMod >= Math.max(1, totalInMod - 1);
      const isUnlocked = idx === 0 || completedSlugs.length > 0;

      return {
        ...mod,
        totalLessons: totalInMod,
        completedLessons: completedInMod,
        isModuleComplete,
        isQuizUnlocked,
        isUnlocked,
      };
    });

    const totalLessons = courseLessons.length;
    const completedLessons = courseLessons.filter((l) => completedSlugs.includes(l.slug)).length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const isCourseCompleted = totalLessons > 0 && completedLessons === totalLessons;

    // Find recommended coding challenge for course
    const challenge = await CodingChallenge.findOne({
      $or: [{ language: course?.language?.toLowerCase() }, { supportedLanguages: course?.language?.toLowerCase() }],
    }).select("-hiddenTests").lean();

    return {
      course: course || { title: courseSlug, slug: courseSlug, language: "backend" },
      totalLessons,
      completedLessons,
      progressPercentage,
      isCourseCompleted,
      modules,
      challenge: challenge ? {
        slug: challenge.slug,
        title: challenge.title,
        difficulty: challenge.difficulty,
        xpReward: challenge.xpReward,
        isSolved: solvedChallengeSlugs.includes(challenge.slug),
      } : null,
    };
  }
}
