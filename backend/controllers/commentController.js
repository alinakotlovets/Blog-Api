import {body, validationResult} from "express-validator";
import {addCommentToBd, deleteCommentFromBd, getCommentsToPost, getCommentById} from "../lib/queries.js";


export const validateComment = [
    body("comment")
        .trim()
        .notEmpty().withMessage("Comment is required")
        .isLength({min:2, max:60}).withMessage("Comment length has to be no more than 60 letter and at least 2 letter"),
    body("postId")
        .trim()
        .notEmpty().withMessage("Post id is required")
]

export async function addComment(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors
        })
    }
    let userId = req.user ? parseInt(req.user.id) : null;
    const {comment, postId} = req.body;

    const addedComment = await addCommentToBd(comment, parseInt(postId), userId);
    const formatedDateComment = { ...addedComment,
            formatedDate : new Intl.DateTimeFormat("uk-UA", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(addedComment.createdAt)),
        user: {
            username:req.user.username,
        }
    }

    return res.status(200).json({
        comment: formatedDateComment
    })
}

export async function getComments(req, res){
    const {postId} = req.params;
    if(!postId){
        return res.status(400).json({
            errors: [{msg:"Post id is required"}]
        })
    }

    const comments = await getCommentsToPost(parseInt(postId));
    const formatedDateComment = comments.map((comment)=>{
        return {...comment,
            formatedDate : new Intl.DateTimeFormat("uk-UA", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(comment.createdAt))}
    })
    return res.status(200).json({
        comments: formatedDateComment
    })
}

export async function deleteComment(req,res){
    const {commentId} = req.params;
    if(!commentId){
        res.status(400).json({
            errors: [{msg: "Comment not found"}]
        })
    }

    const user = req.user;
    if (!user) {
        return res.status(403).json({
            errors: [{ msg: "You need to be logged in to delete a comment" }]
        });
    }
    const comment = await  getCommentById(parseInt(commentId))
    if(user.role !== "admin" && user.id !== comment.userId){
        res.status(403).json({
            errors: [{msg: "You dont have permission to delete this comment"}]
        })
    }

    await deleteCommentFromBd(parseInt(commentId));
    return res.status(200).json({
        message: "Comment deleted successfully"
    })
}