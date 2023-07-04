import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("tiny"));

app.listen(3000, () => {
  console.log("Server runing on port 3000");
});
