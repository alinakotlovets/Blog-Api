import {body, validationResult} from "express-validator";
import {addCommentToDb, deleteCommentFromDb, getCommentsToPost, getCommentById, editCommentInDb} from "../lib/queries.js";
import {formatDates} from "../utils/formatDate.js";

export const validateComment = [
    body("comment")
        .trim()
        .notEmpty().withMessage("Comment is required")
        .isLength({min:2, max:60}).withMessage("Comment length has to be no more than 60 letter and at least 2 letter"),
    body("postId")
        .trim()
        .notEmpty().withMessage("Post id is required")
]

export const validateEditComment = [
    body("comment")
        .trim()
        .notEmpty().withMessage("Comment is required")
        .isLength({ min: 2, max: 60 }).withMessage("Comment length must be 2-60 characters")
];


export async function addComment(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors
        })
    }
    let userId = req.user ? parseInt(req.user.id) : null;
    const {comment, postId} = req.body;

    const addedComment = await addCommentToDb(comment, parseInt(postId), userId);
    const formatedDateComment = formatDates(addedComment);

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
        return formatDates(comment)});

    return res.status(200).json({
        comments: formatedDateComment
    })
}

async function deleteEditCommentValidate(req){
    const { commentId } = req.params;
    if (!commentId) {
        throw { status: 400, message: "Comment not found" };
    }

    const user = req.user;
    if (!user) {
        throw { status: 403, message: "You need to be logged in to delete or edit a comment" };
    }

    const comment = await getCommentById(parseInt(commentId));
    if (!comment) {
        throw { status: 404, message: "Comment does not exist" };
    }

    if (user.role !== "admin" && user.id !== comment.userId) {
        throw { status: 403, message: "You don't have permission to delete or edit this comment" };
    }

    return comment;
}

export async function deleteComment(req,res){
    try {
        const comment = await deleteEditCommentValidate(req);
        await deleteCommentFromDb(comment.id);
        return res.status(200).json({
            message: "Comment deleted successfully"
        })
    }
    catch (err){
        return res.status(err.status|| 500).json({ errors: [{ msg: err.message || "Server error"}] });
    }
}

export async function editComment(req, res){
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { comment } = req.body;
        const commentFromDb = await deleteEditCommentValidate(req);
        const createdComment = await editCommentInDb(commentFromDb.id, comment);
        return res.status(200).json({
            message: "Comment edited successfully",
            comment: createdComment
        })
    } catch (err){
        return res.status(err.status|| 500).json({ errors: [{ msg: err.message || "Server error"}] });
    }
}