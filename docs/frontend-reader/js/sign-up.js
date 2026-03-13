import {API_BASE} from "../config.js";

const signUpForm = document.querySelector(".sign-up-form");
const errorsBox = document.getElementById("sign-up-errors");

signUpForm.addEventListener("submit", async (e) =>{
    e.preventDefault();
    try {
        const username =  document.getElementById("username").value;
        const password =  document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        errorsBox.innerHTML = "";
        const response = await fetch(`${API_BASE}/sign-up`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                password,
                confirmPassword
            })
        })

        const data = await response.json();
        if(data.errors && data.errors.length > 0){
            data.errors.forEach((error)=>{
                const errorText = document.createElement("p");
                errorText.innerText = error.msg;
                errorsBox.append(errorText);
            })
        } else {
            window.location.href = `sign-in.html`;
        }

    } catch (err){
        errorsBox.innerHTML = "";
        const errorText = document.createElement("p");
        errorText.innerText = err.message || "server error";
        errorsBox.append(errorText);
    }
})