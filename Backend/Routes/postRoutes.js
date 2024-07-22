import express from "express";

//files
import {
  createPost,
  deletePost,
  getFeedPost,
  getPost,
  getUserPosts,
  likeUnlikePost,
  replyToPost,
} from "../Controller/postController.js";
import { protectRoute } from "../MiddleWare/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPost);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);

router.post("/create", protectRoute, createPost);

router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);

router.delete("/:id", protectRoute, deletePost);

export default router;
