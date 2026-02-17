
import mongoose from "mongoose";


const packagesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },   
});


const packageModel = mongoose.model("Packages", packagesSchema);
export default packageModel;