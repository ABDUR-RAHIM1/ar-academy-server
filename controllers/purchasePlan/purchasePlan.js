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


        const isExisPurchase = await PurchasePlanModel.findOne({
            user: id,
            status: 'active'
        });

        if (isExisPurchase) {
            return res.status(404).json({
                message: "You have already Purchased One"
            })
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

export const getAllPurchasePlan = async (req, res) => {
    try {

        const purchaseAll = await PurchasePlanModel.find()
            .populate("user", "username email _id")

        res.status(200).json(purchaseAll)

    } catch (error) {
        return serverError(res, error)
    }
}