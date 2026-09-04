import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { API_LABS } from "../data/api-labs-data";
import { XPService } from "../services/xpService";
import { StreakService } from "../services/streakService";
import { MilestoneService } from "../services/milestoneService";

export async function getApiLabs(req: Request, res: Response) {
  try {
    const labs = API_LABS.map((l) => ({
      slug: l.slug,
      title: l.title,
      category: l.category,
      difficulty: l.difficulty,
      description: l.description,
      objective: l.objective,
      xpReward: l.xpReward,
      estimatedMinutes: l.estimatedMinutes,
    }));
    return res.status(200).json({ success: true, data: { labs, total: labs.length } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to fetch API labs" });
  }
}

export async function getApiLabBySlug(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const lab = API_LABS.find((l) => l.slug === slug);
    if (!lab) {
      return res.status(404).json({ success: false, error: "API Lab not found" });
    }
    return res.status(200).json({ success: true, data: { lab, ...lab } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to fetch API lab" });
  }
}

export async function runApiLab(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const { method, endpoint, path: reqPath, headers = {}, body } = req.body;
    const targetEndpoint = endpoint || reqPath || "/";
    const lab = API_LABS.find((l) => l.slug === slug);

    if (!lab) {
      return res.status(404).json({ success: false, error: "API Lab not found" });
    }

    // Deterministic safe mock execution (Zero SSRF risk)
    const expected = lab.expectedValidation;
    const isMethodMatch = method?.toUpperCase() === expected.method;
    const isEndpointMatch = targetEndpoint?.trim() === expected.endpoint || targetEndpoint?.trim().startsWith(expected.endpoint);

    let hasRequiredHeaders = true;
    if (expected.requiredHeaders) {
      hasRequiredHeaders = expected.requiredHeaders.every(
        (h) => headers[h] || headers[h.toLowerCase()] || headers[h.toUpperCase()]
      );
    }

    let hasRequiredBody = true;
    if (expected.requiredBodyFields && expected.requiredBodyFields.length > 0) {
      hasRequiredBody =
        !!body &&
        typeof body === "object" &&
        expected.requiredBodyFields.every((f) => (body as any)[f] !== undefined);
    }

    const isSuccess = isMethodMatch && isEndpointMatch && hasRequiredHeaders && hasRequiredBody;
    const statusCode = isSuccess ? expected.expectedStatusCode : 400;

    const simulatedResponse = {
      status: statusCode,
      statusCode,
      statusMessage: statusCode === 200 ? "OK" : statusCode === 201 ? "Created" : "Bad Request",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "x-ratelimit-limit": "100",
        "x-ratelimit-remaining": "99",
      },
      data: isSuccess
        ? { success: true, message: "Resource processed cleanly", payload: body || { status: "valid" } }
        : { success: false, error: "Request validation criteria not met" },
    };

    return res.status(200).json({
      success: true,
      data: {
        response: simulatedResponse,
        simulatedResponse,
        validation: { isMethodMatch, isEndpointMatch, hasRequiredHeaders, hasRequiredBody, isPassed: isSuccess },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to run API lab" });
  }
}

export async function submitApiLab(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const slug = req.params.slug as string;
    const lab = API_LABS.find((l) => l.slug === slug);
    if (!lab) {
      return res.status(404).json({ success: false, error: "API Lab not found" });
    }

    const { method, endpoint, headers = {}, body, requestsExecuted } = req.body;
    let isSuccess = false;

    if (Array.isArray(requestsExecuted) && requestsExecuted.length > 0) {
      isSuccess = requestsExecuted.every((r: any) => r.passed !== false);
    } else {
      const expected = lab.expectedValidation;
      isSuccess =
        method?.toUpperCase() === expected.method &&
        endpoint?.trim() === expected.endpoint &&
        (!expected.requiredHeaders || expected.requiredHeaders.every((h: string) => headers[h] || headers[h.toLowerCase()])) &&
        (!expected.requiredBodyFields || (body && expected.requiredBodyFields.every((f: string) => body[f] !== undefined)));
    }

    if (!isSuccess) {
      return res.status(200).json({
        success: true,
        data: { passed: false, message: "Validation requirements not satisfied yet." },
      });
    }

    // Award idempotent XP
    const xpRes = await XPService.awardXP({
      userId,
      sourceType: "coding_challenge",
      sourceId: `apilab_${slug}`,
      xpAmount: lab.xpReward,
      metadata: { labSlug: slug },
    });

    await StreakService.recordActivity({
      userId,
      activityType: "challenge_completion",
      activityId: `apilab_${slug}`,
    });

    await MilestoneService.evaluateMilestones(userId);

    return res.status(200).json({
      success: true,
      data: {
        passed: true,
        xpAwarded: xpRes.xpEarned,
        xpEarned: xpRes.xpEarned,
        alreadyCompleted: xpRes.alreadyAwarded,
        totalXP: xpRes.totalXP,
        userLevelInfo: xpRes.userLevelInfo,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to submit API lab" });
  }
}
