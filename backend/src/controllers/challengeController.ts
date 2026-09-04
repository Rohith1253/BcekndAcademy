import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { ChallengeSubmission } from "../models/Challenge";
import { User } from "../models/User";
import { executeInSandbox } from "../services/sandboxService";
import { addXP } from "../services/xpService";
import { ALL_CHALLENGES, getChallengeById } from "../data/challenges/index";

export async function getChallenges(req: Request, res: Response) {
  try {
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;

    let challenges = Object.values(ALL_CHALLENGES);
    if (category) challenges = challenges.filter((c: any) => c.category === category);
    if (difficulty) challenges = challenges.filter((c: any) => c.difficulty === difficulty);

    return res.status(200).json({ success: true, data: { challenges, total: challenges.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch challenges" });
  }
}

export async function getChallengeByIdController(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const challenge = getChallengeById(id);
    if (!challenge) {
      return res.status(404).json({ success: false, error: "Challenge not found" });
    }
    return res.status(200).json({ success: true, data: { challenge } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch challenge" });
  }
}

export async function submitChallenge(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { challengeId, code } = req.body;
    if (!challengeId || !code) {
      return res.status(400).json({ success: false, error: "challengeId and code are required" });
    }

    const challenge = getChallengeById(challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, error: "Challenge not found" });
    }

    const testExecution = executeInSandbox(code, 2000);

    const testResults: Array<{ name: string; passed: boolean; error?: string }> = [];
    let passedCount = 0;

    if (challenge.testCases && challenge.testCases.length > 0) {
      for (const tc of challenge.testCases) {
        const testCode = (tc as any).testCode || (tc as any).input || "";
        const fullCode = `${code}\n${testCode}`;
        const exec = executeInSandbox(fullCode, 2000);
        const passed = !exec.error;
        if (passed) passedCount++;
        testResults.push({
          name: tc.name,
          passed,
          error: exec.error || undefined,
        });
      }
    } else {
      passedCount = testExecution.error ? 0 : 1;
      testResults.push({
        name: "Code Execution Test",
        passed: !testExecution.error,
        error: testExecution.error || undefined,
      });
    }

    const allPassed = passedCount === testResults.length;

    const previousPassedSubmission = await ChallengeSubmission.findOne({
      userId: req.user.userId,
      challengeId,
      status: "passed",
    });

    const isFirstTimePass = allPassed && !previousPassedSubmission;
    let xpEarned = 0;

    if (isFirstTimePass) {
      const dbUser = await User.findById(req.user.userId);
      if (dbUser) {
        xpEarned = (challenge as any).xpReward || 200;
        const xpResult = addXP(dbUser.totalXP || 0, xpEarned);
        dbUser.totalXP = xpResult.newXP;
        dbUser.currentLevel = xpResult.newLevel;
        await dbUser.save();
      }
    }

    const submission = new ChallengeSubmission({
      userId: req.user.userId,
      challengeId,
      code,
      testsPassed: passedCount,
      totalTests: testResults.length,
      success: allPassed,
      executionTime: testExecution.executionTime,
      xpEarned,
      completedAt: new Date(),
    });
    await submission.save();

    return res.status(200).json({
      success: true,
      data: {
        passed: allPassed,
        xpEarned,
        testResults,
        logs: testExecution.logs,
        executionTime: testExecution.executionTime,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to submit challenge" });
  }
}

export async function getChallengeSubmissions(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const submissions = await ChallengeSubmission.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: { submissions, count: submissions.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch submissions" });
  }
}
