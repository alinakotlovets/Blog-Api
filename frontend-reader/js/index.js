import {API_BASE, AUTHOR_LINK} from "../config.js";
import {getHeaders} from "./getHeaders.js";


async function showWelcome(){
    const navBox = document.getElementById("nav-box");
    const headers = getHeaders();
    const response = await fetch(`${API_BASE}/`,
        { method: "GET", headers });

    const data = await response.json();
    const welcomeText = document.createElement("h2");

    if(data.user){
        const userRole = data.user.role || data.role;
         if( userRole === "admin"){
             const authorPage = document.createElement("a");
             authorPage.href = `${AUTHOR_LINK}index.html`
             authorPage.innerText = "Author page"
             navBox.appendChild(authorPage);
         }
        const logOut = document.createElement("button");
        logOut.innerText = "Log out";
        welcomeText.innerText = `Welcome, ${data.user.username}!`;
        navBox.append(logOut, welcomeText);

        logOut.addEventListener("click", (e)=>{
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "sign-in.html";
        })
    } else {
        welcomeText.innerText = "Welcome, guest!";
        const guestContent = document.createElement("div");
        guestContent.innerHTML = `
        <a href="sign-in.html">Sign In</a>
        <a href="sign-up.html">Sign Up</ahre>
        `
        navBox.append(guestContent, welcomeText);
    }
}

async function getPosts(){
    const postsBox = document.getElementById("posts-list");
    const response = await fetch(`${API_BASE}/posts/public`);
    const data = await response.json();
    if(data.posts){
        data.posts.forEach((post)=>{
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
            postsBox.append(listItem);
        })
    }
}



showWelcome();
getPosts();