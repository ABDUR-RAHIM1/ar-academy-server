import mongoose from 'mongoose';

const PurchaseCourseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthAccount', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
    purchaseDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    paymentDetails: {
        transactionId: String,
        paymentMethod: String,
        paymentStatus: String,
    },
}, { timestamps: true });

const PurchaseCourseModel = mongoose.model('PurchaseCourse', PurchaseCourseSchema);
export default PurchaseCourseModel;
