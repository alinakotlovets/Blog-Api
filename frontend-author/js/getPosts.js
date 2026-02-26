import {API_BASE} from "../config.js";
import {getHeaders} from "./getHeaders.js";


const postBox = document.getElementById("posts");
const headers = getHeaders();

postBox.addEventListener("click", async (e)=>{
    const editBtn = e.target.closest(".edit-post-btn");
    if(!editBtn) return;
    e.preventDefault();
    const postId = editBtn.dataset.postId;
    window.location.href = `add-update-post.html?postId=${postId}`
})

postBox.addEventListener("click", async (e)=>{
    const deleteBtn = e.target.closest(".delete-post-btn");
    if(!deleteBtn) return;
    e.preventDefault();
    const postId = deleteBtn.dataset.postId;
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
        method: "DELETE",
        headers: headers
    })
    if(response.ok){
        const postItem = deleteBtn.closest("div");
        if(postItem) postItem.remove();
    }

})

postBox.addEventListener("click", (e)=>{
    const commentsBtn = e.target.closest(".post-comments")
    if(!commentsBtn) return;
    e.preventDefault();
    const postId = commentsBtn.dataset.postId;
    window.location.href = `comments.html?postId=${postId}`;
})


async function getPosts(){
    const response = await fetch(`${API_BASE}/posts`, {
        method:"GET",
        headers: headers
    } )
    const data = await response.json();

    if(data.posts){
        data.posts.forEach((post)=>{
            const postItem = document.createElement("div")
            postItem.innerHTML = `
            <h3>${post.title}</h3>
            <button class="delete-post-btn" data-post-id="${post.id}" >Delete</button>
            <button class="edit-post-btn" data-post-id="${post.id}">Edit</button>
            <button class=post-comments data-post-id="${post.id}">Comments</button>           
            `
            postBox.append(postItem);
        })
    }
}


getPosts();