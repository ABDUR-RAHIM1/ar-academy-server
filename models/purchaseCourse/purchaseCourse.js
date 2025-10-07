import mongoose from 'mongoose';

const PurchaseCourseSchema = new mongoose.Schema({
    subAdminOrStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthAccount', required: true },
    role: { type: String, required: true }, 
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
    purchaseDate: { type: Date, default: Date.now },
    paymentDetails: {
        transactionId: String,
        paymentMethod: String,
        paymentStatus: String,
    },
}, { timestamps: true });

const PurchaseCourseModel = mongoose.model('PurchaseCourse', PurchaseCourseSchema);
export default PurchaseCourseModel;
