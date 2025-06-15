import express from "express";
import { assignPlanByAdmin, deleteMyPlan, getAllPurchasePlan, purchasePlan } from "../../controllers/purchasePlan/purchasePlan.js";
import { userVerify } from "../../middleware/userVerify.js";
import { adminVerify } from "../../middleware/adminVerify.js";

const router = express.Router();

//  root  => /api/purchase

router.post("/create", userVerify, purchasePlan)
router.post("/createByAdmin", adminVerify, assignPlanByAdmin) // manualy assign by admin in dashboard

router.get("/all", adminVerify, getAllPurchasePlan)
router.delete("/delete/:planId", userVerify, deleteMyPlan)


export default router 