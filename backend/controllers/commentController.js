import {body, validationResult} from "express-validator";
import {addCommentToBd, getCommentsToPost} from "../lib/queries.js";


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

    await addCommentToBd(comment, parseInt(postId), userId);
    return res.status(200).json({
        message: "comment added successfully"
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
    return res.status(200).json({
        comments
    })
}