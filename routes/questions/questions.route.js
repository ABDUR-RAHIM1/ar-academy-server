import express from "express";
import { deleteQuestionById, getAllQuestions, getQuestionByCourseName, getQuestionById, getSingleQuestionByAdmin, getSubAdminQuestions, postQuestions, updateQuestionById } from "../../controllers/questions/questions.controller.js";
import { optionalAuth } from "../../middleware/optionalAuth.js";
import { adminVerify } from "../../middleware/adminVerify.js";
import { userVerify } from "../../middleware/userVerify.js";
import { subAdminVerify } from "../../middleware/subAdminVerify.js";

const router = express.Router();

// Root =>  /api/questions
router.post("/create", adminVerify, postQuestions);   // Admin question add 

// subAdmin question add 
router.post("/create/subAdmin", subAdminVerify, postQuestions);

// Admin + User fetch all
router.get("/all", optionalAuth, getAllQuestions);

//  only subAdmin get his questions
router.get("/getAllBySubAdmin", subAdminVerify, getSubAdminQuestions); 

// Get question by ID
router.get("/one/:questionId", userVerify, getQuestionById);

// Get question by ID only Admin 
router.get("/oneByAdmmin/:questionId", adminVerify, getSingleQuestionByAdmin);

// Get question by ID
router.get("/relatedByCourseName/:subjectName", getQuestionByCourseName);


// ✅ Update
router.put("/update/:questionId", updateQuestionById);

// Delete question by ID 
router.delete("/delete/:questionId", deleteQuestionById);


export default router;
