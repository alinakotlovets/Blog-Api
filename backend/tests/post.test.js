import { describe, test, expect, jest } from "@jest/globals";
import request from "supertest";
import express from "express";

jest.unstable_mockModule("../lib/queries.js", () => ({
    getPublicPostsFromDb: jest.fn().mockResolvedValue([
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" }
    ]),
    addPostToDb: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    deletePostFromDb: jest.fn(),
    editPostInDb: jest.fn(),
    getAllAuthorPosts: jest.fn(),
    getPostByIdFromDb: jest.fn(),
}));

const { default: postRouter } = await import("../routes/postRouter.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/posts", postRouter);

describe("posts test", () => {
    test("GET /posts/public returns mocked posts", async () => {
        const res = await request(app).get("/posts/public");
        expect(res.statusCode).toBe(200);
        expect(res.body.posts).toEqual([
            { id: 1, title: "Post 1" },
            { id: 2, title: "Post 2" }
        ]);
    });
});