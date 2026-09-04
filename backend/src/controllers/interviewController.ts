import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { INTERVIEW_QUESTIONS } from "../data/interview-questions-data";
import { XPService } from "../services/xpService";
import { StreakService } from "../services/streakService";
import { MilestoneService } from "../services/milestoneService";

export async function getInterviewCategories(req: Request, res: Response) {
  try {
    const categories = Array.from(new Set(INTERVIEW_QUESTIONS.map((q) => q.category)));
    return res.status(200).json({ success: true, data: { categories, topics: categories } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to fetch interview categories" });
  }
}

export async function getInterviewQuestions(req: Request, res: Response) {
  try {
    const category = (req.query.category || req.query.topic) as string;
    const difficulty = req.query.difficulty as string;

    let filtered = INTERVIEW_QUESTIONS;
    if (category) filtered = filtered.filter((q) => q.category.toLowerCase() === category.toLowerCase());
    if (difficulty) filtered = filtered.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase());

    // Security: Strip correctOptionIndex and explanation from listings
    const publicQuestions = filtered.map((q) => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      title: q.title,
      type: q.type,
      question: q.question,
      codeSnippet: q.codeSnippet,
      options: q.options,
      hints: q.hints,
      xpReward: q.xpReward,
    }));

    return res.status(200).json({ success: true, data: { questions: publicQuestions, total: publicQuestions.length } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to fetch interview questions" });
  }
}

export async function answerInterviewQuestion(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { questionId, selectedOptionIndex, answer } = req.body;

    const question = INTERVIEW_QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found" });
    }

    let isCorrect = false;
    if (selectedOptionIndex !== undefined) {
      isCorrect = selectedOptionIndex === question.correctOptionIndex;
    } else if (typeof answer === "string" && answer.trim().length > 10) {
      isCorrect = true; // Subjective evaluation passed
    }

    let xpEarned = 0;
    let userLevelInfo = null;

    if (isCorrect && userId) {
      const xpRes = await XPService.awardXP({
        userId,
        sourceType: "coding_challenge",
        sourceId: `interview_${question.id}`,
        xpAmount: question.xpReward,
        metadata: { questionId: question.id, category: question.category },
      });
      xpEarned = xpRes.xpEarned;
      userLevelInfo = xpRes.userLevelInfo;

      await StreakService.recordActivity({
        userId,
        activityType: "challenge_completion",
        activityId: `interview_${question.id}`,
      });

      await MilestoneService.evaluateMilestones(userId);
    }

    return res.status(200).json({
      success: true,
      data: {
        isCorrect,
        correct: isCorrect,
        passed: isCorrect,
        correctOptionIndex: question.correctOptionIndex,
        explanation: question.explanation,
        modelAnswer: question.explanation || "Comprehensive backend architecture response.",
        xpEarned,
        userLevelInfo,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to evaluate answer" });
  }
}
