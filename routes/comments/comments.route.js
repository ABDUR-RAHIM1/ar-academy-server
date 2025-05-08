import express from "express";
import { createComment, deleteComment, getAllComments, getCommentsByChapterId, postReplyToComment } from "../../controllers/comments/comments.controller.js";
import { userVerify } from "../../middleware/userVerify.js";

const router = express.Router();

// Root =>  /api/comment
router.post("/create", userVerify, createComment);
router.get("/all", getAllComments);
router.get("/byChapter/:chapterId", getCommentsByChapterId);
router.post("/reply", userVerify, postReplyToComment);
router.delete("/delete/:commentId", userVerify, deleteComment);

export default router;
