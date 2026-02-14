import express from "express";
import { userVerify } from "../../middleware/userVerify.js";
import { adminVerify } from "../../middleware/adminVerify.js";
import { assignCourseByAdmin, createPurchaseCourse, deleteMyCourse, getAllPurchaseCourse, getMyCourse, updatePurchaseStatus } from "../../controllers/purchaseCourse/purchaseCourse.js";

const router = express.Router();

//  root  => /api/purchase
router.post("/create", userVerify, createPurchaseCourse)

// manual assign a course from admin to student
router.post("/assign", adminVerify, assignCourseByAdmin)

// payment status update and assing course or remove course from user/ student account
router.put("/updateStatus", adminVerify, updatePurchaseStatus)
router.post("/createByAdmin", adminVerify, assignCourseByAdmin) // manualy assign by admin in dashboard

router.get("/me", userVerify, getMyCourse) // ata maybe use hocce na
router.get("/all", adminVerify, getAllPurchaseCourse)
router.delete("/delete/:planId", userVerify, deleteMyCourse)


export default router 