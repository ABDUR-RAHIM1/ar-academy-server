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
    pakages: {
        type: String,
        default:0,  // pakages ti din hisebe count hobe. 
    },

}, { timestamps: true });



const AdminAccountModel = mongoose.model("AdminAuthAccount", AdminAccountSchema);

export default AdminAccountModel;