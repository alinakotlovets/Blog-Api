import {API_BASE} from "../config.js";
import {getHeaders} from "./getHeaders.js"
const editModal = document.getElementById("edit-modal");
const commentBox = document.getElementById("comment-list");
const editTextarea = document.getElementById("edit-comment-text");
const cancelBtn = document.getElementById("cancel-edit-btn");
const saveBtn = document.getElementById("save-edit-btn");
const errorBox = document.getElementById("errors-box");

let currentEditingComment = null;

commentBox.addEventListener("click", (e)=>{
    const editBtn = e.target.closest(".edit-comment-btn");
    if(!editBtn) return;

    const commentItem = editBtn.closest("li");
    const commentText = commentItem.querySelector(".comment-text").innerText;

    currentEditingComment = commentItem;
    editTextarea.value = commentText;

    editModal.style.display = "flex";
});


cancelBtn.addEventListener("click", ()=>{
    editModal.style.display = "none";
    currentEditingComment = null;
});

saveBtn.addEventListener("click", async (e)=>{
    if(!currentEditingComment) return;
    e.preventDefault();

    errorBox.innerHTML = "";
    const commentText = editTextarea.value;
    try {
        const commentId = currentEditingComment.querySelector(".edit-comment-btn").dataset.commentId;
        const response = await fetch(`${API_BASE}/comments/${commentId}`,{
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({comment: commentText})
        });

        const data = await response.json();
        if(data.errors){
            data.errors.forEach((error)=>{
                const errorText = document.createElement("p");
                errorText.innerText = error.msg;
                errorBox.append(errorText);
            })
            return;
        }
        if(data.comment){
            currentEditingComment.querySelector(".comment-text").innerText = data.comment.comment;
            editModal.style.display = "none";
            currentEditingComment = null;
        }

    } catch (e){
        const errorText = document.createElement("p");
        errorText.innerText = e.msg || "server error";
        errorBox.append(errorText);
    }

});