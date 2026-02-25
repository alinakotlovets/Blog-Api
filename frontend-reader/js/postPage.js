import {API_BASE} from "../config.js";
import {getHeaders} from "./getHeaders.js";

const postBox = document.getElementById("post-info-box");
const commentForm = document.getElementById("comment-form");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");
const headers = getHeaders()
async function getPostInfo(){
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
        method: "GET",
        headers: headers
    })

    const data = await response.json();
    if(data.post){
        const title = document.createElement("h3");
        title.innerText = data.post.title;
        const addedBy = document.createElement("h4")
        addedBy.innerText = `Added by: ${data.post.user.username}`;
        postBox.append(title,addedBy);
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
    e.preventDefault();
    const user = localStorage.getItem("user");
    let userId = !user ? null: user.id;
    const response = await fetch(`${API_BASE}/comments`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            comment: document.getElementById("comment").value,
            userId: userId,
            postId: postId
        })

    })

    const data = await response.json();
   if(data.message){
       document.getElementById("comment").value = "";
   }
})


async function getComments(){
    const commentBox = document.getElementById("comment-list");
    const  response = await fetch(`${API_BASE}/comments/${postId}`, {
        method: "GET",
        headers: headers
    })
    const data = await response.json();
    if(data.comments){
        data.comments.forEach((comment)=>{
            const commentItem = document.createElement("li");
            commentItem.innerHTML= `
            <h3>UserId: ${comment.userId}</h3>
            <h3>${comment.comment}</h3>
            `
            commentBox.append(commentItem);
        })
    }
}


getPostInfo();
getComments();