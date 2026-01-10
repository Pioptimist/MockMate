import mongoose from "mongoose";

const codingQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    supportedLanguages: {
      type: [String],
      enum: ["cpp", "java", "python"],
      required: true,
    },

    testCases: [
      {
        input: {
          type: String,
          required: true,
        },
        expectedOutput: {
          type: String,
          required: true,
        },
        isHidden: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("CodingQuestion", codingQuestionSchema);
