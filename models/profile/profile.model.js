import mongoose from "mongoose";

const profileSchema = mongoose.Schema({
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
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
  
    status: {
        type: String,
        enum: ["active", "pending", "reject"],
        default: "active"
    },
})