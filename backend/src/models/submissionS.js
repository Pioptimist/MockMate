import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingQuestion",
      required: true,
    },

    language: {
      type: String,
      enum: ["cpp", "java", "python"],
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    passedTestCases: {
      type: Number,
      required: true,
      default: 0,
    },

    totalTestCases: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["accepted", "wrong_answer", "runtime_error", "time_limit_exceeded"],
      required: true,
    },
  },
  { timestamps: true }
);

// Performance index
submissionSchema.index({ userId: 1, questionId: 1 });

export default mongoose.model("Submission", submissionSchema);
