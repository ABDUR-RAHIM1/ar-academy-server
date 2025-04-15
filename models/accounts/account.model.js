import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    plan: {
        type: Object,
        required: true,
    },
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
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
    profilePhoto: {
        type: String
    },
    status: {
        type: String,
        enum: ["accept", "pending", "reject"],
        default: "pending"
    },
    bkashNumber: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});



const AccountModel = mongoose.model("AuthAccount", AccountSchema);

export default AccountModel;