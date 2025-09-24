import { serverError } from "../../helpers/serverError.js"
import CourseModel from "../../models/courses/courseModel.js";

export const createCourse = async (req, res) => {
    try {

        const { name, title, shortDesc, description, links, regularPrice, offerPrice, photo, duration } = req.body;


        const nweCourse = await CourseModel({
            name,
            title,
            shortDesc,
            description,
            links, // ekhane je je categpoires gulote navigae korbe tar link
            regularPrice,
            offerPrice,
            photo,
            duration
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
export const getSignlecourse = async (req, res) => {
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

//  get My Courses (ata pore add korte hobe)


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