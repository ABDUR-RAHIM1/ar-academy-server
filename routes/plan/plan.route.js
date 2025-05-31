// routes/planRoutes.js

import express from "express";
import {
    createPlan,
    getPlans,
    getPlanByKey,
    updatePlan,
    deletePlan
} from "../../controllers/plan/plan.controller.js";
import { adminVerify } from "../../middleware/adminVerify.js";

const router = express.Router();

// Root => /api/plan

router.post("/create", createPlan);
router.get("/getAll", getPlans); // public
router.get("/get/:key", getPlanByKey);
router.put("/update/:planId", adminVerify, updatePlan);
router.delete("/delete/:planId", adminVerify, deletePlan);

export default router;
