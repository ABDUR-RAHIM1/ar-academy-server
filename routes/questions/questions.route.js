import express from "express";
import { deleteQuestionById, getAllQuestions, getQuestionByChapterId, getQuestionById, getQuestionByIsAllTitle, postQuestions, updateQuestionById } from "../../controllers/questions/questions.controller.js";
import { optionalAuth } from "../../middleware/optionalAuth.js";

const router = express.Router();

// Root =>  /api/questions
router.post("/create", postQuestions);   // Admin question add
router.get("/all", optionalAuth, getAllQuestions);  // Admin + User fetch all
router.get("/one/:questionId", optionalAuth, getQuestionById);  // Get question by ID
router.get("/relatedByTitle/:isAllTitle", getQuestionByIsAllTitle);  // Get question by ID

router.get("/byChapter/:chapterId", getQuestionByChapterId);  // Get question by ID
router.put("/update/:questionId", updateQuestionById);      // ✅ Update
router.delete("/delete/:questionId", deleteQuestionById);  // Delete question by ID


export default router;
