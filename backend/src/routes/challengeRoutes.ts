import { Router } from "express";
import { authenticateUser } from "../middleware/auth";
import {
  getChallenges as getCodingChallenges,
  getChallengeBySlugController,
  runChallengeTests,
  submitChallengeSolution,
  getChallengeSubmissionsForSlug,
  getChallengeProgress,
} from "../controllers/codingChallengeController";
import {
  getChallengeSubmissions,
  submitChallenge as submitPlaygroundChallenge,
} from "../controllers/challengeController";

const router = Router();

// 1. Coding Practice Progress Stats
router.get("/progress", authenticateUser, getChallengeProgress);

// 2. Backward-compatible playground submission history
router.get("/submissions", authenticateUser, getChallengeSubmissions);

// 3. Backward-compatible playground code submission
router.post("/submit", authenticateUser, submitPlaygroundChallenge);

// 4. Catalog endpoint (supports category, difficulty, search)
// Uses authenticateUser optionally via passive check in middleware if token exists
router.get("/", (req, res, next) => {
  // Try authenticating passively so we know user's solved status
  if (req.cookies?.token || req.headers.authorization) {
    return authenticateUser(req as any, res, () => getCodingChallenges(req as any, res));
  }
  return getCodingChallenges(req as any, res);
});

// 5. User's submission history for a specific challenge
router.get("/:slug/submissions", authenticateUser, getChallengeSubmissionsForSlug);

// 6. Run Code (visible tests only)
router.post("/:slug/run", runChallengeTests);

// 7. Submit Solution (all tests + XP evaluation)
router.post("/:slug/submit", authenticateUser, submitChallengeSolution);

// 8. Challenge Detail by slug
router.get("/:slug", (req, res, next) => {
  if (req.cookies?.token || req.headers.authorization) {
    return authenticateUser(req as any, res, () => getChallengeBySlugController(req as any, res));
  }
  return getChallengeBySlugController(req as any, res);
});

export default router;
