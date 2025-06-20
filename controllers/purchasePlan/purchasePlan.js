import { serverError } from "../../helpers/serverError.js";
import AccountModel from "../../models/accounts/account.model.js";
import PurchasePlanModel from "../../models/purchasePlan/purchasePlan.js";


export const purchasePlan = async (req, res) => {
    try {
        const { plan } = req.body;
        const { id } = req.user;

        if (!plan || !plan.key || !plan.days) {
            return res.status(400).json({ message: "Invalid plan data" });
        }


        // ✅ চেক করা হচ্ছে ইউজারের প্রোফাইলে আগে থেকেই কোনো প্ল্যান আছে কিনা
        const user = await AccountModel.findById(id).select("plan");

        if (user?.plan) {
            return res.status(400).json({
                message: "You already have an active plan"
            });
        }



        //  pore ata delete korte hobe
        const demoDetails = {
            transactionId: "DXN0193121",
            paymentMethod: "BKASH",
            paymentStatus: "SUCESS",
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + plan.days);

        // subscription তৈরি করো
        const newSubscription = new PurchasePlanModel({
            user: id, // user id form middlewere
            planName: plan.key,
            planLabel: plan.label,
            price: plan.price,
            endDate,
            paymentDetails: plan.paymentDetails || demoDetails

        });

        const subscription = await newSubscription.save();

        await AccountModel.findByIdAndUpdate(id, {
            $set: {
                plan: subscription._id
            }
        })


        return res.status(201).json({
            message: "Subscription purchased successfully"
        });

    } catch (error) {
        console.error("Purchase Plan Error:", error);
        return serverError(res, error)
    }
};


//  admin can assign a plan for the user
export const assignPlanByAdmin = async (req, res) => {
    try {
        const { userId, plan } = req.body;

        // Validation
        if (!userId || !plan || !plan.key || !plan.days) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        // Check existing active plan
        const isExitPurchase = await PurchasePlanModel.findOne({
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

        const newSubscription = new PurchasePlanModel({
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
export const getAllPurchasePlan = async (req, res) => {
    try {

        const purchaseAll = await PurchasePlanModel.find()
            .populate("user", "username email _id")

        res.status(200).json(purchaseAll)

    } catch (error) {
        return serverError(res, error)
    }
};


// ✅ Remove plan from user's account without deleting the plan document
export const deleteMyPlan = async (req, res) => {
    const { planId } = req.params;
    try {
        // Step 1: Just unset the user's current plan reference
        await AccountModel.findByIdAndUpdate(
            req.user.id,
            { $unset: { plan: null } }, // or "" if your default is empty string
            { new: true }
        );


        // Step 2: সাবস্ক্রিপশনটির status 'cancelled' করো

        const updated = await PurchasePlanModel.findByIdAndUpdate(
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


