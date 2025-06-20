
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
    sub_categorie: {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategorie",
        required: function () {
            return !this.isAll; // যদি all না হয়, তাহলে chapter লাগবে
        }
    },
    chapter: {
        type: mongoose.Schema.ObjectId,
        ref: "Chapter",
        required: function () {
            return !this.isAll; // যদি all না হয়, তাহলে chapter লাগবে
        }
    },
    isAll: {
        type: Boolean,
        default: false
    },
    isAllTitle: {
        type: String,
        required: function () {
            return this.isAll; // যদি all  হয়, তাহলে isAllTitle লাগবে
        }
    },
    questions: {
        type: [QuestionsItemSchema],
        required: true
    },
    type: {
        type: String,
        enum: ["paid", "free"],
        default: "free"
    },
    duration: {
        type: Number,
        required: true
    }

}, { timestamps: true });

const QuestionsModel = mongoose.model("Questions", QuestionsSchema);

export default QuestionsModel;