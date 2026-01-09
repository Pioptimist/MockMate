export const verifyOtp = async (req, res, next) => {
  try {
    const user = req.user; // from JWT middleware
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // OTP is valid → clear it (single-use)
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    next();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
