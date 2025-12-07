import express from "express";
import { getLeaderBoardByCourse } from "../../controllers/leaderboard/leaderBoard.controller.js";
 
const router = express.Router();

router.get("/byCourse/:courseId", getLeaderBoardByCourse)


export default router;