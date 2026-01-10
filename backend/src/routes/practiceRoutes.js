import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  submitSolution,
} from "../controllers/practice.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/questions", protect, getAllQuestions);
router.get("/questions/:id", protect, getQuestionById);
router.post("/submit", protect, submitSolution);

export default router;
