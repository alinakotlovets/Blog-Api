import express from "express";
import {addComment, validateComment, getComments} from "../controllers/commentController.js";
import {verifyToken} from "../middleware/verifyToken.js";

const commentRouter = express.Router();


commentRouter.get("/:postId", getComments);
commentRouter.post("/", verifyToken, validateComment, addComment)

export default  commentRouter;