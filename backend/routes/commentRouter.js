import express from "express";
import {addComment, validateComment, getComments, deleteComment} from "../controllers/commentController.js";
import {verifyToken} from "../middleware/verifyToken.js";

const commentRouter = express.Router();


commentRouter.delete("/:commentId", verifyToken, deleteComment)
commentRouter.get("/:postId", getComments);
commentRouter.post("/", verifyToken, validateComment, addComment)

export default  commentRouter;