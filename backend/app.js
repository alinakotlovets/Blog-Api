import express from "express";
import cors from "cors";
import signUpRouter from "./routes/signUpRouter.js";
import singInRouter from "./routes/singInRouter.js";
import indexRouter from "./routes/indexRouter.js";

const app = express();

app.use(cors({
    origin:  process.env.RIDER_FRONT_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/sign-in", singInRouter);
app.use("/sign-up", signUpRouter);
app.use("/", indexRouter);


const port = 3000;

app.listen(port, () => {
    console.log(`running at port: ${port}`)
})