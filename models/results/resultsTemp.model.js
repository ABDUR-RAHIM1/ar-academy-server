import mongoose from "mongoose";

const TempResultsSchema = new mongoose.Schema({
    // ekhane sudhu temp user er 
    tempUser: { type: String, required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Questions", required: true },
    isPublished: { type: Boolean, required: true, default: true },
    results: { type: Array, required: true },
    correctAns: { type: String, required: true },
    wrongAns: { type: String, required: true },
    skip: { type: String, required: true },
    totalmark: { type: String, required: true },
    nagetiveMark: { type: String, required: true },
    passMark: { type: Number, required: true },
    isPass: { type: Boolean, required: true },
    isRetake: { type: Boolean, required: true },
    totalQuestions: { type: String, required: true },
}, { timestamps: true });


const TempResultsModel = mongoose.model("TempResults", TempResultsSchema);

export default TempResultsModel;