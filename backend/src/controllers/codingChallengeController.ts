import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/auth";
import { CodingChallenge } from "../models/CodingChallenge";
import { CodingSubmission } from "../models/CodingSubmission";
import { User } from "../models/User";
import { getChallengeEvaluator, MAX_CODE_SIZE_BYTES } from "../services/execution";
import { XPService } from "../services/xpService";
import { LevelService } from "../services/levelService";
import { StreakService } from "../services/streakService";
import { DailyChallengeService } from "../services/dailyChallengeService";
import { MilestoneService } from "../services/milestoneService";
import { AchievementService } from "../services/achievementService";

/**
 * GET /api/challenges
 * Returns all published challenges without hidden tests.
 * Supports filtering by category, difficulty, language, and search query.
 */
export async function getChallenges(req: AuthenticatedRequest, res: Response) {
  try {
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;
    const language = req.query.language as string;
    const search = req.query.search as string;

    const query: Record<string, any> = { isPublished: true };

    if (category && category !== "All") {
      query.category = category;
    }
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty.toLowerCase();
    }
    if (language && language !== "All") {
      const langLower = language.toLowerCase();
      query.$or = [{ language: langLower }, { supportedLanguages: langLower }];
    }
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const challenges = await CodingChallenge.find(query)
      .select("-hiddenTests")
      .sort({ order: 1, createdAt: 1 })
      .lean();

    let solvedSlugs: string[] = [];
    if (req.user?.userId) {
      solvedSlugs = await CodingSubmission.find({
        userId: req.user.userId,
        status: "passed",
      }).distinct("challengeSlug");
    }

    const decorated = challenges.map((ch) => ({
      ...ch,
      isCompleted: solvedSlugs.includes(ch.slug),
    }));

    return res.status(200).json({
      success: true,
      data: {
        challenges: decorated,
        total: decorated.length,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch coding challenges",
    });
  }
}

/**
 * GET /api/challenges/:slug
 * Returns a single challenge by slug, hiding hiddenTests.
 */
export async function getChallengeBySlugController(req: AuthenticatedRequest, res: Response) {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

    const challenge = await CodingChallenge.findOne({
      $or: [{ slug: slug.toLowerCase() }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
      isPublished: true,
    })
      .select("-hiddenTests")
      .lean();

    if (!challenge) {
      return res.status(404).json({ success: false, error: "Coding challenge not found" });
    }

    let isCompleted = false;
    let latestDraftCode: string | null = null;

    if (req.user?.userId) {
      const priorPass = await CodingSubmission.findOne({
        userId: req.user.userId,
        challengeSlug: challenge.slug,
        status: "passed",
      });
      isCompleted = !!priorPass;

      const latestSub = await CodingSubmission.findOne({
        userId: req.user.userId,
        challengeSlug: challenge.slug,
      }).sort({ createdAt: -1 });

      if (latestSub) {
        latestDraftCode = latestSub.code;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        challenge,
        isCompleted,
        latestDraftCode,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to load challenge details",
    });
  }
}

/**
 * POST /api/challenges/:slug/run
 * Safely evaluates visible tests via ChallengeEvaluator.
 */
export async function runChallengeTests(req: Request, res: Response) {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const { code, language } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ success: false, error: "Code content is required" });
    }

    const codeBytes = Buffer.byteLength(code, "utf8");
    if (codeBytes > MAX_CODE_SIZE_BYTES) {
      return res.status(413).json({
        success: false,
        error: `Code size exceeds maximum limit of 64 KB (${(codeBytes / 1024).toFixed(1)} KB).`,
      });
    }

    const challenge = await CodingChallenge.findOne({ slug: slug.toLowerCase() });
    if (!challenge) {
      return res.status(404).json({ success: false, error: "Challenge not found" });
    }

    const evaluator = getChallengeEvaluator();
    const evaluation = await evaluator.evaluateChallenge({
      code,
      language: language || challenge.language || "javascript",
      visibleTests: challenge.visibleTests || [],
      hiddenTests: [],
      xpReward: challenge.xpReward || 50,
      alreadyCompleted: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        status: evaluation.status,
        passed: evaluation.status === "passed",
        score: evaluation.score,
        passedTests: evaluation.passedTests,
        totalTests: evaluation.totalTests,
        results: evaluation.visibleTestResults,
        logs: evaluation.logs,
        executionTime: evaluation.executionTime,
        message: evaluation.message,
        provider: evaluation.provider,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Execution failed",
    });
  }
}

/**
 * POST /api/challenges/:slug/submit
 * Safely evaluates both visible and hidden tests, records submission, awards XP, and checks achievements.
 */
export async function submitChallengeSolution(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Authentication required to submit solutions" });
    }

    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const { code, language } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ success: false, error: "Code content is required" });
    }

    const codeBytes = Buffer.byteLength(code, "utf8");
    if (codeBytes > MAX_CODE_SIZE_BYTES) {
      return res.status(413).json({
        success: false,
        error: `Code size exceeds maximum limit of 64 KB (${(codeBytes / 1024).toFixed(1)} KB).`,
      });
    }

    const challenge = await CodingChallenge.findOne({ slug: slug.toLowerCase() });
    if (!challenge) {
      return res.status(404).json({ success: false, error: "Challenge not found" });
    }

    // Check if user has already passed
    const previousPass = await CodingSubmission.findOne({
      userId: req.user.userId,
      challengeSlug: challenge.slug,
      status: "passed",
    });
    const alreadyCompleted = !!previousPass;

    const targetLang = language || challenge.language || "javascript";
    const evaluator = getChallengeEvaluator();
    const outcome = await evaluator.evaluateChallenge({
      code,
      language: targetLang,
      visibleTests: challenge.visibleTests || [],
      hiddenTests: challenge.hiddenTests || [],
      xpReward: challenge.xpReward || 50,
      alreadyCompleted,
    });

    const isPassed = outcome.status === "passed";

    // Update user XP if newly passed via centralized XPService
    let userLevelInfo = null;
    let earnedXP = outcome.earnedXP;
    if (isPassed && !alreadyCompleted && outcome.earnedXP > 0) {
      const xpRes = await XPService.awardXP({
        userId: req.user.userId,
        sourceType: "coding_challenge",
        sourceId: challenge.slug,
        xpAmount: outcome.earnedXP,
        metadata: { challengeId: challenge._id, language: targetLang },
      });
      earnedXP = xpRes.xpEarned;
      userLevelInfo = xpRes.userLevelInfo;
    }

    if (isPassed) {
      await StreakService.recordActivity({
        userId: req.user.userId,
        activityType: "challenge_completion",
        activityId: challenge.slug,
      });
      await DailyChallengeService.completeDailyChallenge(req.user.userId, challenge.slug);
      await MilestoneService.evaluateMilestones(req.user.userId);
    }

    // Record submission
    const submissionRecord = new CodingSubmission({
      userId: req.user.userId,
      challengeId: challenge._id,
      challengeSlug: challenge.slug,
      code,
      language: targetLang,
      status: isPassed ? "passed" : "failed",
      testsPassed: outcome.passedTests,
      totalTests: outcome.totalTests,
      score: outcome.score,
      earnedXP: outcome.earnedXP,
      executionTime: outcome.executionTime,
      testResults: outcome.visibleTestResults.map((t) => ({
        name: t.name,
        passed: t.passed,
        expected: t.expected,
        received: t.received,
        error: t.error,
      })),
      submittedAt: new Date(),
    });
    await submissionRecord.save();

    // Check and unlock achievements
    const achievementsResult = await AchievementService.checkAndUnlockAchievements(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        passed: isPassed,
        score: outcome.score,
        testsPassed: outcome.passedTests,
        totalTests: outcome.totalTests,
        earnedXP: outcome.earnedXP,
        alreadyCompleted,
        visibleResults: outcome.visibleTestResults,
        hiddenTestsPassed: outcome.hiddenTestsPassed,
        hiddenTestsTotal: outcome.hiddenTestsTotal,
        logs: outcome.logs,
        executionTime: outcome.executionTime,
        message: outcome.message,
        provider: outcome.provider,
        userLevelInfo,
        unlockedAchievements: achievementsResult.unlocked,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to evaluate challenge submission",
    });
  }
}

/**
 * GET /api/challenges/:slug/submissions
 * Returns user's submission history for a challenge.
 */
export async function getChallengeSubmissionsForSlug(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

    const submissions = await CodingSubmission.find({
      userId: req.user.userId,
      challengeSlug: slug.toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        submissions,
        total: submissions.length,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch submission history",
    });
  }
}

/**
 * GET /api/challenges/user/progress (also /api/challenges/progress)
 * Returns user challenge completion statistics.
 */
export async function getChallengeProgress(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const totalAvailable = await CodingChallenge.countDocuments({ isPublished: true });
    const solvedSubmissions = await CodingSubmission.find({
      userId: req.user.userId,
      status: "passed",
    }).distinct("challengeSlug");

    const passedCount = solvedSubmissions.length;
    const progressPercentage =
      totalAvailable > 0 ? Math.min(100, Math.round((passedCount / totalAvailable) * 100)) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalAvailable,
        completedCount: passedCount,
        solvedSlugs: solvedSubmissions,
        progressPercentage,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch challenge progress",
    });
  }
}
