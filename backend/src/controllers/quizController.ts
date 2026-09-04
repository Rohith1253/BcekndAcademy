import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Lesson } from "../models/Lesson";
import { QuizResult } from "../models/Quiz";
import { User } from "../models/User";
import { addXP } from "../services/xpService";
import { validateInput, QuizSubmissionSchema } from "../utils/validation";

export async function submitQuiz(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { lessonId, answers, timeSpent } = validateInput(QuizSubmissionSchema, req.body);

    const lesson = await Lesson.findOne({ slug: lessonId }).lean();
    if (!lesson || !lesson.quiz || !lesson.quiz.questions) {
      return res.status(404).json({ success: false, error: "Quiz not found for this lesson" });
    }

    const questions = lesson.quiz.questions;
    let correctCount = 0;
    const evaluatedAnswers: Array<{ questionId: string; selectedOptionIndex: number; isCorrect: boolean }> = [];

    answers.forEach((ans) => {
      const q = questions.find((item: any) => item.id === ans.questionId || (item as any)._id === ans.questionId);
      const isCorrect = q ? q.correctOptionIndex === ans.selectedOptionIndex : false;
      if (isCorrect) correctCount++;
      evaluatedAnswers.push({
        questionId: ans.questionId,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect,
      });
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    const previousAttempt = await QuizResult.findOne({
      userId: req.user.userId,
      lessonId: lesson._id,
      score: { $gte: 70 },
    });

    const isFirstTimePass = scorePercentage >= 70 && !previousAttempt;

    let xpEarned = 0;

    if (isFirstTimePass) {
      const dbUser = await User.findById(req.user.userId);
      if (dbUser) {
        xpEarned = 150;
        const xpResult = addXP(dbUser.totalXP || 0, xpEarned);
        dbUser.totalXP = xpResult.newXP;
        dbUser.currentLevel = xpResult.newLevel;
        await dbUser.save();
      }
    }

    const quizResult = new QuizResult({
      userId: req.user.userId,
      lessonId: lesson._id,
      score: scorePercentage,
      answers: evaluatedAnswers,
      timeSpent,
      xpEarned,
      completedAt: new Date(),
    });
    await quizResult.save();

    return res.status(200).json({
      success: true,
      data: {
        score: scorePercentage,
        passed: scorePercentage >= 70,
        xpEarned,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        resultId: quizResult._id,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to submit quiz" });
  }
}

export async function getQuizResults(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const results = await QuizResult.find({ userId: req.user.userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: { results, count: results.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch quiz results" });
  }
}
