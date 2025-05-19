import mongoose from 'mongoose';

const PurchasePlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthAccount', required: true },
    planName: { type: String, required: true },
    planLabel: { type: String },
    price: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    paymentDetails: {
        transactionId: String,
        paymentMethod: String,
        paymentStatus: String,
    },
}, { timestamps: true });

const PurchasePlanModel = mongoose.model('PurchasePlan', PurchasePlanSchema);
export default PurchasePlanModel;
