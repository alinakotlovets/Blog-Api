import {API_BASE} from "../config.js";
import {getHeaders} from "./getHeaders.js";
const postsBox = document.getElementById("posts-list");

function renderPost(post) {
    const listItem = document.createElement("li");
    listItem.classList.add("post-list-item")
    listItem.innerHTML = `
    <a class="post-title" href="postInfo.html?postId=${post.id}">${post.title}</a>
    <p class="text-12px text-grey">Aded by: ${post.user.username}</p>
    <p class="text-12px text-grey">${post.createdAt === post.updatedAt ? `Created at: ${post.formatedCreateDate}` : `Edited at: ${post.formatedUpdateDate}`}</p>
    `
    if(post.previewImage !== null){
        const img = document.createElement("img");
        img.src = post.previewImage
        img.classList.add("preview-img")
        listItem.append(img);
    }
    return listItem;
}

async function getPosts(){
    postsBox.innerHTML = "";
    const loadingMessage = document.createElement("p");
    loadingMessage.innerText = "The server is waking up now. Wait a minute or two, if that doesn't work try refreshing the page.";
    postsBox.append(loadingMessage);
    try {
        const response = await fetch(`${API_BASE}/posts/public`, {
            method: "GET",
            headers: getHeaders()
        });
        const data = await response.json();
        loadingMessage.remove();
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
        loadingMessage.remove();
        const errorText = document.createElement("p");
        errorText.innerText = e.message || "server error";
        postsBox.append(errorText);
    }
}



getPosts();