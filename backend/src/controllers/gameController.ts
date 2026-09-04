import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { GAME_DEFINITIONS, getGameById, getGameScenarios } from "../games/registry";
import { evaluateGameSubmission } from "../games/game-engine";

export async function getGames(req: Request, res: Response) {
  try {
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;

    let games = GAME_DEFINITIONS.map((g) => ({
      ...g,
      scenarios: getGameScenarios(g.id),
    }));
    if (category && category !== "All") games = games.filter((g: any) => g.category === category);
    if (difficulty && difficulty !== "All") games = games.filter((g: any) => g.difficulty === difficulty.toLowerCase());

    return res.status(200).json({ success: true, data: { games, total: games.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch games catalog" });
  }
}

export async function getGameByIdController(req: Request, res: Response) {
  try {
    const gameId = Array.isArray(req.params.gameId) ? req.params.gameId[0] : req.params.gameId;
    const game = getGameById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, error: "Game not found" });
    }
    const scenarios = getGameScenarios(game.id);
    return res.status(200).json({ success: true, data: { game: { ...game, scenarios } } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch game" });
  }
}

export async function submitGameAttempt(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const gameId = Array.isArray(req.params.gameId) ? req.params.gameId[0] : req.params.gameId;
    const payload = req.body;

    const evaluation = await evaluateGameSubmission(req.user.userId, gameId, payload);
    return res.status(200).json({
      success: true,
      data: {
        result: evaluation,
        ...evaluation,
      },
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || "Failed to submit game attempt" });
  }
}
