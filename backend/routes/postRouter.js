import express from "express";
import {upload} from "../middleware/multer.js"
import {verifyToken} from "../middleware/verifyToken.js";
import {validatePost, addPost, editPost, getPostsByAuthors, getPostById, deletePost, getPublicPosts} from "../controllers/postController.js";
import {validateFile} from "../middleware/validateFile.js";


const postRouter = express.Router();

postRouter.get("/public", getPublicPosts);
postRouter.get("/:postId", verifyToken, getPostById);
postRouter.delete("/:postId", verifyToken, deletePost);
postRouter.put("/:postId", verifyToken, upload.single("previewImage"), validatePost, validateFile, editPost);
postRouter.get("/", verifyToken, getPostsByAuthors);
postRouter.post("/", verifyToken, upload.single("previewImage"),  validatePost, validateFile, addPost);

export default postRouter;