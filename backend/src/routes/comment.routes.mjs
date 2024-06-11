import { Router } from "express";
import {
  addComment,
  deleteComment,
  getPostComments,
  updateComment,
  addLikes,
  disLike,
  getLikes
} from "../controllers/comment.controller.mjs";
import { verifyJWT } from "../middlewares/auth.middleware.mjs";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:PostId").get(getPostComments).post(addComment);
router.route("/c/:CommentId").delete(deleteComment).patch(updateComment);
router.route("/like/:CommentId").patch(addLikes).get(getLikes);
router.route("/dislike/:CommentId").patch(disLike);



export default router;
