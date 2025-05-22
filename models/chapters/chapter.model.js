import mongoose from "mongoose";



// Step 1: Create sub-schema for solution item
const SolutionItemSchema = new mongoose.Schema({
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
        type: [SolutionItemSchema],
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
