import {READER_FRONT} from "../config.js";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if(!token || !user){
    window.location.href = `${READER_FRONT}/sign-up.html`
}

if(user.role !== "admin"){
    window.location.href = `${READER_FRONT}/index.html`
}