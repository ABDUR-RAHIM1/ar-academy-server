import express from "express";
import { deleteQuestionById, getAllQuestions, getQuestionByCourseName, getQuestionById, postQuestions, updateQuestionById } from "../../controllers/questions/questions.controller.js";
import { optionalAuth } from "../../middleware/optionalAuth.js";

const router = express.Router();

// Root =>  /api/questions
router.post("/create", postQuestions);   // Admin question add
router.get("/all", optionalAuth, getAllQuestions);  // Admin + User fetch all

router.get("/one/:courseId", optionalAuth, getQuestionById);  // Get question by ID
router.get("/relatedByCourseName/:subjectName", getQuestionByCourseName);  // Get question by ID

router.put("/update/:questionId", updateQuestionById);      // ✅ Update
router.delete("/delete/:questionId", deleteQuestionById);  // Delete question by ID


export default router;
