import express from "express";
import {validateUser, postSignIn} from "../controllers/signInController.js";

const singInRouter = express.Router();

singInRouter.post("/", validateUser, postSignIn);

export default singInRouter;