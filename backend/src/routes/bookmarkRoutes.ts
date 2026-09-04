import { Router } from "express";
import { getBookmarks, addBookmark, removeBookmark } from "../controllers/bookmarkController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.get("/", authenticateUser, getBookmarks);
router.post("/", authenticateUser, addBookmark);
router.delete("/:lessonId", authenticateUser, removeBookmark);

export default router;
