import {API_BASE} from "../config.js";
import {getHeaders} from "./getHeaders.js";

const addUpdateForm = document.getElementById("add-update-form");
const errorsBox = document.querySelector(".errors-box");

document.getElementById("previewImage").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(file){
        const img = document.getElementById("previewImagePreview");
        img.src = URL.createObjectURL(file);
        img.style.display = "block";
    }
});

const headers = getHeaders();
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");
if(postId){
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
        method: "GET",
        headers: headers
    })

    const data = await response.json();
    if(data.post){
        console.log(data.post)
        document.getElementById("title").value = data.post.title;
        document.getElementById("content").value = data.post.content;
        document.getElementById("isPublic").checked = data.post.isPublic;
        if(data.post.previewImage){
            const img = document.getElementById("previewImagePreview");
            img.src = data.post.previewImage;
            img.style.display = "block";
        }
    }
}

addUpdateForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const method = postId ? "PUT" : "POST";
    const url = postId ? `${API_BASE}/posts/${postId}` : `${API_BASE}/posts`;
    const formData = new FormData(addUpdateForm);
    const response = await fetch(url, {
        method: method,
        headers: headers,
        body: formData
    });

    const data = await response.json();
    if(data.errors && data.errors.length > 0){
        errorsBox.innerHTML = "";
        data.errors.forEach((error)=>{
            const errorText = document.createElement("p");
            errorText.innerText = error.msg;
            errorsBox.append(errorText);
        })
    }

    if(data.message){
     window.location.href = "index.html"
    }
})
