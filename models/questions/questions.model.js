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
    },
    Option2: {
        type: String,
    },
    Option3: {
        type: String,
    },
    Option4: {
        type: String,
    },
    CorrectAnswer: {
        type: String,
    },
    Explanation: {
        type: String,
    },
    YtLink: {
        type: String, 
    },
    Subject: {
        type: String,
        required: [true, "Subject is required"]
    }
}, { _id: false, strict: true });

const QuestionsSchema = new mongoose.Schema({
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

    // --- 3-ti Model Control korar jonnotonun field-gulo ---
    examType: {
        type: String,
        enum: ["live", "admission_based", "practice"],
        default: "live",
        required: true
    },
    dayOffset: {
        type: Number,
        default: 0 // Admission-based model er jonno: student enroll korar koto din por exam hobe
    },
    // -----------------------------------------------------

    duration: {
        type: Number,
        required: true
    },

    // Sudhu "live" exam holei startDate ebong startTime lagbe, onnothay optional
    startDate: {
        type: Date,
        required: function() {
            return this.examType === "live";
        }
    },
    startTime: {
        type: String,
        required: function() {
            return this.examType === "live" || this.examType === "admission_based";
        }
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
    createdBy: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "AdminAuthAccount"
    },
    creatorRole: {
        type: String,
        enum: ["superAdmin", "modaretor", "subAdmin"],
        default: "superAdmin"
    }

}, { timestamps: true });

const QuestionsModel = mongoose.model("Questions", QuestionsSchema);

export default QuestionsModel;