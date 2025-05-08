
import mongoose from "mongoose";

const QuestionsSchema = new mongoose.Schema({
    //  subCategoire mean subject
    sub_categorie: { type: mongoose.Schema.ObjectId, ref: "SubCategorie", required: true },
    chapter: { type: mongoose.Schema.ObjectId, ref: "Chapter", required: true },
    questions: { type: [], required: true },

}, { timestamps: true });

const QuestionsModel = mongoose.model("Questions", QuestionsSchema);

export default QuestionsModel;