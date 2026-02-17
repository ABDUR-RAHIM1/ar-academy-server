import mongoose from "mongoose";

const PurchasePakageSchema = new mongoose.Schema({
    subAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAuthAccount',
        required: true
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Packages',
        required: true
    },
    purchaseDate: { type: Date, default: Date.now },

    packageOfferPrice: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'active', 'rejected'],
        default: 'pending'
    },

    paymentDetails: {
        transactionId: { type: String, sparse: true },
        paymentMethod: { type: String }, // 'bkash', 'nagad', 'rocket', 'free'
        senderNumber: { type: String },
        paymentStatus: { type: String },
    },
}, { timestamps: true });


const PurchasePakageModel = mongoose.model("PurchasePakage", PurchasePakageSchema);
export default PurchasePakageModel;
