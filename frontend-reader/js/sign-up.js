import {API_BASE} from "../config.js";

const signUpForm = document.querySelector(".sign-up-form");
const errorsBox = document.getElementById("sign-up-errors");

signUpForm.addEventListener("submit", async (e) =>{
    errorsBox.innerHTML = "";
    e.preventDefault();
    const response = await fetch(`${API_BASE}/sign-up`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            confirmPassword: document.getElementById("confirmPassword").value
        })
    })

    const data = await response.json();
    if(data.errors && data.errors.length > 0){
        data.errors.forEach((error)=>{
            const errorText = document.createElement("p");
            errorText.innerText = error.msg;
            errorsBox.append(errorText);
        })
    }
    if(data.redirectTo){
        window.location.href = data.redirectTo;
    }
})