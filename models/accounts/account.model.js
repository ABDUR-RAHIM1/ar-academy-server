import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({

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
    userTypePremium: {
        type: Boolean,
        default: false
    },
    courses: {
        type: [
            mongoose.Schema.Types.ObjectId
        ],
        ref: 'Courses',
        default: []
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "subAdmin", "superAdmin"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "pending", "reject"],
        default: "active"
    },

}, { timestamps: true });



const AccountModel = mongoose.model("AuthAccount", AccountSchema);

export default AccountModel;