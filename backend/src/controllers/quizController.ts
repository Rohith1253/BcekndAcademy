import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { QuizAttempt } from "../models/QuizAttempt";
import { Progress } from "../models/Progress";
import { ProgressService } from "../services/progressService";
import { MULTI_LANGUAGE_LESSONS } from "../data/multi-language-lessons-data";
import { ALL_REAL_LESSONS } from "../data/all-lessons-content";

/**
 * POST /api/quiz/submit
 * Submits quiz answers, computes score, grants XP via ProgressService anti-farming rules.
 */
export async function submitQuiz(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const lessonSlug = req.body.lessonSlug || req.body.lessonId;
    const courseSlug = req.body.courseSlug;
    const answers = req.body.answers;
    const timeSpentSeconds = Number(req.body.timeSpentSeconds || req.body.timeSpent) || 0;

    if (!lessonSlug || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: "Missing required 'lessonSlug' (or 'lessonId') or 'answers' array.",
      });
    }

    // Find lesson quiz to verify correct answers securely
    const multiLesson = MULTI_LANGUAGE_LESSONS.find((l) => l.slug === lessonSlug);
    const legacyLesson = ALL_REAL_LESSONS.find((l) => l.slug === lessonSlug);
    const masterQuiz = multiLesson?.quiz || legacyLesson?.quiz || [];

    const evaluatedAnswers = answers.map((userAns: any) => {
      const q = masterQuiz.find((mq: any) => String(mq.id) === String(userAns.questionId));
      const correctIdx = q ? (q.correctOptionIndex !== undefined ? q.correctOptionIndex : (q as any).correct) : 0;
      const isCorrect = userAns.selectedOptionIndex === correctIdx;
      return {
        questionId: String(userAns.questionId),
        selectedOptionIndex: userAns.selectedOptionIndex,
        isCorrect,
      };
    });

    const totalQuestions = evaluatedAnswers.length;
    const correctCount = evaluatedAnswers.filter((a) => a.isCorrect).length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const result = await ProgressService.completeQuiz({
      userId,
      lessonSlug,
      courseSlug: courseSlug || multiLesson?.courseSlug,
      answers: evaluatedAnswers,
      score,
      timeSpentSeconds,
    });

    return res.status(200).json({
      success: true,
      data: {
        score,
        correctAnswers: correctCount,
        totalQuestions,
        isPassed: result.isPassed,
        xpEarned: result.xpEarned,
        attemptId: result.quizAttempt._id,
        userLevelInfo: result.userLevelInfo,
        unlockedAchievements: result.unlockedAchievements,
        result: {
          score,
          correctAnswers: correctCount,
          totalQuestions,
          isPassed: result.isPassed,
          passed: result.isPassed,
          xpEarned: result.xpEarned,
          alreadyCompleted: result.isPassed && result.xpEarned === 0,
        },
      },
    });
  } catch (error: any) {
    console.error("[QUIZ SUBMIT ERROR]", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to submit quiz",
    });
  }
}

/**
 * GET /api/quiz/check/:lessonSlug
 * Checks quiz unlock eligibility and previous attempts for a lesson.
 */
export async function checkQuizStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const lessonSlug = req.params.lessonSlug;

    const multiLesson = MULTI_LANGUAGE_LESSONS.find((l) => l.slug === lessonSlug);
    const legacyLesson = ALL_REAL_LESSONS.find((l) => l.slug === lessonSlug);
    const hasQuiz = Boolean(multiLesson?.quiz?.length || legacyLesson?.quiz?.length);

    let isUnlocked = true;
    let isPassed = false;
    let bestScore = 0;
    let attemptsCount = 0;

    if (userId) {
      const attempts = await QuizAttempt.find({ userId, lessonSlug }).sort({ score: -1 }).lean();
      attemptsCount = attempts.length;
      if (attempts.length > 0) {
        bestScore = attempts[0].score;
        isPassed = bestScore >= 70;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        lessonSlug,
        hasQuiz,
        isUnlocked,
        isPassed,
        bestScore,
        attemptsCount,
        passingScore: 70,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to check quiz status",
    });
  }
}

/**
 * GET /api/quizzes/history
 */
export async function getQuizHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const { lessonSlug } = req.query;
    const query: Record<string, any> = { userId };
    if (lessonSlug) query.lessonSlug = lessonSlug;

    const attempts = await QuizAttempt.find(query).sort({ completedAt: -1 }).limit(50).lean();

    return res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch quiz history",
    });
  }
}

/**
 * GET /api/quizzes/stats
 */
export async function getQuizStats(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const attempts = await QuizAttempt.find({ userId }).lean();
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.score >= 70).length;
    const averageScore =
      totalAttempts > 0
        ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts)
        : 0;
    const perfectScores = attempts.filter((a) => a.score === 100).length;
    const totalXPEarned = attempts.reduce((acc, a) => acc + (a.xpEarned || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        passedAttempts,
        averageScore,
        perfectScores,
        totalXPEarned,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch quiz stats",
    });
  }
}
