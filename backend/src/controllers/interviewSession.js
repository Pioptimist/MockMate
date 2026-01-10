import InterviewSession from "../models/interviewS.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { getIO } from "../lib/socket.js";

/**
 * CREATE INTERVIEW SESSION
 * Logged-in user becomes host
 */
export const createInterviewSession = async (req, res) => {
  try {
    const hostUserId = req.user.id;

    // generate short unique invite code
    const inviteCode = crypto.randomBytes(4).toString("hex");

    const session = await InterviewSession.create({
      hostUserId,
      inviteCode,
      status: "waiting",
    });

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        inviteCode: session.inviteCode,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create interview session",
    });
  }
};

/**
 * JOIN INTERVIEW SESSION
 * Guest joins using invite code
 */
export const joinInterviewSession = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const guestUserId = req.user.id;

    const session = await InterviewSession.findOne({ inviteCode });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite code",
      });
    }

    if (session.status !== "waiting") {
      return res.status(400).json({
        success: false,
        message: "Session already started or ended",
      });
    }

    // prevent host from joining as guest
    if (session.hostUserId.toString() === guestUserId) {
      return res.status(400).json({
        success: false,
        message: "Host cannot join as guest",
      });
    }

    session.guestUserId = guestUserId;
    session.status = "live";
    session.startedAt = new Date();

    await session.save();

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        status: session.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to join interview session",
    });
  }
};

/**
 * END INTERVIEW SESSION
 * Host or guest can end
 */
export const endInterviewSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID",
      });
    }

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // only participants can end session
    if (
      session.hostUserId.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Only host can end interview",
      });
    }

    session.status = "ended";
    session.endedAt = new Date();

    await session.save();
    const io = getIO();
    io.to(session._id.toString()).emit("session-ended", {
      sessionId: session._id,
      reason: "Host ended the interview",
    });

    return res.status(200).json({
      success: true,
      message: "Interview session ended",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to end interview session",
    });
  }
};
