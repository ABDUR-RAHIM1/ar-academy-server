
import express from "express";
import { getCourseSummary, getUserSummary } from "../../utils/getSummary.js";


const router = express.Router();

// root => /api/utils
router.get("/getSummary", getCourseSummary);
router.get("/getUserSummary", getUserSummary);



export default router;