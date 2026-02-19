import express from "express";
import {validateUser, addUser} from "../controllers/signUpController.js";

const signUpRouter = express.Router();

signUpRouter.post("/", validateUser, addUser);

export default signUpRouter;