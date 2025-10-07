import { roles } from "../../config/constans.js";
import { serverError } from "../../helpers/serverError.js"
import AccountModel from "../../models/accounts/account.model.js";
import AdminAccountModel from "../../models/accounts/adminAccountModel.js";
import CourseModel from "../../models/courses/courseModel.js";

export const createCourse = async (req, res) => {
    try {

        const { name, title, shortDesc, description, links, regularPrice, offerPrice, photo, duration, courseType } = req.body;


        const nweCourse = await CourseModel({
            name,
            title,
            shortDesc,
            description,
            links, // ekhane je je categpoires gulote navigae korbe tar link
            regularPrice,
            offerPrice,
            photo,
            duration,
            courseType
        });

        await nweCourse.save();

        res.status(200).json({
            message: "সফল ভাবে নতুন কোর্স যুক্ত হয়েছে"
        })

    } catch (error) {
        console.log(error)
        serverError(res, error)
    }
};


//  get All CourseList without access his child
export const getAllCoursesList = async (req, res) => {
    try {

        const courseList = await CourseModel.find()
            .select("-description")
        res.status(200).json(courseList)

    } catch (error) {
        serverError(res, error)
    }
};


//  get single Course For Details 
export const getSinglecourse = async (req, res) => {
    try {

        const { courseId } = req.params;

        const singleCourse = await CourseModel.findById(courseId);

        if (!singleCourse) {
            return res.status(404).json({
                message: "কোন কোর্স পাওয়া যায়নি"
            })
        }

        res.status(200).json(singleCourse)

    } catch (error) {
        serverError(res, error)
    }
};

// get My Courses
export const getMyCourseStudent = async (req, res) => {
    try {
        const token = req.user;
 
        let studentOrSubAdmin;

        if (token.role === roles.subAdmin) {
            // : Find the Sub Admin
            studentOrSubAdmin = await AdminAccountModel.findById(token.id);
        } else {
            // : Find the user
             studentOrSubAdmin = await AccountModel.findById(token.id);
        }


        if (!studentOrSubAdmin) {
            return res.status(404).json({
                message: `${token.role || "user"} খুঁজে পাওয়া যায়নি  `
            });
        }

        // Step 2: Check if user has any courses
        if (!studentOrSubAdmin.courses || studentOrSubAdmin.courses.length === 0) {
            return res.status(404).json({
                message: "No courses found for this user.",
                courses: []
            });
        }

        // Step 3: Find all courses whose _id is in user's course array
        const hasCourse = await CourseModel.find({
            _id: { $in: studentOrSubAdmin.courses }
        })

        // Step 4: Return the courses
        return res.status(200).json(hasCourse);

    } catch (error) {
        console.log(error)
        serverError(res, error);
    }
};



//  update Course
export const updateCourse = async (req, res) => {
    try {

        const { courseId } = req.params;

        const isUpdated = await CourseModel.findByIdAndUpdate(courseId, {
            $set: req.body
        }, { new: true });

        if (!isUpdated) {
            return res.status.json(404).json({
                message: "কোন কোর্স পাওয়া যায়নি"
            })
        };

        res.status(200).json({
            message: "সফলভাবে আপডেট হয়েছে"
        })

    } catch (error) {
        serverError(res, error)
    }
}



//  delete Course 
export const deleteCourse = async (req, res) => {
    try {

        const { courseId } = req.params;
        const isDeleted = await CourseModel.findByIdAndDelete(courseId);

        if (!isDeleted) {
            return res.status(404).json({
                message: "কোন কোর্স পাওয়া যায়নি"
            })
        };


        return res.status(200).json({
            message: "সফলভাবে ডিলিট হয়েছে"
        })

    } catch (error) {
        serverError(res, error)
    }
}