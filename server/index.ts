import express from "express";
import morgan from "morgan";
import { createPostHandler, listPostsHandler } from "./handlers/postHandler";

const app = express();

app.use(express.json());

app.use(morgan("tiny"));

app.get("/posts", listPostsHandler);
app.post("/posts", createPostHandler);

app.listen(3000, () => {
  console.log("Server runing on port 3000");
});
