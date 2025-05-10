import mongoose from "mongoose";

// Schema Definition
const ChapterSchema = new mongoose.Schema({
    position: {
        type: Number,
        required: [true, "Position is required"]
    },
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
    solutionTable: {
        type: [Object],
        required: false
    },
    sub_categorie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategorie",
        required: [true, "Sub Category ID is required"]
    },

    fileType: {
        type: String,
        required: true,
        enum: ["file", "editor"]
    },
}, { timestamps: true });


// Model Definition
const ChaptersModel = mongoose.model("Chapter", ChapterSchema);

export default ChaptersModel;
