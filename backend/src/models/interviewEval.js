import mongoose from "mongoose";

const interviewEvaluationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
      unique: true,
    },

    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    communicationScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },

    problemSolvingScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },

    confidenceScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },

    comments: {
      type: String,
      trim: true,
    },

    finalScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("InterviewEvaluation", interviewEvaluationSchema);
