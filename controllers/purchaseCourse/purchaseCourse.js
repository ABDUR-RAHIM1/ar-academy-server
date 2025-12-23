
import { serverError } from "../../helpers/serverError.js";
import AccountModel from "../../models/accounts/account.model.js"; 
import CourseModel from "../../models/courses/courseModel.js";
import PurchaseCourseModel from "../../models/purchaseCourse/purchaseCourse.js";


export const createPurchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const token = req.user;

        if (!token) {
            return res.status(400).json({ message: "Unauthorized" });
        }

        if (!courseId) {
            return res.status(400).json({ message: "Invalid course data" });
        }

        // 1️⃣ কোর্সের তথ্য নাও
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 2️⃣
        const student = await AccountModel.findById(token.id);


        if (!student) {
            return res.status(404).json({ message: `${token.role || "User"} পাওয়া যায়নি!` });
        }

        // 4️⃣ আগে থেকে কেনা আছে কিনা চেক করো
        const alreadyPurchased = student.courses.some(
            (c) => c.toString() === courseId
        );
        if (alreadyPurchased) {
            return res.status(400).json({ message: "আপনি ইতিমধ্যে এই কোর্সটি কিনেছেন" });
        }

        // 5️⃣ ডেমো পেমেন্ট ডেটা
        const demoDetails = {
            transactionId: "DXN0193121",
            paymentMethod: "BKASH",
            paymentStatus: "SUCCESS",
        };

        // 6️⃣ সাবস্ক্রিপশন তৈরি
        const newSubscription = new PurchaseCourseModel({
            subAdminOrStudent: token.id,
            role: token.role,
            course: courseId,
            paymentDetails: demoDetails,
        });

        const subscription = await newSubscription.save();

        // 7️⃣ ইউজার একাউন্টে আপডেট
            await AccountModel.findByIdAndUpdate(token.id, {
                $addToSet: { courses: courseId },
                $set: { userTypePremium: true },
            });

        return res.status(201).json({
            message: "সফলভাবে কোর্স ক্রয় সম্পন্ন হয়েছে ✅"
        });

    } catch (error) {
        console.error("Purchase Course Error:", error);
        return serverError(res, error);
    }
};



//  admin can assign a plan for the user
export const assignCourseByAdmin = async (req, res) => {
    try {
        const { userId, course } = req.body;

        // Validation
        if (!userId || !course || !plan.key || !plan.days) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        // Check existing active plan
        const isExitPurchase = await PurchaseCourseModel.findOne({
            user: userId,
            status: 'active'
        });

        if (isExitPurchase) {
            return res.status(400).json({
                message: "User already has an active plan"
            });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + plan.days);

        const newSubscription = new PurchaseCourseModel({
            user: userId,
            planName: plan.key,
            planLabel: plan.label,
            price: plan.price || 0,
            endDate,
            paymentDetails: {
                transactionId: "ADMIN-MANUAL",
                paymentMethod: "ADMIN",
                paymentStatus: "SUCCESS"
            }
        });

        const subscription = await newSubscription.save();

        await AccountModel.findByIdAndUpdate(userId, {
            $set: {
                plan: subscription._id
            }
        });

        return res.status(201).json({
            message: "Plan assigned to user successfully by admin."
        });

    } catch (error) {
        console.error("Assign Plan by Admin Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


// get user specefic Course by token _id
export const getMyCourse = async (req, res) => {
    const { id } = req.user;
    try {

        const hasCourse = await PurchaseCourseModel.find({ user: id })
            .populate("course")

        if (!hasCourse) {
            return res.status(404).json({
                message: "কোন কোর্স নেই!"
            })
        };

        res.status(200).json(hasCourse)

    } catch (error) {
        serverError(res, error)
    }
}

// for admin (dashboard)
export const getAllPurchaseCourse = async (req, res) => {
    try {

        const purchaseAll = await PurchaseCourseModel.find()
            .populate("user", "username email _id")

        res.status(200).json(purchaseAll)

    } catch (error) {
        return serverError(res, error)
    }
};


// ✅ Remove plan from user's account without deleting the plan document
export const deleteMyCourse = async (req, res) => {
    const { planId } = req.params;
    try {
        // Step 1: Just unset the user's current plan reference
        await AccountModel.findByIdAndUpdate(
            req.user.id,
            { $unset: { plan: null } }, // or "" if your default is empty string
            { new: true }
        );


        // Step 2: সাবস্ক্রিপশনটির status 'cancelled' করো

        const updated = await PurchaseCourseModel.findByIdAndUpdate(
            planId,
            { $set: { status: "cancelled" } }
        );

        if (!updated) {
            return res.status(404).json({ message: "Plan not found." });
        }


        return res.status(200).json({
            message: "আপনার প্ল্যান অপসারণ করা হয়েছে",
        });
    } catch (error) {
        console.log("Plan remove error:", error);
        return serverError(res, error);
    }
};


