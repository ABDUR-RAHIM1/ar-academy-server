
import { serverError } from "../../helpers/serverError.js";
import AccountModel from "../../models/accounts/account.model.js";
import CourseModel from "../../models/courses/courseModel.js";
import PurchaseCourseModel from "../../models/purchaseCourse/purchaseCourse.js";


export const createPurchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { id } = req.user;

        if (!courseId) {
            return res.status(400).json({ message: "Invalid course data" });
        }

        // কোর্স খুঁজে বের করো
        const course = await CourseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // ধরুন course.duration মাস হিসেবে আছে
        const durationMonths = Number(course.duration) || 1; // default 1 month if not found

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + durationMonths);

        // ডেমো payment details
        const demoDetails = {
            transactionId: "DXN0193121",
            paymentMethod: "BKASH",
            paymentStatus: "SUCCESS",
        };

        // নতুন subscription তৈরি
        const newSubscription = new PurchaseCourseModel({
            user: id,
            course: courseId,
            startDate,
            endDate,
            paymentDetails: demoDetails, // পরে গেটওয়ে থেকে আসবে
        });

        const subscription = await newSubscription.save();

        // user এর অ্যাকাউন্টে সাবস্ক্রিপশন রেফারেন্স আপডেট
        await AccountModel.findByIdAndUpdate(id, {
            $addToSet: { courses: courseId },
            $set: { userTypePremium: true },

        });

        return res.status(201).json({
            message: "Course purchased successfully",
            subscription,
        });
    } catch (error) {
        console.error("Purchase Course Error:", error);
        return serverError(res, error);
    }
};


//  admin can assign a plan for the user
export const assignCourseByAdmin = async (req, res) => {
    try {
        const { userId, plan } = req.body;

        // Validation
        if (!userId || !plan || !plan.key || !plan.days) {
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


