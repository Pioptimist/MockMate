import mongoose from "mongoose";
import Submission from "../models/submissionS.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    /**
     * PRACTICE STATS
     * - joins submissions with questions
     * - groups by difficulty
     */
    const practiceStats = await Submission.aggregate([
      {
        $match: { userId },
      },
      {
        $lookup: {
          from: "codingquestions",
          localField: "questionId",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $group: {
          _id: "$question.difficulty",
          totalAttempts: { $sum: 1 },
          accepted: {
            $sum: {
              $cond: [{ $eq: ["$status", "accepted"] }, 1, 0],
            },
          },
        },
      },
    ]);

    /**
     * Normalize response for frontend
     */
    const normalizedPracticeStats = {
      easy: { total: 0, accepted: 0 },
      medium: { total: 0, accepted: 0 },
      hard: { total: 0, accepted: 0 },
    };

    practiceStats.forEach((stat) => {
      normalizedPracticeStats[stat._id] = {
        total: stat.totalAttempts,
        accepted: stat.accepted,
      };
    });

    return res.status(200).json({
      success: true,
      practiceStats: normalizedPracticeStats,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};
