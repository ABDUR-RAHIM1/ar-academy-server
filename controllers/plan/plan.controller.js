import { serverError } from "../../helpers/serverError.js";
import PlanModel from "../../models/plan/plan.model.js";



// Create a new plan
export const createPlan = async (req, res) => {
    try {

        const {
            key,
            label,
            emoji,
            description,
            days,
            price,
            features
        } = req.body

        const isExist = await PlanModel.findOne({ key });
        if (isExist) {
            return res.status(400).json({
                message: `You already have a plan with the key '${key}'`
            });
        }

        const plan = new PlanModel({
            key,
            label,
            emoji,
            description,
            days,
            price,
            features
        });
        const savedPlan = await plan.save();
        res.status(201).json({
            message: `Successfuly Create ${key} Plan`
        });
    } catch (err) {
        console.log(err)
        serverError(res, err)
    }
};

// Get all plans
export const getPlans = async (req, res) => {
    try {
        const plans = await PlanModel.find()
            .sort({ days: 1 })
        res.status(200).json(plans);
    } catch (err) {
        serverError(res, err)
    }
};

// Get single plan
export const getPlanByKey = async (req, res) => {
    try {
        const plan = await PlanModel.findOne({ key: req.params.key });
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.status(200).json(plan);
    } catch (err) {
        serverError(res, err)
    }
};

// Update plan
export const updatePlan = async (req, res) => {
    const { planId } = req.params;
    try {
        const plan = await PlanModel.findOneAndUpdate(planId, req.body, { new: true });
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.status(200).json(plan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete plan
export const deletePlan = async (req, res) => {
    const { planId } = req.params;
    try {
        const plan = await PlanModel.findByIdAndDelete(planId);
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.status(200).json({ message: "Plan deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
