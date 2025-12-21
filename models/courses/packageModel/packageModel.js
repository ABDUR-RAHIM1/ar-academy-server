
import mongoose from "mongoose";


const packagesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number, // supposed: 1,2,3,4 (month)
        required: true
    },
    description: {
        type: String,
    },
});


const packageModel = mongoose.model("Packages", packagesSchema);
export default packageModel;