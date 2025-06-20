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
    profilePhoto: {
        type: String
    },
    mobile: {
        type: Number
    },
    dob: {
        type: Date
    },
    gender: {
        type: String
    },
    address: {
        type: String
    },
    qualification: {
        type: String
    },
    instituteName: {
        type: String
    },
    favoriteSubject: {
        type: String
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchasePlan',
        default: null
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "pending", "reject"],
        default: "active"
    },

}, { timestamps: true });



const AccountModel = mongoose.model("AuthAccount", AccountSchema);

export default AccountModel;