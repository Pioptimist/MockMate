import mongoose from "mongoose";
import { ENV } from "../lib/env.js";
import CodingQuestion from "../models/codingQ.js";



const seedQuestions = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);

    // await CodingQuestion.deleteMany(); // optional (clean start)

    await CodingQuestion.insertMany([
      {
        title: "Sum of Two Numbers",
        description: "Given two integers, return their sum.",
        difficulty: "easy",
        supportedLanguages: ["cpp", "java", "python"],
        testCases: [
          {
            input: "2 3",
            expectedOutput: "5",
            isHidden: false,
          },
          {
            input: "10 20",
            expectedOutput: "30",
            isHidden: true,
          },
        ],
      },
      {
        title: "Reverse a String",
        description: "Reverse the given string.",
        difficulty: "easy",
        supportedLanguages: ["cpp", "java", "python"],
        testCases: [
          {
            input: "hello",
            expectedOutput: "olleh",
            isHidden: false,
          },
          {
            input: "world",
            expectedOutput: "dlrow",
            isHidden: true,
          },
        ],
      },
    ]);

    console.log("Questions seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedQuestions();
