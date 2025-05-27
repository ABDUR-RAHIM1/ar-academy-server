import mongoose from "mongoose";

// Schema Definition
const SubCategorieSchema = new mongoose.Schema(
    {
        sub_name: {
            type: String,
            required: [true, "Subject Name is required"],
            unique: true,
            trim: true,
            maxlength: [100, "sub_name  cannot exceed 100 characters"],
        },
        identifier: {
            type: String,
            required: [true, "identifier is required"],
            unique: true,
            trim: true,
            maxlength: [100, "identifier cannot exceed 100 characters"],
        },
        description: {
            type: String,
            maxlength: [100, "description cannot exceed 100 characters"],
        },
        categorieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categorie",
            required: [true, "categorie is required"],
        },
        type: {
            type: String,
            required: true,
            enum: ["paid", "free"],
            default: "free"
        },
    
    },
    { timestamps: true }
);

// Model Definition
const SubjectModel = mongoose.model("SubCategorie", SubCategorieSchema);

export default SubjectModel;
