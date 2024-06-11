import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true,limit:"16kb" }));    
app.use(express.static("public"));
app.use(cookieParser());


//import router
import userRouter from "./routes/user.routes.mjs";
import  postRouter  from "./routes/post.routes.mjs";
import commentRouter from "./routes/comment.routes.mjs";



app.use("/api/v1/users",userRouter)
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/comments", commentRouter);


export  {app}


// http://res.cloudinary.com/moinuddin/image/upload/v1707590666/lo83tqskxoqgjnkn5vpe.png