import express from "express";
import cors from "cors";
import signUpRouter from "./routes/signUpRouter.js";
import singInRouter from "./routes/singInRouter.js";
import indexRouter from "./routes/indexRouter.js";
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentRouter.js";

const app = express();

app.use(cors({
    origin:  process.env.RIDER_FRONT_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/comments", commentRouter);
app.use("/posts", postRouter);
app.use("/sign-in", singInRouter);
app.use("/sign-up", signUpRouter);
app.use("/", indexRouter);


const port = 3000;

app.listen(port, () => {
    console.log(`running at port: ${port}`)
})