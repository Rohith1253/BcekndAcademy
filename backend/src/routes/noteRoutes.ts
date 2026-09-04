import { Router } from "express";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/noteController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.get("/", authenticateUser, getNotes);
router.post("/", authenticateUser, createNote);
router.put("/:id", authenticateUser, updateNote);
router.delete("/:id", authenticateUser, deleteNote);

export default router;
