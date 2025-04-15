import mongoose from "mongoose";

const ResultsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "AuthAccount", required: true },
    results: { type: Array, required: true },
    correctAns: { type: String, required: true },
    wrongAns: { type: String, required: true },
    skip: { type: String, required: true },
    totalQuestions: { type: String, required: true },
}, { timestamps: true });


const ResultsModel = mongoose.model("Results", ResultsSchema);

export default ResultsModel;