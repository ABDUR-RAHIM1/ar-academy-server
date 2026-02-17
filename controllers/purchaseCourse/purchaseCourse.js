
import { serverError } from "../../helpers/serverError.js";
import AccountModel from "../../models/accounts/account.model.js";
import CourseModel from "../../models/courses/courseModel.js";
import PurchaseCourseModel from "../../models/purchaseCourse/purchaseCourse.js";


export const createPurchaseCourse = async (req, res) => {
    try {

        const { courseId, senderNumber, transactionId, method: paymentMethod, paidAmount } = req.body;
        
        const { id, role } = req.user;

        // ১. বেসিক ভ্যালিডেশন
        if (!id) return res.status(401).json({ message: "Unauthorized" });
        if (!courseId) return res.status(400).json({ message: "কোর্স আইডি প্রয়োজন" });

        const course = await CourseModel.findById(courseId);
        const student = await AccountModel.findById(id);

        if (!course) return res.status(404).json({ message: "কোর্স পাওয়া যায়নি" });
        if (!student) return res.status(404).json({ message: "ইউজার পাওয়া যায়নি" });

        // ২. ডুপ্লিকেট চেক (অলরেডি কেনা বা পেন্ডিং আছে কিনা)
        const alreadyInPurchaseList = await PurchaseCourseModel.findOne({
            student: id,
            course: courseId
        });

        if (alreadyInPurchaseList) {
            if (alreadyInPurchaseList.status === 'active') {
                return res.status(400).json({ message: "আপনি ইতিমধ্যে এই কোর্সটি কিনেছেন" });
            }
            if (alreadyInPurchaseList.status === 'pending') {
                return res.status(400).json({ message: "আপনার একটি পেমেন্ট রিকোয়েস্ট ইতিমধ্যে পেন্ডিং আছে" });
            }
        }

        // ৩. কোর্স টাইপ নির্ধারণ (Free vs Paid)
        const isFree = Number(course.offerPrice) <= 0;

        let purchaseData = {
            student: id,
            role: role,
            course: courseId,
            courseOfferPrice: Number(course.offerPrice),
            paidAmount: isFree ? 0 : Number(paidAmount),
        };

        if (isFree) {
            // --- ফ্রি কোর্সের লজিক ---
            purchaseData.status = "active";
            purchaseData.paymentDetails = {
                paymentMethod: "free",
                paymentStatus: "completed"
            };

            // ফ্রি হলে সরাসরি একাউন্টে কোর্স অ্যাড হবে
            await AccountModel.findByIdAndUpdate(id, {
                $addToSet: { courses: courseId },
                $set: { userTypePremium: true },
            });

        } else {
            // --- পেইড কোর্সের লজিক ---
            if (!transactionId || !senderNumber || !paidAmount) {
                return res.status(400).json({ message: "পেমেন্ট তথ্য এবং টাকার সঠিক পরিমাণ দিন" });
            }

            // সিকিউরিটি নোট: যদি amount < course.offerPrice হয়, তাও আমরা 'pending' রাখছি।
            // অ্যাডমিন ড্যাশবোর্ডে গিয়ে কোর্স অফার প্রাইস এবং পেইড অ্যামাউন্ট তুলনা করে ডিসিশন নিবেন।

            purchaseData.status = "pending";
            purchaseData.paymentDetails = {
                transactionId,
                paymentMethod,
                senderNumber,
                paymentStatus: "pending"
            };
        }

        // ৪. ডাটাবেসে সেভ করা
        const newPurchase = new PurchaseCourseModel(purchaseData);
        await newPurchase.save();

        return res.status(201).json({
            status: isFree ? 200 : 201,
            message: isFree
                ? "সফলভাবে কোর্স এনরোলমেন্ট সম্পন্ন হয়েছে ✅"
                : "আপনার পেমেন্ট রিকোয়েস্ট জমা হয়েছে। আমাদের অ্যাডমিন প্যানেল তথ্য যাচাই করে আপনাকে দ্রুত এক্সেস দিয়ে দিবে। ⏳"
        });

    } catch (error) {
        console.error("Purchase Course Error:", error);
        return res.status(500).json({ message: "সার্ভার এরর! দয়া করে আবার চেষ্টা করুন।" });
    }
};


//  payment Status update and access the course
export const updatePurchaseStatus = async (req, res) => {
    const { purchaseId, newStatus } = req.body;


    if (!purchaseId || !newStatus) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    try {
        // ৩. পারচেজ রেকর্ডটি খুঁজে বের করা
        const purchase = await PurchaseCourseModel.findById(purchaseId)
        if (!purchase) {
            throw new Error("Purchase record not found.");
        }

        // ৪. যদি আগে থেকেই একটিভ থাকে এবং আবারও একটিভ করতে বলা হয় 
        if (purchase.status === 'active' && newStatus === 'active') {
            throw new Error("This enrollment is already active.");
        }

        // ৫. যদি স্ট্যাটাস 'active' করতে বলা হয়, তবে স্টুডেন্টের একাউন্টে কোর্স ঢুকিয়ে দিন
        if (newStatus === 'active') {
            await AccountModel.findByIdAndUpdate(
                purchase.student,
                { $addToSet: { courses: purchase.course } },
            );
        }


        //  jodi payment statuc active na hoy tahole account theke courseId remove hobe 
        if (newStatus !== 'active' && purchase.status === 'active') {
            await AccountModel.findByIdAndUpdate(
                purchase.student,
                { $pull: { courses: purchase.course } },
            );
        }

        // ৭. পারচেজ স্ট্যাটাস আপডেট করা
        purchase.status = newStatus;
        await purchase.save();

        return res.status(200).json({
            success: true,
            message: `Status updated to ${newStatus} successfully.`,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong during status update."
        });
    }
};


//  admin can assign a plan for the user
 
export const assignCourseByAdmin = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // ১. ভ্যালিডেশন (userId এর বদলে studentId ব্যবহার করা হয়েছে)
        if (!studentId || !courseId) {
            return res.status(400).json({ message: "Student ID and Course ID are required." });
        }

        // ২. কোর্সটি আসলেই এক্সিস্ট করে কি না এবং সেটির প্রাইস কত তা চেক করা
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // ৩. অলরেডি এই কোর্সে একটিভ এনরোলমেন্ট আছে কি না চেক করা
        // (আপনি চাইলে লজিক এমন করতে পারেন যে একটা স্টুডেন্ট মাল্টিপল কোর্স নিতে পারবে, 
        // সেক্ষেত্রে query-তে course: courseId যোগ করতে হবে)
        const isExitPurchase = await PurchaseCourseModel.findOne({
            student: studentId,
            course: courseId,
            status: 'active'
        });

        if (isExitPurchase) {
            return res.status(400).json({
                message: "User already has an active enrollment for this course."
            });
        }

        // ৪. নতুন পারচেজ রেকর্ড তৈরি (Manual Entry)
        const newSubscription = new PurchaseCourseModel({
            student: studentId,
            course: courseId,
            courseOfferPrice: course.offerPrice || 0, // কোর্সের বর্তমান দাম
            paidAmount: 0, // যেহেতু অ্যাডমিন অ্যাসাইন করছে, তাই সাধারণত এটি ০ বা ফ্রি হয়
            status: 'active', // অ্যাডমিন দিলে সরাসরি একটিভ হবে
            purchaseDate: new Date(),
            paymentDetails: {
                paymentMethod: 'manual_by_admin',
                paymentStatus: 'completed',
                transactionId: `ADMIN-${Date.now()}` // একটি ইউনিক ট্র্যাকিং আইডি
            }
        });

        const subscription = await newSubscription.save();

        // ৫. অ্যাকাউন্টে কোর্স আইডি পুশ করা
        // $addToSet ব্যবহার করা হয়েছে যাতে ডুপ্লিকেট না হয়
        await AccountModel.findByIdAndUpdate(studentId, {
            $addToSet: {
                courses: courseId
            }
        });

        return res.status(201).json({
            success: true,
            message: "Course assigned successfully by admin.",
            data: subscription
        });

    } catch (error) {
        console.error("Assign Plan by Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// get user specefic Course by token _id
export const getMyCourse = async (req, res) => {
    const { id } = req.user;
    try {

        const hasCourse = await PurchaseCourseModel.find({ user: id })
            .populate("course")

        console.log(id, hasCourse)

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
            .populate("student", "username email phone _id")

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


