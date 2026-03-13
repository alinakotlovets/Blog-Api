import {AUTHOR_LINK} from "../config.js";
const navBox = document.getElementById("nav-box");
function handleLogout(e){
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "sign-in.html";
}
function renderLoggedUser(user){
    const userRole = user.role;
    const home = document.createElement("a");
    home.innerText = "Home";
    home.href = "index.html";
    navBox.append(home);
    if( userRole === "admin"){
        const authorPage = document.createElement("a");
        authorPage.href = `${AUTHOR_LINK}/index.html`
        authorPage.innerText = "Author page"
        navBox.appendChild(authorPage);
    }
    const logOut = document.createElement("button");
    logOut.innerText = "Log out";
    logOut.classList.add("log-out-btn")
    navBox.append(logOut);

    logOut.addEventListener("click", handleLogout);
}

function renderGuest(){
    const guestContent = document.createElement("div");
    guestContent.innerHTML = `
    <a href="index.html">Home</a>
    <a href="sign-in.html">Sign In</a>
    <a href="sign-up.html">Sign Up</a>
    `
    navBox.append(guestContent);
}


function showNavbar(){
    navBox.innerHTML = "";
    const getUser = localStorage.getItem("user");
    if(getUser){
        renderLoggedUser(JSON.parse(getUser));
    } else {
        renderGuest();
    }
}


showNavbar();