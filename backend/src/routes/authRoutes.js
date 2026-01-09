import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  requestOtp,
  updatePassword,
  updateEmail
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { loginLimiter, otpLimiter } from "../middleware/rateLimit.js";
import { verifyOtp } from "../middleware/verifyOtp.js";

const router = express.Router();

/* Public routes */
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);

/* Protected routes */
router.get("/profile", protect, getProfile);

router.post("/request-otp", protect, otpLimiter, requestOtp);

router.post("/update-password", protect, verifyOtp, updatePassword);

router.post("/update-email", protect, updateEmail);

export default router;
