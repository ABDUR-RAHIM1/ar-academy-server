import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassList",
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubjectList",
    required: true
  }
}, {
  timestamps: true
});

const ChapterListModel = mongoose.model("ChapterList", ChapterSchema);

export default ChapterListModel