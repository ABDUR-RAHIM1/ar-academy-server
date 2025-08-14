
import mongoose from "mongoose";


const QuestionsSheetItemSchema = new mongoose.Schema({
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



const QuestionsSheetSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,        
        ref: "ClassList",
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,         
        ref: "SubjectList",
        required: true
    },                  
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChapterList",
        required: true
    },
    questions: {
        type: [QuestionsSheetItemSchema],
        required: true
    },



}, { timestamps: true });

const QuestionsSheetModel = mongoose.model("QuestionsSheet", QuestionsSheetSchema);

export default QuestionsSheetModel;