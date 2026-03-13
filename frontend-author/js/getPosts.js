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
    postBox.innerHTML = "";
    const loadingMessage = document.createElement("p");
    loadingMessage.innerText = "The server is waking up now. Wait a minute or two, if that doesn't work try refreshing the page.";
    postBox.append(loadingMessage);
    try {
        const response = await fetch(`${API_BASE}/posts`, {
            method:"GET",
            headers: headers
        } )
        const data = await response.json();
        loadingMessage.remove();

        if (data.errors){
            data.errors.forEach((error)=>{
                const errorText = document.createElement("p");
                errorText.innerText = error.msg;
                postBox.append(errorText);
            })
        }

        if(data.posts){
            data.posts.forEach((post)=>{
                const postItem = document.createElement("div")
                postItem.innerHTML = `
            <h3>${post.title}</h3>
            <div class="post-item-btn-box">
            <button class="red-btn delete-post-btn" data-post-id="${post.id}" >Delete</button>
            <button class="blue-btn edit-post-btn" data-post-id="${post.id}">Edit</button>
            <button class="green-btn post-comments" data-post-id="${post.id}">Comments</button>     
            </div>      
            `
                postItem.classList.add("post-item")
                postBox.append(postItem);
            })
        }

    } catch (e){
        loadingMessage.remove();
        const errorText = document.createElement("p");
        errorText.innerText = e.message || "server error";
        postBox.append(errorText);
    }

}


getPosts();