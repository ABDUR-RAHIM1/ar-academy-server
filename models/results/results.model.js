import mongoose from "mongoose";

const ResultsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "AuthAccount", required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref:"Questions", required: true },
    results: { type: Array, required: true },
    correctAns: { type: String, required: true },
    wrongAns: { type: String, required: true },
    skip: { type: String, required: true },
    totalmark: { type: String, required: true },
    nagetiveMark: { type: String, required: true },
    isPass: { type: Boolean, required: true },
    isRetake:  { type: Boolean, required: true },
    totalQuestions: { type: String, required: true },
}, { timestamps: true });


const ResultsModel = mongoose.model("Results", ResultsSchema);

export default ResultsModel;