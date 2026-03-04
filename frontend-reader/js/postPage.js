import {API_BASE} from "../config.js";
import {getHeaders} from "./getHeaders.js";

const postBox = document.getElementById("post-info-box");
const commentForm = document.getElementById("comment-form");
const commentBox = document.getElementById("comment-list");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");
const headers = getHeaders();

const getUser = localStorage.getItem("user");
const user = getUser ? JSON.parse(getUser) : null;
const userId = user?.userId || null;

async function getPostInfo(){
    postBox.innerHTML = "";
    try {
        const response = await fetch(`${API_BASE}/posts/${postId}`, {
            method: "GET",
            headers: headers
        })

        const data = await response.json();
        if(data.errors){
            data.errors.forEach((error)=>{
                const errorText = document.createElement("p");
                errorText.innerText = error.msg;
                postBox.append(errorText);
            })
            return;
        }

        if(data.post){
            const title = document.createElement("h3");
            title.innerText = data.post.title;
            const createdUpdatedAt = document.createElement("p");
            createdUpdatedAt.innerText = data.post.createdAt === data.post.updatedAt ? `Created at: ${data.post.formatedCreateDate}` : `Edited at: ${data.post.formatedUpdateDate}`
            const addedBy = document.createElement("h4")
            addedBy.innerText = `Added by: ${data.post.user.username}`;
            postBox.append(title,addedBy, createdUpdatedAt);
            if(data.post.previewImage !== null){
                const img = document.createElement("img");
                img.src = data.post.previewImage
                postBox.append(img);
            }
            const content = document.createElement("h4");
            content.innerText = data.post.content;
            postBox.append(content);
        }
    } catch (e){
        const errorText = document.createElement("p");
        errorText.innerText = e.message || "server error";
        postBox.append(errorText);
    }
}

function renderComment(comment){
    const commentItem = document.createElement("li");
    commentItem.innerHTML= `
            <h3>Username: ${comment.user && comment.user.username ? comment.user.username : 'Anonymous user'}</h3>
            <p>${comment.createdAt === comment.updatedAt ? `Created at: ${comment.formatedCreateDate}` : `Edited at: ${comment.formatedUpdateDate}`}</p>
            <h3 class="comment-text">${comment.comment}</h3>
            `
    if(comment.user && userId === comment.userId){
        const deleteBtn =document.createElement("button");
        deleteBtn.innerText ="Delete";
        deleteBtn.classList.add("delete-comment-btn");
        deleteBtn.dataset.commentId = comment.id;
        const editBtn =document.createElement("button");
        editBtn.innerText ="Edit";
        editBtn.classList.add("edit-comment-btn");
        editBtn.dataset.commentId = comment.id;

        commentItem.append(editBtn, deleteBtn);
    }
    return commentItem;
}
commentForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    try {
        const response = await fetch(`${API_BASE}/comments`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                comment: document.getElementById("comment").value,
                postId: postId
            })

        })

        const data = await response.json();
        if (data.errors){
            data.errors.forEach((error)=>{
                    const errorText = document.createElement("p");
                    errorText.innerText = error.msg;
                    commentBox.append(errorText);
            })
        }

        if(data.comment){
            document.getElementById("comment").value = "";
            const commentItem = renderComment(data.comment);
            commentBox.append(commentItem);
        }
    } catch (e){
        const errorText = document.createElement("p");
        errorText.innerText = e.message || "server error";
        commentBox.append(errorText);
    }
})


commentBox.addEventListener("click", async (e)=>{
    const deleteBtn = e.target.closest(".delete-comment-btn");
    if(!deleteBtn) return;
    e.preventDefault();
    const commentId= deleteBtn.dataset.commentId;
    const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method:"DELETE",
        headers: headers
    })
    if (response.ok) {
        const commentItem = deleteBtn.closest("li");
        if (commentItem) commentItem.remove();
    } else {
        console.log("Failed to delete comment");
    }
})

async function getComments(){
    commentBox.innerHTML = ""
    try {
        const  response = await fetch(`${API_BASE}/comments/${postId}`, {
            method: "GET",
            headers: headers
        })
        const data = await response.json();
        if(data.errors){
            data.errors.forEach((error)=>{
                const errorText = document.createElement("p");
                errorText.innerText = error.msg
                commentBox.append(errorText);
            })
            return;
        }

        if(data.comments){
            data.comments.forEach((comment)=>{
                const commentItem = renderComment(comment);
                commentBox.append(commentItem);
            })
        }
    } catch (e){
        const errorText = document.createElement("p");
        errorText.innerText = e.message || "server errors";
        commentBox.append(errorText);
    }
}


getPostInfo();
getComments();