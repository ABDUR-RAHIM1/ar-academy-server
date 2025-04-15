import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
            required: true,
        },
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AuthAccount",
            required: true,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },

        replies: {
            type: Array
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true } // Automatically createdAt & updatedAt add korbe
);

const CommentModel = mongoose.model("Comment", commentSchema);

export default CommentModel
