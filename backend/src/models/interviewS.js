import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    hostUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    guestUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["waiting", "live", "ended"],
      default: "waiting",
    },

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Fast invite lookup
// interviewSessionSchema.index({ inviteCode: 1 });

export default mongoose.model("InterviewSession", interviewSessionSchema);
