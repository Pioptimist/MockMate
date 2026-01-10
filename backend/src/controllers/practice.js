import CodingQuestion from "../models/codingQ.js";
import Submission from "../models/submissionS.js";


export const getAllQuestions = async (req, res) => {
  try {
    const questions = await CodingQuestion.find()
      .select("title difficulty supportedLanguages createdAt");

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
};



export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await CodingQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Remove hidden test cases before sending
    const visibleTestCases = question.testCases.filter(
      (tc) => tc.isHidden === false
    );

    return res.status(200).json({
      success: true,
      data: {
        _id: question._id,
        title: question.title,
        description: question.description,
        difficulty: question.difficulty,
        supportedLanguages: question.supportedLanguages,
        testCases: visibleTestCases,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch question",
    });
  }
};



export const submitSolution = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { questionId, language, code } = req.body;

    // Validate question exists
    const question = await CodingQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // --- STUB EXECUTION LOGIC ---
    const totalTestCases = question.testCases.length;
    const passedTestCases = Math.floor(Math.random() * totalTestCases);

    const status =
      passedTestCases === totalTestCases ? "accepted" : "wrong_answer";

    // Save submission
    const submission = await Submission.create({
      userId,
      questionId,
      language,
      code,
      passedTestCases,
      totalTestCases,
      status,
    });

    return res.status(201).json({
      success: true,
      data: {
        submissionId: submission._id,
        passedTestCases,
        totalTestCases,
        status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Submission failed",
    });
  }
};
