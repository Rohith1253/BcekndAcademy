import { Router } from "express";
import { executeCodeController } from "../controllers/codeController";

const router = Router();

// POST /api/code/execute
router.post("/execute", executeCodeController);

export default router;
