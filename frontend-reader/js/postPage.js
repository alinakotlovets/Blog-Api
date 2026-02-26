import {API_BASE} from "../config.js";
import {getHeaders} from "./getHeaders.js";

const postBox = document.getElementById("post-info-box");
const commentForm = document.getElementById("comment-form");
const commentBox = document.getElementById("comment-list");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");
const headers = getHeaders();
async function getPostInfo(){
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
        method: "GET",
        headers: headers
    })

    const data = await response.json();
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
}
commentForm.addEventListener("submit", async (e)=>{
    const userFromStorage = localStorage.getItem("user");
    const user = userFromStorage ? JSON.parse(userFromStorage) : null;
    let userId = user ? user.id : null;
    e.preventDefault();
    const response = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            comment: document.getElementById("comment").value,
            postId: postId
        })

    })

    const data = await response.json();
   if(data.comment){
       document.getElementById("comment").value = "";
       const commentItem = document.createElement("li");
       commentItem.innerHTML= `
            <h3>Username: ${data.comment.user && data.comment.user.username ? data.comment.user.username : 'Anonymous user'}</h3>
            <p>Added at: ${data.comment.formatedDate}</p>
            <h3>${data.comment.comment}</h3>
            `

       if(data.comment.user && userId === data.comment.userId){
           const deleteBtn =document.createElement("button");
           deleteBtn.innerText ="Delete";
           deleteBtn.classList.add("delete-comment-btn");
           deleteBtn.dataset.commentId = data.comment.id;
           commentItem.append(deleteBtn);
       }
       commentBox.append(commentItem);
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
    const userFromStorage = localStorage.getItem("user");
    const user = userFromStorage ? JSON.parse(userFromStorage) : null;
    let userId = user ? user.id : null;
    const  response = await fetch(`${API_BASE}/comments/${postId}`, {
        method: "GET",
        headers: headers
    })
    const data = await response.json();
    if(data.comments){
        data.comments.forEach((comment)=>{
            const commentItem = document.createElement("li");
            commentItem.innerHTML= `
           <h3>Username: ${comment.user && comment.user.username ? comment.user.username : 'Anonymous user'}</h3>
            <p>Added at: ${comment.formatedDate}</p>
            <h3>${comment.comment}</h3>
            `
            if(comment.user && userId === comment.userId){
                const deleteBtn =document.createElement("button");
                deleteBtn.innerText ="Delete";
                deleteBtn.classList.add("delete-comment-btn");
                deleteBtn.dataset.commentId = comment.id;
                commentItem.append(deleteBtn);
            }
            commentBox.append(commentItem);
        })
    }
}


getPostInfo();
getComments();