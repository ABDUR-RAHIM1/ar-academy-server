
import express from "express";
import { createCourse, deleteCourse, getAllCoursesList, getSignlecourse, updateCourse } from "../../controllers/Courses/courseController.js";
import { adminVerify } from "../../middleware/adminVerify.js";

const router = express.Router();

//  api route => /api/course/

router.post("/create", adminVerify, createCourse);
router.get("/all", getAllCoursesList);
router.get("/single", getSignlecourse);
router.put("/update/:courseId", adminVerify, updateCourse);
router.delete("/delete/:courseId", adminVerify, deleteCourse);


export default router