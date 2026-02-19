import {API_BASE} from "../config.js";

const contentBox = document.getElementById("content-box");
const token = localStorage.getItem("token");

async function showWelcome(){
    const headers = {"Content-Type": "application/json"};
    if(token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}/`,
        { method: "GET", headers });

    const data = await response.json();
    const welcomeText = document.createElement("h2");

    if(data.user){
        const logOut = document.createElement("button");
        logOut.innerText = "Log out";
        welcomeText.innerText = `Welcome, ${data.user.username}!`;
        contentBox.append(logOut);

        logOut.addEventListener("click", (e)=>{
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "sign-in.html";
        })
    } else {
        welcomeText.innerText = "Welcome, guest!";
    }
    contentBox.append(welcomeText);
}

showWelcome();
