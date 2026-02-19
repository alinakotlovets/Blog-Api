import {API_BASE} from "../config.js";
const signInForm = document.querySelector(".sign-in-form");
const errorsBox = document.getElementById("sign-in-errors");

signInForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const response = await fetch(`${API_BASE}/sign-in`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    })
    const data = await response.json();
    errorsBox.innerHTML = "";
    if(data.errors && data.errors.length >0){
        data.errors.forEach((error)=>{
            const errorText = document.createElement("p");
            errorText.innerText = error.msg;
            errorsBox.append(errorText);
        })
    }

    if(data.redirectTo && data.token){
        localStorage.setItem("token", data.token);
        window.location.href = data.redirectTo;
    }

})