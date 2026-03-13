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
    commentsList.innerHTML  = "";
    const loadingMessage = document.createElement("p");
    loadingMessage.innerText = "The server is waking up now. Wait a minute or two, if that doesn't work try refreshing the page.";
    commentsList.append(loadingMessage);
    try {
        const response = await fetch(`${API_BASE}/comments/${postId}`, {
            method: "GET",
            headers: headers
        })
        const data = await response.json();

        loadingMessage.remove();
        if(data.comments.length > 0){
            data.comments.forEach((comment)=>{
                const commentItem = document.createElement("li");
                commentItem.classList.add("comment-item");
                commentItem.innerHTML= `
            <div>
            <h3>User: ${comment.user ? comment.user.username : "Anonym user"}</h3>
            <h3>Text: ${comment.comment}</h3>
            </div>
            <button class="red-btn delete-comment-btn" data-comment-id="${comment.id}">Delete</button>
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

    } catch (e){
        loadingMessage.remove();
        const commentItem = document.createElement("li");
        commentItem.innerHTML= e.message || "server error";
        commentsList.append(commentItem);
    }
}


getComments();