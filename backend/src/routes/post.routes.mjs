import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.mjs";
import {
  createPost,
  getAllPosts,
  getUserAllPosts,
  getPost,
  updatePost,
    deletePost,
  updateThumbnail,
  addLikes,
  getLikes,
  disLike
} from "../controllers/post.controller.mjs";
import { verifyJWT } from "../middlewares/auth.middleware.mjs";

const router = Router();
router.route("/create-post").post(verifyJWT,upload.single("thumbnail"), createPost);
router.route("/add-like/:postId").patch(verifyJWT, addLikes);
router.route("/dis-like/:postId").patch(verifyJWT, disLike);
router.route("/get-likes/:postId").get(getLikes);
router.route("/post/:postId").get(getPost);
router.route("/get-user-all-Post").get(verifyJWT,getUserAllPosts);
router.route("/all-posts").get(getAllPosts);
router.route("/update-post/:postId").patch(updatePost);
router.route("/update-thumbnail/:postId").patch(upload.single("thumbnail"), updateThumbnail);
router.route("/delete-post/:postId").delete( deletePost);
export default router;
