
import mongoose from "mongoose";


const QuestionsItemSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: [true, "ID is required"]
    },
    Question: {
        type: String,
        required: [true, "Question is required"]
    },
    Option1: {
        type: String,
        required: [true, "Option1 is required"]
    },
    Option2: {
        type: String,
        required: [true, "Option2 is required"]
    },
    Option3: {
        type: String,
        required: [true, "Option3 is required"]
    },
    Option4: {
        type: String,
        required: [true, "Option4 is required"]
    },
    CorrectAnswer: {
        type: String,
        required: [true, "CorrectAnswer is required"]
    },
    Explanation: {
        type: String,
        required: false
    },
    Subject: {
        type: String,
        required: [true, "Subject is required"]
    }
}, { _id: false, strict: true });



const QuestionsSchema = new mongoose.Schema({
    //  subCategoire mean subject
    participant: {
        type: Array,
        required: false
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: "Courses",
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    questionType: {
        type: String,
        required: true,
        trim: true
    },

    duration: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    passMark: {
        type: String,
        required: true
    },
    nagetiveMark: {
        type: Number,
        required: true,
        default: 0.50
    },
    allowRetake: {
        type: Boolean,
        required: false,
        default: true
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    },
    questions: {
        type: [QuestionsItemSchema],
        required: true
    },

}, { timestamps: true });

const QuestionsModel = mongoose.model("Questions", QuestionsSchema);

export default QuestionsModel;