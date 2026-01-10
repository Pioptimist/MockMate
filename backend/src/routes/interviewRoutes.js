import express from "express";
import {
  createInterviewSession,
  joinInterviewSession,
  endInterviewSession,
} from "../controllers/interviewSession.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createInterviewSession);
router.get("/join/:inviteCode", protect, joinInterviewSession);
router.post("/end/:sessionId", protect, endInterviewSession);

export default router;
