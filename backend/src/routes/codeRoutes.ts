import { Router } from "express";
import { executeCodeController } from "../controllers/codeController";

const router = Router();

// POST /api/code/execute and /api/code/run
router.post("/execute", executeCodeController);
router.post("/run", executeCodeController);

export default router;
