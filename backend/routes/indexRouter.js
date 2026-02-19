import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import {getIndexPageInfo} from "../controllers/indexController.js";


const indexRouter = express.Router();

indexRouter.get("/", verifyToken, getIndexPageInfo);
export default indexRouter;