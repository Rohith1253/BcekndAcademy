import { Router } from "express";
import {
  getLanguages,
  getLanguageBySlug,
  getLanguageComparison,
} from "../controllers/languageController";

const router = Router();

router.get("/compare", getLanguageComparison);
router.get("/", getLanguages);
router.get("/:slug", getLanguageBySlug);

export default router;
