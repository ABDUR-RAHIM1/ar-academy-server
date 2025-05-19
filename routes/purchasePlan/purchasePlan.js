import express from "express";
import { getAllPurchasePlan, purchasePlan } from "../../controllers/purchasePlan/purchasePlan.js";
import { userVerify } from "../../middleware/userVerify.js";

const router = express.Router();

//  root  => /api/purchase

router.post("/create", userVerify, purchasePlan)
router.get("/all", getAllPurchasePlan)


export default router 