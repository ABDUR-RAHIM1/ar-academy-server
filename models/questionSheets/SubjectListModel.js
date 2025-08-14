import mongoose from "mongoose";

const SubjectistSchema = mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassList",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },

},
    {
        timestamps: true
    }
);


const SubjectModel = mongoose.model("SubjectList", SubjectistSchema);

export default SubjectModel