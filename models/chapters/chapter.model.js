import mongoose from "mongoose";

// Schema Definition
const ChapterSchema = new mongoose.Schema({
    chapter_name: {
        type: String,
        required: [true, "Chapter name is required"]
    },
    identifier: {
        type: String,
        required: [true, "Identifier is required"]
    },
    contents: {
        type: String,
        required: false
    },
    sub_categorie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategorie",
        required: [true, "Sub Category ID is required"]
    },
    type: {
        type: String,
        required: true,
        default: "free",
        emun: ["free", "paid"]
    },
});


// Model Definition
const ChaptersModel = mongoose.model("Chapter", ChapterSchema);

export default ChaptersModel;
