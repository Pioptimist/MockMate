import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                  // max 5 requests per IP
  message: {
    message: "Too many login attempts. Try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});


export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,                  // max 3 OTP requests
  message: {
    message: "Too many OTP requests. Please wait before trying again."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
