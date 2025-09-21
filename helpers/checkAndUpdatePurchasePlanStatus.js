import PurchaseCourseModel from "../models/purchaseCourse/purchaseCourse.js";



// ইউজার আইডি দিয়ে প্ল্যান চেক করে স্ট্যাটাস আপডেট করবে
export const checkAndUpdatePurchasePlanStatus = async (planId) => {
    try {
        const plan = await PurchaseCourseModel.findById(planId);

        if (!plan) return null;

        const now = new Date();

        // যদি সময় পেরিয়ে যায়
        if (plan.endDate < now && plan.status === "active") {
            plan.status = "expired";
            await plan.save();
        }

        return plan;
    } catch (error) {
        console.error("Purchase plan status check failed:", error);
        return null;
    }
};
