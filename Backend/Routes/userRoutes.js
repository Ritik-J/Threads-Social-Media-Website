import express from "express";

//files
import {
  followUnFollowUser,
  freezeAccount,
  getSuggestedUsers,
  getUserProfile,
  logoutUser,
  signupUser,
  updateProfile,
} from "../Controller/userController.js";
import { loginUser } from "../Controller/userController.js";
import { protectRoute } from "../MiddleWare/protectRoute.js";

const router = express.Router();

//get
router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);

//post
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, updateProfile);
router.put("/freeze", protectRoute, freezeAccount);

export default router;
