import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/auth";
import { CodingChallenge } from "../models/CodingChallenge";
import { CodingSubmission } from "../models/CodingSubmission";
import { User } from "../models/User";
import { runTests, evaluateSubmission, executeCode } from "../services/codeExecution.service";

/**
 * GET /api/challenges
 * Returns all published challenges without hidden tests.
 * Optionally flags challenges solved by the authenticated user.
 */
export async function getChallenges(req: AuthenticatedRequest, res: Response) {
  try {
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;
    const search = req.query.search as string;

    const query: Record<string, any> = { isPublished: true };

    if (category && category !== "All") {
      query.category = category;
    }
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty.toLowerCase();
    }
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Always exclude hiddenTests from catalog output
    const challenges = await CodingChallenge.find(query)
      .select("-hiddenTests")
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Check which challenges current user has passed
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
 * Returns a single challenge by slug, strictly hiding hiddenTests.
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
 * Evaluates ONLY visible tests. Returns immediate console logs and test details.
 */
export async function runChallengeTests(req: Request, res: Response) {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const { code } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ success: false, error: "Code content is required" });
    }

    if (code.length > 50000) {
      return res.status(400).json({ success: false, error: "Code submission exceeds maximum limit (50KB)" });
    }

    const challenge = await CodingChallenge.findOne({ slug: slug.toLowerCase() });
    if (!challenge) {
      return res.status(404).json({ success: false, error: "Challenge not found" });
    }

    const visibleTests = challenge.visibleTests || [];
    const outcome = runTests(code, visibleTests, 2000);

    return res.status(200).json({
      success: true,
      data: {
        results: outcome.testResults,
        logs: outcome.logs,
        executionTime: outcome.executionTime,
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
 * Evaluates BOTH visible and hidden tests. Saves submission and awards XP once.
 */
export async function submitChallengeSolution(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Authentication required to submit solutions" });
    }

    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const { code } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ success: false, error: "Code content is required" });
    }

    if (code.length > 50000) {
      return res.status(400).json({ success: false, error: "Code submission exceeds maximum limit (50KB)" });
    }

    const challenge = await CodingChallenge.findOne({ slug: slug.toLowerCase() });
    if (!challenge) {
      return res.status(404).json({ success: false, error: "Challenge not found" });
    }

    const outcome = await evaluateSubmission(req.user.userId, challenge, code);

    return res.status(200).json({
      success: true,
      data: {
        passed: outcome.success,
        score: outcome.score,
        testsPassed: outcome.testsPassed,
        totalTests: outcome.totalTests,
        earnedXP: outcome.earnedXP,
        alreadyCompleted: outcome.alreadyCompleted,
        visibleResults: outcome.visibleTestResults,
        hiddenTestsPassed: outcome.hiddenTestsPassed,
        hiddenTestsTotal: outcome.hiddenTestsTotal,
        logs: outcome.logs,
        executionTime: outcome.executionTime,
        message: outcome.message,
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
 * GET /api/challenges/progress
 * Returns user's overall coding challenge stats and progress.
 */
export async function getChallengeProgress(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const totalChallenges = await CodingChallenge.countDocuments({ isPublished: true });

    const completedSlugs = await CodingSubmission.find({
      userId: req.user.userId,
      status: "passed",
    }).distinct("challengeSlug");

    const userObjId = new mongoose.Types.ObjectId(req.user.userId);
    const xpAggregate = await CodingSubmission.aggregate([
      { $match: { userId: userObjId } },
      { $group: { _id: null, totalXP: { $sum: "$earnedXP" } } },
    ]);

    const totalCodingXP = xpAggregate[0]?.totalXP || 0;

    const user = await User.findById(req.user.userId).select("currentStreak totalXP currentLevel").lean();

    return res.status(200).json({
      success: true,
      data: {
        totalChallenges,
        completedCount: completedSlugs.length,
        totalCodingXP,
        currentStreak: user?.currentStreak || 0,
        userLevel: user?.currentLevel || 1,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch coding progress",
    });
  }
}
