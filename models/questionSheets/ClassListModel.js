import mongoose from "mongoose";

const ClassListSchema = mongoose.Schema({
    serial: {
        type: Number,
        required: false,
        // unique: true  // যদি সিরিয়াল ইউনিক হয়
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
},
    {
        timestamps: true
    }
);


const ClassListModel = mongoose.model("ClassList", ClassListSchema);

export default ClassListModel