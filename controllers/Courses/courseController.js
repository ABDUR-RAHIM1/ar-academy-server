import { roles } from "../../config/constans.js";
import { serverError } from "../../helpers/serverError.js"
import AccountModel from "../../models/accounts/account.model.js";
import AdminAccountModel from "../../models/accounts/adminAccountModel.js";
import CourseModel from "../../models/courses/courseModel.js";

export const createCourse = async (req, res) => {
    try {

        const creator = req?.admin || req?.subAdmin

        const { name, title, shortDesc, description, links, regularPrice, offerPrice, photo, duration, startDate } = req.body;


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
            startDate,
            courseType: creator.role, // superAdmin or subAdmin role 
            createdBy: creator.id, // superAdmin or subAdmin _id 
        });

        await nweCourse.save();

        res.status(200).json({
            message: "নতুন কোর্স যুক্ত হয়েছে"
        })

    } catch (error) {
        console.log(error)
        serverError(res, error)
    }
};


// 
/**===================  get All CourseList without access his child  Below ================= */
export const getAllCoursesList = async (req, res) => {
    try {

        const courseList = await CourseModel.find({ courseType: "superAdmin" })
            .select("-description")
        res.status(200).json(courseList)

    } catch (error) {
        serverError(res, error)
    }
};
/**===================  get All CourseList without access his child  Above ================= */



/**=================== Get Singel Course  For Details  Below =========================== */
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
/**=================== Get Singel Course  For Details  Above =========================== */




/**=================== get My purcahse Courses (for Student) Below =================== */
export const getMyCourseStudent = async (req, res) => {
    try {
        const { id } = req.user;

        const student = await AccountModel.findById(id);



        if (!student) {
            return res.status(404).json({
                message: `${token.role || "user"} খুঁজে পাওয়া যায়নি  `
            });
        }

        // Step 2: Check if user has any courses
        if (!student.courses || student.courses.length === 0) {
            return res.status(404).json({
                message: "No courses found for this user.",
                courses: []
            });
        }

        // Step 3: Find all courses whose _id is in user's course array
        const hasCourse = await CourseModel.find({
            _id: { $in: student.courses }
        })

        // Step 4: Return the courses
        return res.status(200).json(hasCourse);

    } catch (error) {
        console.log(error)
        serverError(res, error);
    }
};
/**=================== get My purcahse Courses (for Student) Above =================== */




/**=================== 
 * get My Created Courses (for SubAdmin) Below
 * logged in sub Admin Courses Only
 *  =================== */
export const getMyCourseSubAdmin = async (req, res) => {
    try {
        const { id } = req.subAdmin;

        const subAdmin = await AdminAccountModel.findById(id);

        if (!subAdmin) {
            return res.status(404).json({
                message: `${token.role || "Sub Admin"} খুঁজে পাওয়া যায়নি  `
            });
        }


        const courses = await CourseModel.find({
            courseType: "subAdmin",
            createdBy: id
        });

        if (!courses) {
            return res.status(404).json({
                message: 'Course Not found!'
            });
        };

        res.status(200).json(courses)


    } catch (error) {
        console.log(error)
        serverError(res, error);
    }
};
/**=================== get My purcahse Courses (for Student) Above =================== */




/**=================== Update Course Below ============================================= */
export const updateCourse = async (req, res) => {
    try {

        const { courseId } = req.params;

        const isUpdated = await CourseModel.findByIdAndUpdate(courseId, {
            $set: req.body
        }, { new: true });


        if (!isUpdated) {
            return res.status.json(404)({
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
/**=================== Update Course Above ============================================= */





/**=================== Delete Course Below ============================================= */
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
/**=================== Update Course Above ============================================= */ 