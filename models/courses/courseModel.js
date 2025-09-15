import mongoose from "mongoose";


const linkSchema = mongoose.Schema({
    itemName: {
        type: String,
    },
    path: {
        type: String,
    }
})


const CourseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
    },
    shortDesc: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    links: {
        type: [linkSchema],
        required: true,
    },
    regularPrice: {
        type: Number
    },
    offerPrice: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: false
    }

}, { timestamps: true });


const CourseModel = mongoose.model("Courses", CourseSchema);

export default CourseModel;