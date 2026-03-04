import { describe, test, expect} from "@jest/globals";
import request from "supertest";
import express from "express";
import indexRouter from "../routes/indexRouter.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
process.env.SECRET_KEY = "test_secret_key";
describe("Index route tests", () => {
    test("GET / without token returns message only", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "You on Home page!" });
    });

    test("GET / with valid token returns message with user", async () => {
        const token = jwt.sign(
            { userId: 1, username: "Alina", role: "admin" },
            process.env.SECRET_KEY
        );

        const res = await request(app)
            .get("/")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: "You on Home page!",
            user: { id: 1, username: "Alina", role: "admin" }
        });
    });
});