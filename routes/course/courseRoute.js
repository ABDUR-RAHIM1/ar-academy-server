
import express from "express";
import { createCourse, deleteCourse, getAllCoursesList, getMyCourseStudent, getSinglecourse, updateCourse } from "../../controllers/Courses/courseController.js";
import { adminVerify } from "../../middleware/adminVerify.js";
import { userVerify } from "../../middleware/userVerify.js";
import { optionalAuth } from "../../middleware/optionalAuth.js";

const router = express.Router();

//  api route => /api/course/

router.post("/create", adminVerify, createCourse);
router.get("/all", getAllCoursesList);
router.get("/single/:courseId", getSinglecourse);
router.get("/myCourseBySingleUser", optionalAuth, getMyCourseStudent);
router.put("/update/:courseId", adminVerify, updateCourse);
router.delete("/delete/:courseId", adminVerify, deleteCourse);


export default router