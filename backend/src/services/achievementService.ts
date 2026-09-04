import mongoose from "mongoose";
import { Achievement } from "../models/Achievement";
import { MASTER_ACHIEVEMENTS, MasterAchievementDefinition } from "../data/master-achievements";
import { Progress } from "../models/Progress";
import { CodingSubmission } from "../models/CodingSubmission";
import { QuizAttempt } from "../models/QuizAttempt";
import { User } from "../models/User";
import { ALL_COURSES } from "../data/multi-language-courses-data";
import { MULTI_LANGUAGE_LESSONS } from "../data/multi-language-lessons-data";
import { ALL_REAL_LESSONS } from "../data/all-lessons-content";

export interface UnlockResult {
  unlocked: MasterAchievementDefinition[];
  totalUnlockedCount: number;
}

export class AchievementService {
  /**
   * Evaluates and unlocks any achievements the user qualifies for.
   * Guarantees idempotency via unique compound index (userId + achievementId).
   */
  static async checkAndUnlockAchievements(userId: string | mongoose.Types.ObjectId): Promise<UnlockResult> {
    try {
      const userObjId = new mongoose.Types.ObjectId(String(userId));

      // 1. Gather existing unlocked achievement IDs
      const existing = await Achievement.find({ userId: userObjId }).distinct("achievementId");
      const existingSet = new Set(existing);

      // 2. Gather user metric snapshots
      const [
        userDoc,
        completedProgress,
        passedChallenges,
        quizAttempts,
      ] = await Promise.all([
        User.findById(userObjId).lean(),
        Progress.find({ userId: userObjId, status: "completed" }).lean(),
        CodingSubmission.find({ userId: userObjId, status: "passed" }).distinct("challengeSlug"),
        QuizAttempt.find({ userId: userObjId }).lean(),
      ]);

      if (!userDoc) {
        return { unlocked: [], totalUnlockedCount: existing.length };
      }

      const completedLessonsCount = completedProgress.length;
      const completedChallengesCount = passedChallenges.length;
      const totalXP = userDoc.totalXP || 0;
      const streakDays = userDoc.currentStreak || 0;

      // Unique languages with completed lessons
      const completedLessonSlugs = new Set(completedProgress.map((p) => p.lessonId));
      const languagesWithCompletedLessons = new Set<string>();

      // Check legacy lessons
      ALL_REAL_LESSONS.forEach((l) => {
        if (completedLessonSlugs.has(l.slug)) {
          languagesWithCompletedLessons.add("javascript");
        }
      });
      // Check multi-language lessons
      MULTI_LANGUAGE_LESSONS.forEach((l) => {
        if (completedLessonSlugs.has(l.slug)) {
          const categoryLang = l.category ? l.category.toLowerCase() : "javascript";
          languagesWithCompletedLessons.add(categoryLang);
        }
      });

      // Perfect quizzes count
      const perfectQuizzesCount = quizAttempts.filter((q) => q.score === 100).length;

      const newlyUnlocked: MasterAchievementDefinition[] = [];

      for (const master of MASTER_ACHIEVEMENTS) {
        if (existingSet.has(master.id)) continue;

        let qualified = false;
        const { type, count, courseSlug } = master.criteria;

        switch (type) {
          case "lessons_completed":
            qualified = completedLessonsCount >= count;
            break;
          case "challenges_completed":
            qualified = completedChallengesCount >= count;
            break;
          case "quizzes_completed":
            qualified = quizAttempts.length >= count;
            break;
          case "perfect_quizzes":
            qualified = perfectQuizzesCount >= count;
            break;
          case "streak_days":
            qualified = streakDays >= count;
            break;
          case "xp_earned":
            qualified = totalXP >= count;
            break;
          case "languages_completed":
            qualified = languagesWithCompletedLessons.size >= count;
            break;
          case "course_completed":
            if (courseSlug) {
              const courseLessons = MULTI_LANGUAGE_LESSONS.filter((l) => l.courseSlug === courseSlug);
              if (courseLessons.length > 0) {
                const allDone = courseLessons.every((l) => completedLessonSlugs.has(l.slug));
                qualified = allDone;
              }
            }
            break;
        }

        if (qualified) {
          try {
            await Achievement.create({
              userId: userObjId,
              achievementId: master.id,
              title: master.title,
              description: master.description,
              icon: master.icon,
              category: master.category,
              rarity: master.rarity,
              earnedAt: new Date(),
            });
            newlyUnlocked.push(master);
            existingSet.add(master.id);
          } catch (dupErr) {
            // Already unlocked in parallel race condition
          }
        }
      }

      return {
        unlocked: newlyUnlocked,
        totalUnlockedCount: existingSet.size,
      };
    } catch (err) {
      console.error("[ACHIEVEMENT SERVICE ERROR]", err);
      return { unlocked: [], totalUnlockedCount: 0 };
    }
  }

  static async getUserAchievements(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const userUnlocked = await Achievement.find({ userId: userObjId }).sort({ earnedAt: -1 }).lean();
    const unlockedMap = new Map(userUnlocked.map((u) => [u.achievementId, u]));

    const allDecorated = MASTER_ACHIEVEMENTS.map((master) => {
      const earned = unlockedMap.get(master.id);
      return {
        ...master,
        isUnlocked: !!earned,
        earnedAt: earned ? earned.earnedAt : null,
      };
    });

    return {
      achievements: allDecorated,
      unlockedCount: userUnlocked.length,
      totalCount: MASTER_ACHIEVEMENTS.length,
      percentage: Math.round((userUnlocked.length / MASTER_ACHIEVEMENTS.length) * 100),
    };
  }
}
