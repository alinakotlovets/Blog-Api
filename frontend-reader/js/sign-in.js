import {API_BASE} from "../config.js";
const signInForm = document.querySelector(".sign-in-form");
const errorsBox = document.getElementById("sign-in-errors");

signInForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    try {
        const username =  document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const response = await fetch(`${API_BASE}/sign-in`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                password
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
            return;
        }

        if(data.token){
            localStorage.setItem("token", data.token);
            const payloadBase64 = data.token.split(".")[1];
            const user = JSON.parse(atob(payloadBase64));
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = `index.html`;
        }
    } catch (e){
        errorsBox.innerHTML = "";
        const errorText = document.createElement("p");
        errorText.innerText = e.message || "server error";
        errorsBox.append(errorText);
    }
})