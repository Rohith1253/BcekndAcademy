import { Router } from "express";
import { getGames, getGameByIdController, submitGameAttempt } from "../controllers/gameController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.get("/", getGames);
router.get("/:gameId", getGameByIdController);
router.post("/:gameId/submit", authenticateUser, submitGameAttempt);

export default router;
