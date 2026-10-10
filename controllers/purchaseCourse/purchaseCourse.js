
import { serverError } from "../../helpers/serverError.js";
import AccountModel from "../../models/accounts/account.model.js";
import CourseModel from "../../models/courses/courseModel.js";
import PurchaseCourseModel from "../../models/purchaseCourse/purchaseCourse.js";
import sendTelegramMessage from "../../utils/email/telegram.js";


export const createPurchaseCourse = async (req, res) => {
    try {

        const { courseId, senderNumber, transactionId, method: paymentMethod, paidAmount } = req.body;

        const { id, username, role } = req.user;

        // ১. বেসিক ভ্যালিডেশন
        if (!id) return res.status(401).json({ message: "Unauthorized" });
        if (!courseId) return res.status(400).json({ message: "কোর্স আইডি প্রয়োজন" });

        const course = await CourseModel.findById(courseId);
        const student = await AccountModel.findById(id);

        if (!course) return res.status(404).json({ message: "কোর্স পাওয়া যায়নি" });
        if (!student) return res.status(404).json({ message: "ইউজার পাওয়া যায়নি" });

        // ২. ডুপ্লিকেট চেক
        const exists = await PurchaseCourseModel.findOne({
            student: id,
            course: courseId,
            status: { $in: ["pending", "active"] }
        });

        if (exists) {
            return res.status(400).json({
                message: "কোর্সটি আগেই কিনেছেন বা পেন্ডিং আছে"
            });
        }

        // ৩. কোর্স টাইপ
        const isFree = Number(course.offerPrice) <= 0;

        let purchaseData = {
            student: id,
            role: role,
            course: courseId,
            courseOfferPrice: Number(course.offerPrice),
            paidAmount: isFree ? 0 : Number(paidAmount),
            activatedAt: isFree ? Date.now() : null
        };

        let message = "";

        if (isFree) {

            // FREE COURSE
            purchaseData.status = "active";
            purchaseData.paymentDetails = {
                paymentMethod: "free",
                paymentStatus: "completed"
            };

            await AccountModel.findByIdAndUpdate(id, {
                $addToSet: { courses: courseId },
                $set: { userTypePremium: true },
            });

            message = `
🎓 *Onushilon Academy*

━━━━━━━━━━━━━━━━━━
🆓 নতুন ফ্রি কোর্স এনরোলমেন্ট
━━━━━━━━━━━━━━━━━━

👤 শিক্ষার্থীর নাম: ${username}
📚 কোর্স: ${course.title || courseId}

📌 স্ট্যাটাস: ফ্রি কোর্স (অটো এক্সেস দেওয়া হয়েছে)

━━━━━━━━━━━━━━━━━━
⚡ একজন নতুন শিক্ষার্থী যুক্ত হয়েছে
📌 System Notification
`;

        } else {

            // PAID COURSE
            if (!transactionId || !senderNumber || !paidAmount) {
                return res.status(400).json({ message: "পেমেন্ট তথ্য এবং টাকার সঠিক পরিমাণ দিন" });
            }

            purchaseData.status = "pending";
            purchaseData.paymentDetails = {
                transactionId,
                paymentMethod,
                senderNumber,
                paymentStatus: "pending"
            };

            message = `
🎓 *Onushilon Academy*

━━━━━━━━━━━━━━━━━━
💰 নতুন কোর্স অর্ডার (Paid)
━━━━━━━━━━━━━━━━━━

👤 শিক্ষার্থীর নাম: ${username}
📚 কোর্স: ${course.title || courseId}
📞 মোবাইল: ${senderNumber}

💳 পেমেন্ট তথ্য:
➤ মাধ্যম: ${paymentMethod}
➤ ট্রানজেকশন ID: ${transactionId}
➤ পরিমাণ: ${paidAmount} টাকা

━━━━━━━━━━━━━━━━━━
⏳ অ্যাডমিন ভেরিফিকেশন প্রয়োজন
📌 Pending Payment
`;
        }

        // ৪. ডাটাবেসে সেভ
        const newPurchase = new PurchaseCourseModel(purchaseData);
        await newPurchase.save();

        // ৫. Telegram এ পাঠানো
        await sendTelegramMessage(message);

        return res.status(201).json({
            status: isFree ? 200 : 201,
            message: isFree
                ? "সফলভাবে ফ্রি কোর্স এনরোলমেন্ট সম্পন্ন হয়েছে ✅"
                : "আপনার পেমেন্ট রিকোয়েস্ট জমা হয়েছে ⏳"
        });

    } catch (error) {
        console.error("Purchase Course Error:", error);
        return res.status(500).json({ message: "সার্ভার এরর! দয়া করে আবার চেষ্টা করুন।" });
    }
};



// export const updatePurchaseStatus = async (req, res) => {
//     const { purchaseId, newStatus } = req.body;


//     if (!purchaseId || !newStatus) {
//         return res.status(400).json({ success: false, message: "Missing required fields." });
//     }

//     try {
//         // ৩. পারচেজ রেকর্ডটি খুঁজে বের করা
//         const purchase = await PurchaseCourseModel.findById(purchaseId)
//         if (!purchase) {
//             throw new Error("Purchase record not found.");
//         }

//         // ৪. যদি আগে থেকেই একটিভ থাকে এবং আবারও একটিভ করতে বলা হয় 
//         if (purchase.status === 'active' && newStatus === 'active') {
//             throw new Error("This enrollment is already active.");
//         }

//         // ৫. যদি স্ট্যাটাস 'active' করতে বলা হয়, তবে স্টুডেন্টের একাউন্টে কোর্স ঢুকিয়ে দিন
//         if (newStatus === 'active') {
//             await AccountModel.findByIdAndUpdate(
//                 purchase.student,
//                 { $addToSet: { courses: purchase.course } },
//             );
//         }


//         //  jodi payment statuc active na hoy tahole account theke courseId remove hobe 
//         if (newStatus !== 'active' && purchase.status === 'active') {
//             await AccountModel.findByIdAndUpdate(
//                 purchase.student,
//                 { $pull: { courses: purchase.course } },
//             );
//         }

//         // ৭. পারচেজ স্ট্যাটাস আপডেট করা
//         purchase.status = newStatus;
//         await purchase.save();

//         return res.status(200).json({
//             success: true,
//             message: `Status updated to ${newStatus} successfully.`,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Something went wrong during status update."
//         });
//     }
// };


//  admin can assign a plan for the user


export const updatePurchaseStatus = async (req, res) => {
    const { purchaseId, newStatus } = req.body;

    if (!purchaseId || !newStatus) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    try {
        // ৩. পারচেজ রেকর্ডটি খুঁজে বের করা
        const purchase = await PurchaseCourseModel.findById(purchaseId);
        if (!purchase) {
            return res.status(404).json({ success: false, message: "Purchase record not found." });
        }

        // ৪. যদি আগে থেকেই একটিভ থাকে এবং আবারও একটিভ করতে বলা হয় 
        if (purchase.status === 'active' && newStatus === 'active') {
            return res.status(400).json({ success: false, message: "This enrollment is already active." });
        }

        // ৫. যদি স্ট্যাটাস 'active' করতে বলা হয়, তবে স্টুডেন্টের একাউন্টে কোর্স ঢুকিয়ে দিন
        if (newStatus === 'active') {
            await AccountModel.findByIdAndUpdate(
                purchase.student,
                { $addToSet: { courses: purchase.course } },
            );

            // 🔥 নতুন সংযোজন: যদি এর আগে একটিভ না থাকে, তবে বর্তমান ডেটটি activatedAt এ সেভ হবে
            if (!purchase.activatedAt) {
                purchase.activatedAt = new Date();
            }
        }

        // ৬. যদি পেমেন্ট স্ট্যাটাস active না হয়, তাহলে একাউন্ট থেকে courseId remove হবে 
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
            .sort({ createdAt: -1 })

        console.log("call")
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
            .populate("course", "name title")
            .sort({ createdAt: -1 })

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


