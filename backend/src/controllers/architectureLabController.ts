import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { ARCHITECTURE_LABS } from "../data/architecture-labs-data";
import { XPService } from "../services/xpService";
import { StreakService } from "../services/streakService";
import { MilestoneService } from "../services/milestoneService";

export async function getArchitectureLabs(req: Request, res: Response) {
  try {
    const labs = ARCHITECTURE_LABS.map((l) => ({
      slug: l.slug,
      title: l.title,
      category: l.category,
      difficulty: l.difficulty,
      description: l.description,
      objective: l.objective,
      stages: l.stages,
      xpReward: l.xpReward,
      estimatedMinutes: l.estimatedMinutes,
    }));
    return res.status(200).json({ success: true, data: { labs, total: labs.length } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to fetch architecture labs" });
  }
}

export async function getArchitectureLabBySlug(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const lab = ARCHITECTURE_LABS.find((l) => l.slug === slug);
    if (!lab) {
      return res.status(404).json({ success: false, error: "Architecture Lab not found" });
    }
    return res.status(200).json({ success: true, data: { lab, ...lab } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to fetch architecture lab" });
  }
}

export async function runArchitectureLab(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const { config, scenarioId, parameters } = req.body;
    const lab = ARCHITECTURE_LABS.find((l) => l.slug === slug);

    if (!lab) {
      return res.status(404).json({ success: false, error: "Architecture Lab not found" });
    }

    const optimal = lab.optimalConfig;
    let isOptimal = true;
    const feedback: string[] = [];

    if (optimal.pipelineOrder && Array.isArray(config?.pipelineOrder)) {
      const match = JSON.stringify(config.pipelineOrder) === JSON.stringify(optimal.pipelineOrder);
      if (!match) {
        isOptimal = false;
        feedback.push("Middleware pipeline sequence is suboptimal. Position fast guards (CORS, RateLimiter) before BodyParser and Auth.");
      } else {
        feedback.push("Optimal middleware pipeline configuration achieved.");
      }
    }

    const steps = [
      { step: 1, from: "Client", to: "Reverse Proxy / Cloudflare", action: "TLS Handshake & Geo DNS", status: "completed", details: "Encrypted connection established (HTTP/2)", latencyMs: 8 },
      { step: 2, from: "Reverse Proxy", to: "Express Server", action: "CORS & Rate Limiter Guard", status: "completed", details: "Verified Origin header; Rate limit 1/100 tokens consumed", latencyMs: 2 },
      { step: 3, from: "Express", to: "JWT Auth Guard", action: "Token Signature Cryptographic Verify", status: "completed", details: "HS256 HMAC signature valid; req.user attached", latencyMs: 4 },
      { step: 4, from: "JWT Guard", to: "Cache Layer (Redis)", action: "Cache-Aside Key Lookup", status: "completed", details: "GET cache:items:idx -> Cache Hit", latencyMs: 1 },
      { step: 5, from: "Redis", to: "Response Dispatch", action: "JSON Serialization & Compression", status: "completed", details: "HTTP 200 OK sent to client", latencyMs: 3 }
    ];

    const simulation = {
      steps,
      totalLatencyMs: steps.reduce((sum, s) => sum + s.latencyMs, 0),
      metrics: {
        status: 200,
        cacheState: "HIT",
        circuitState: "CLOSED",
        authenticated: true,
      }
    };

    return res.status(200).json({
      success: true,
      data: {
        isOptimal,
        feedback,
        simulation,
        simulationResult: {
          throughputRps: isOptimal ? 24500 : 3200,
          latencyMs: isOptimal ? 1.2 : 84.5,
          resilienceScore: isOptimal ? 100 : 40,
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to run architecture lab" });
  }
}

export async function submitArchitectureLab(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const slug = req.params.slug as string;
    const lab = ARCHITECTURE_LABS.find((l) => l.slug === slug);
    if (!lab) {
      return res.status(404).json({ success: false, error: "Architecture Lab not found" });
    }

    const xpRes = await XPService.awardXP({
      userId,
      sourceType: "coding_challenge",
      sourceId: `archlab_${slug}`,
      xpAmount: lab.xpReward,
      metadata: { labSlug: slug },
    });

    await StreakService.recordActivity({
      userId,
      activityType: "challenge_completion",
      activityId: `archlab_${slug}`,
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
    return res.status(500).json({ success: false, error: err.message || "Failed to submit architecture lab" });
  }
}
