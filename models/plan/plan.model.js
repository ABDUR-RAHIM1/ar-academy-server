 
import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    emoji: { type: String },
    description: { type: String },
    days: { type: Number, required: true },
    price: { type: Number, required: true },
    features: [{ type: String }]
}, { timestamps: true });

const PlanModel = mongoose.model("Plan", planSchema);
export default PlanModel;
