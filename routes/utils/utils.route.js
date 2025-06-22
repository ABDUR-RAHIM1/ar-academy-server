
import express from "express";
import { getCourseSummary, getUserSummary } from "../../utils/getSummary.js";
import { getBestPerformers } from "../../utils/topPerformer.js";
import { getMergedQuestions } from "../../utils/margeQuestions/margeQuestions.js";


const router = express.Router();

// root => /api/utils
router.get("/getSummary", getCourseSummary);
router.get("/getUserSummary", getUserSummary);

//  get best performer 
router.get("/best-performer", getBestPerformers)


//  get marge questions (all)
router.get("/get-margeQuestions", getMergedQuestions)


export default router;