// import mongoose from 'mongoose';

// const PurchaseCourseSchema = new mongoose.Schema({
//     subAdminOrStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthAccount', required: true },
//     role: { type: String, required: true }, 
//     course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
//     purchaseDate: { type: Date, default: Date.now },
//     paymentDetails: {
//         transactionId: String,
//         paymentMethod: String,
//         paymentStatus: String,
//     },
// }, { timestamps: true });

// const PurchaseCourseModel = mongoose.model('PurchaseCourse', PurchaseCourseSchema);
// export default PurchaseCourseModel;

import mongoose from 'mongoose';

const PurchaseCourseSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthAccount',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    purchaseDate: { type: Date, default: Date.now },

    courseOfferPrice: { type: Number, default: 0 },
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



const PurchaseCourseModel = mongoose.model('PurchaseCourse', PurchaseCourseSchema);
export default PurchaseCourseModel;