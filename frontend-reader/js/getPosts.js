import {API_BASE} from "../config.js";
import {getHeaders} from "./getHeaders.js";
const postsBox = document.getElementById("posts-list");

function renderPost(post) {
    const listItem = document.createElement("li");
    const title = document.createElement("a");
    title.innerText = post.title;
    title.href = `postInfo.html?postId=${post.id}`
    listItem.append(title);
    if(post.previewImage !== null){
        const img = document.createElement("img");
        img.src = post.previewImage
        listItem.append(img);
    }
    return listItem;
}

async function getPosts(){
    postsBox.innerHTML = "";
    try {
        const response = await fetch(`${API_BASE}/posts/public`, {
            method: "GET",
            headers: getHeaders()
        });
        const data = await response.json();
        if(data.errors){
            data.errors.forEach((error)=>{
                const errorText = document.createElement("p");
                errorText.innerText = error.msg;
                postsBox.append(errorText);
            })
            return;
        }

        if(data.posts){
            data.posts.forEach((post)=>{
                const listItem = renderPost(post);
                postsBox.append(listItem);
            })
        }
    } catch (e){
        const errorText = document.createElement("p");
        errorText.innerText = e.message || "server error";
        postsBox.append(errorText);
    }
}



getPosts();