import express from "express";
import { deleteMyPlan, getAllPurchasePlan, purchasePlan } from "../../controllers/purchasePlan/purchasePlan.js";
import { userVerify } from "../../middleware/userVerify.js";

const router = express.Router();

//  root  => /api/purchase

router.post("/create", userVerify, purchasePlan)
router.get("/all", getAllPurchasePlan)
router.delete("/delete/:planId", userVerify, deleteMyPlan)


export default router 