import express from "express";
import { deleteMyPlan, getAllPurchasePlan, purchasePlan } from "../../controllers/purchasePlan/purchasePlan.js";
import { userVerify } from "../../middleware/userVerify.js";
import { adminVerify } from "../../middleware/adminVerify.js";

const router = express.Router();

//  root  => /api/purchase

router.post("/create", userVerify, purchasePlan)
router.get("/all", adminVerify, getAllPurchasePlan)
router.delete("/delete/:planId", userVerify, deleteMyPlan)


export default router 