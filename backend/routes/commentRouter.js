import express from "express";
import {addComment, validateComment, getComments, deleteComment, validateEditComment, editComment} from "../controllers/commentController.js";
import {verifyToken} from "../middleware/verifyToken.js";

const commentRouter = express.Router();


commentRouter.put("/:commentId", verifyToken, validateEditComment, editComment);
commentRouter.delete("/:commentId", verifyToken, deleteComment);
commentRouter.get("/:postId", getComments);
commentRouter.post("/", verifyToken, validateComment, addComment);

export default  commentRouter;