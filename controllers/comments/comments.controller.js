import CommentModel from "../../models/comments/comments.model.js";



// ✅ Create a Comment
export const createComment = async (req, res) => {
    const { chapterId, comment } = req.body;
    const { id } = req.user;
    try {

        const newComment = new CommentModel({
            chapterId,
            accountId: id,
            comment
        });

        await newComment.save();

        res.status(201).json({
            message: "Comment Done",
            token: true
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to post comment",
            error,
            token: false
        });
    }
};


// ✅ Get all comments (for admin)
export const getAllComments = async (req, res) => {
    try {

        const comments = await CommentModel.find();

        res.status(200).json({
            message: "Successfully fetched",
            data: comments
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch comments",
            error
        });
    }
};


// ✅ Get all comments for a specific chapterId
export const getCommentsByChapterId = async (req, res) => {
    const { chapterId } = req.params;

    try {

        const comments = await CommentModel.find({ chapterId })
            .populate("accountId", "username profilePhoto _id")
            .populate("replies.accountId", "username _id")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Successfully fetched comments",
            data: comments
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch comments",
            error
        });
    }
};


// ✅  Reply to a comment
export const postReplyToComment = async (req, res) => {
    const { commentId, reply } = req.body;
    const { id, username, profilePhoto } = req.user;
    try {

        const repliedBody = {
            accountName: username,
            accountId: id,
            profilePhoto: profilePhoto,
            reply,
            createdAt: new Date()
        };

        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentId,
            { $push: { replies: repliedBody } },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({
                message: "Comment not found", 
            });
        }

        return res.status(200).json({
            message: "Reply successful", 
        });

    } catch (error) { 
        return res.status(500).json({
            message: "Failed to post reply",
            error
        });
    }
};