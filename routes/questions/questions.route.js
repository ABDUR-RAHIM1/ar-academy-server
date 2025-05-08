import express from "express";
import { deleteQuestionById, getAllQuestions, getQuestionByChapterId, getQuestionById, postQuestions, updateQuestionById } from "../../controllers/questions/questions.controller.js";

const router = express.Router();

// Root =>  /api/questions
router.post("/create", postQuestions);   // Admin question add
router.get("/all", getAllQuestions);  // Admin + User fetch all
router.get("/one/:questionId", getQuestionById);  // Get question by ID
router.get("/byChapter/:chapterId", getQuestionByChapterId);  // Get question by ID
router.put("/update/:questionId", updateQuestionById);      // ✅ Update
router.delete("/delete/:questionId", deleteQuestionById);  // Delete question by ID


export default router;
