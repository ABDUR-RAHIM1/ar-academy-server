// routes/resultsRoute.js
import express from "express";
import { getMyResults, getResultById, getResults, getResultsBySubAdmin, submitQuestions } from "../../controllers/results/results.controller.js";
import { userVerify } from "../../middleware/userVerify.js";
import { adminVerify } from "../../middleware/adminVerify.js";
import { subAdminVerify } from "../../middleware/subAdminVerify.js";

const router = express.Router();

// /api/results
router.post("/submit-questions", userVerify, submitQuestions);
router.get("/all", adminVerify, getResults); // all results
router.get("/subAdmin", subAdminVerify, getResultsBySubAdmin); // all results
router.get("/my", userVerify, getMyResults);  // speepic result for user
router.get("/details/:resultId", getResultById); // GET /api/results/:resultId
export default router;
