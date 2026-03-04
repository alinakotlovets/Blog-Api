import {prisma} from "./prisma.js";
import {response} from "express";

export async function addUserToDb(username, password, role){
    return prisma.user.create({data: {
            username: username,
            password: password,
            role: role
        }})
}

export async function getUserByUsername(username){
    return prisma.user.findUnique({where: {username: username}});
}

export async function addPostToDb(title, content, previewImage, isPublic, authorId){
    return prisma.post.create({data: {
                title: title,
                content: content,
                previewImage: previewImage,
                isPublic: isPublic,
                authorId: authorId
            }})
}

export async function editPostInDb(postId, title, content, previewImage, isPublic){
    let updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (previewImage !== undefined) updateData.previewImage = previewImage;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    return prisma.post.update({
        where: { id: postId },
        data: updateData
    });
}

export async function getAllAuthorPosts(authorId){
    return prisma.post.findMany({where:{authorId: authorId}})
}

export async function getPostByIdFromDb(postId){
    return prisma.post.findUnique({
            where: {id: postId},
            include: {user: {
                select: {username: true}
                }
            }
        }
    );
}

export async function deletePostFromDb(postId){
    return prisma.$transaction(async (tx)=>{
        await  tx.comment.deleteMany({where:{postId: postId}});
        await tx.post.delete({where: {id: postId}})
    })
}

export async function getPublicPostsFromDb(){
    return prisma.post.findMany({where:{isPublic: true}})
}


export async function addCommentToDb(comment, postId, userId){
    return prisma.comment.create({
        data: {
            comment: comment,
            postId: postId,
            userId: userId
        },
        include: {
         user:{
             select:{
                 username: true
             }
         }
        }
    })
}

export async function getCommentsToPost(postId){
    return prisma.comment.findMany(
        {where: {postId: postId},
            include:{
            user:{
                select:{
                    id: true,
                    username: true
                }
            }
        }
        })
}

export async function deleteCommentFromDb(commentId){
    return prisma.comment.delete({where: {id: commentId}})
}

export async function getCommentById(commentId){
    return prisma.comment.findUnique({where: {id: commentId}})
}

export async function editCommentInDb(commentId, comment){
    return prisma.comment.update({where: {id: commentId}, data:{comment:comment}})
}