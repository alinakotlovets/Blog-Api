import {API_BASE} from "../config.js";
import {getHeaders} from "./getHeaders.js";

const commentsList = document.getElementById("comments-list");

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");
const headers =getHeaders();

commentsList.addEventListener("click", async (e)=>{
    const deleteBtn = e.target.closest(".delete-comment-btn")
    if(!deleteBtn) return;
    e.preventDefault();
    const commentId = deleteBtn.dataset.commentId;
    const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: "DELETE",
        headers: headers
    })

    if(response.ok){
        const comment = deleteBtn.closest("li");
        if(comment) comment.remove();
    }

})
async function getComments(){
    const response = await fetch(`${API_BASE}/comments/${postId}`, {
        method: "GET",
        headers: headers
    })
    const data = await response.json();

    if(data.comments.length > 0){
        data.comments.forEach((comment)=>{
            const commentItem = document.createElement("li");
            commentItem.innerHTML= `
            <h3>UserId: ${comment.userId}</h3>
            <h3>${comment.comment}</h3>
            <button class="delete-comment-btn" data-comment-id="${comment.id}">Delete</button>
            `
            commentsList.append(commentItem);
        })
    } else {
        const commentItem = document.createElement("li");
        commentItem.innerHTML= `
            <h3>There are no comments yet</h3>
            `
        commentsList.append(commentItem);
    }

    if(data.errors){
        data.errors.forEach((error)=>{
            const commentItem = document.createElement("li");
            commentItem.innerHTML= `
            <h3>${error.msg}</h3>
            `
            commentsList.append(commentItem);
        })
    }

}


getComments();