import mongoose from "mongoose";

const AdminAccountSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        required: true,
        enum: ["moderator", "subAdmin", "superAdmin"],
        default: "moderator",
    },
    status: {
        type: String,
        enum: ["active", "pending", "reject"],
        default: "active"
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PurchasePakage",
        default: null
    },

}, { timestamps: true });



const AdminAccountModel = mongoose.model("AdminAuthAccount", AdminAccountSchema);

export default AdminAccountModel;