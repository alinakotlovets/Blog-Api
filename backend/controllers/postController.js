import {body, matchedData, validationResult} from "express-validator";
import {addPostToBd, editPostInBd, getAllAuthorPosts, getPostByIdFromDb, deletePostFromDb, getPublicPostsFromDb} from "../lib/queries.js";
import cloudinary from "../middleware/cloudinary.js";
export const validatePost = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({min: 4, max: 50}).withMessage("Title should be at least 4 letter and no more than 50 letters"),
    body("content")
        .trim()
        .notEmpty().withMessage("Content of post is required")
        .isLength({min: 50, max: 2000}).withMessage("Content should be at least 50 letter and no more than 2000 letters"),
    body("isPublic").optional()
]


function validateData(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    if(!req.user || req.user.role !== "admin"){
        return res.status(403).json({
            errors: [{msg: "you dont have permission to access this page"}]
        })
    }

    let {title, content, isPublic} = matchedData(req);
    isPublic = isPublic === "on";


    return { title, content, isPublic };
}


export async function addPost(req, res){
    const data = await validateData(req, res);
    if (!data) return;
    let previewImg = null;
    if (req.file) {
        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
                folder: "blog"
            }
        );
        previewImg = result.secure_url;
    }


    await addPostToBd(data.title, data.content, previewImg, data.isPublic, parseInt(req.user.id));
    return  res.status(200).json({
        message: "post added!"
    })
}

export async function editPost(req, res){
    const {postId} = req.params;
    if(!postId){
        return res.status(404).json({errors: [{msg: "post noy found"}]})
    }

    const data = await validateData(req, res);
    if (!data) return;

    let {title, content, previewImage, isPublic} = req.body;
    isPublic = isPublic === "on";
    let previewImg;
    if (req.file) {
        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            { folder: "blog" }
        );
        previewImg = result.secure_url;
    }

    await editPostInBd(parseInt(postId), title, content, previewImg, isPublic, parseInt(req.user.id));
    return  res.status(200).json({
        message: "post edit!"
    })
}


export async function getPostsByAuthors(req, res){
    if(!req.user){
        return res.status(401).json({
            errors: [{msg: "Unauthorized"}]
        })
    }
    const userId = req.user.id;
    if(!userId){
        return res.status(404).json({
            errors: [{msg: "Not found post from this user"}]
        })
    }

    const posts = await getAllAuthorPosts(parseInt(userId));
    if(!posts){

    }
    const postsWithFormatedDates = posts.map((post) => {
        return {
            ...post,
            formatedCreateDate: new Intl.DateTimeFormat("uk-UA", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(post.createdAt)),
            formatedUpdateDate: new Intl.DateTimeFormat("uk-UA", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(post.updatedAt))
        };
    });

    return res.status(200).json({ posts: postsWithFormatedDates });
}

export async function getPostById(req, res){
    const {postId} = req.params
    if(!postId){
        return res.status(404).json({ errors: [{ msg: "Posts not found" }]
        });
    }

    const post = await getPostByIdFromDb(parseInt(postId));
    if(!post){
        return res.status(404).json({ errors: [{ msg: "Post not found" }] });
    }
    const postWithFormatedDate = {
        ...post,
        formatedCreateDate: new Intl.DateTimeFormat("uk-UA", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(post.createdAt)),
        formatedUpdateDate: new Intl.DateTimeFormat("uk-UA", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(post.updatedAt))
    };
    return res.status(200).json({
        post: postWithFormatedDate
    })
}

export async function deletePost(req, res){
    const {postId} = req.params
    if(!postId){
        return res.status(400).json({
            errors: [{msg: "Post id is required"}]
        })
    }
    await deletePostFromDb(parseInt(postId));
    return res.status(200).json({
        message: "post deleted successfully"
    })
}

export async function getPublicPosts(req, res){
    const posts = await getPublicPostsFromDb();
    if(!posts){
        return res.status(404).json({errors:[{msg:"posts not found"}]})
    }
    return res.status(200).json({posts})
}