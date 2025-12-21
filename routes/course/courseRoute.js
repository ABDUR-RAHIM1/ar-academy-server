
import express from "express";
import { createCourse, deleteCourse, getAllCoursesList, getMyCourseStudent, getMyCourseSubAdmin, getSinglecourse, updateCourse } from "../../controllers/Courses/courseController.js";
import { adminVerify } from "../../middleware/adminVerify.js";
import { subAdminVerify } from "../../middleware/subAdminVerify.js";
import { userVerify } from "../../middleware/userVerify.js";
import { isSubAdminWithPackage } from "../../middleware/isSubAdminWithPackage.js";

const router = express.Router();

//  api route => /api/course/

router.post("/create", adminVerify, createCourse); // create Super Admin
router.post("/create/subAdmin", subAdminVerify, isSubAdminWithPackage, createCourse); // create Sub Admin
router.get("/all", getAllCoursesList);
router.get("/single/:courseId", getSinglecourse);

router.get("/myCourseBySingleUser", userVerify, getMyCourseStudent);
router.get("/myCourseBySingleSubAdmin", subAdminVerify, getMyCourseSubAdmin);

router.put("/update/:courseId", adminVerify, updateCourse);
router.delete("/delete/:courseId", adminVerify, deleteCourse);


export default router