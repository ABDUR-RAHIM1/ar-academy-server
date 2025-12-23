import express from "express";
import { userVerify } from "../../middleware/userVerify.js";
import { adminVerify } from "../../middleware/adminVerify.js";
import { assignCourseByAdmin, createPurchaseCourse, deleteMyCourse, getAllPurchaseCourse, getMyCourse } from "../../controllers/purchaseCourse/purchaseCourse.js";

const router = express.Router();

//  root  => /api/purchase
router.post("/create", userVerify, createPurchaseCourse) 

router.post("/createByAdmin", adminVerify, assignCourseByAdmin) // manualy assign by admin in dashboard

router.get("/me", userVerify, getMyCourse)
router.get("/all", adminVerify, getAllPurchaseCourse)
router.delete("/delete/:planId", userVerify, deleteMyCourse)


export default router 