
import { mongoose, Schema, model } from "mongoose";

const CategoriesSchema = new Schema({
    position: {
        type: Number,
        required: true
    },
    categorie: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    identifier: {
        type: String,
        required: false,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
    },

},
    { timestamps: true }
);

const CategorieModel = model("Categorie", CategoriesSchema);

export default CategorieModel