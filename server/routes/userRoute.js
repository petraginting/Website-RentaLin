import express from "express";
import { protect } from "../middleware/auth.js";

import {
  getProducts,
  getUserData,
  loginUser,
  logoutUser,
  registerUser,
  updateProfileUser,
  updateUserPassword,
} from "../controllers/user/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", protect, logoutUser);
userRouter.post("/profile", protect, updateProfileUser);
userRouter.post("/update-password", protect, updateUserPassword);
userRouter.get("/data", protect, getUserData);
userRouter.get("/products", getProducts);

export default userRouter;
