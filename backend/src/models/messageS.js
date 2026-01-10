import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Chat performance index
messageSchema.index({ sessionId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);

//ref means woh wali field konse schema se aayegi