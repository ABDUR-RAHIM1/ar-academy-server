import mongoose from "mongoose";

//  agulor kaj kora hoyni akhono 
const PurchasePakageSchema = new mongoose.Schema({
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    purchasedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdminAuthAccount",
        required: true
    },
    name: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    purchasedAt: {
        type: Date,
        default: Date.now
    },

    // expiresAt: {
    //     type: Date,
    //     required: true
    // },

    isActive: {
        type: Boolean,
        default: true
    }
});

const PurchasePakageModel = mongoose.model("PurchasePakage", PurchasePakageSchema);
export default PurchasePakageModel;
