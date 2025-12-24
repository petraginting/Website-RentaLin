import express from "express";
import { protect } from "../middleware/auth.js";

import { getDashboardData } from "../controllers/owner/dashboard/dashboardController.js";
import upload from "../middleware/multer.js";
import { updateProfileImage } from "../controllers/updateProfileImage.js";

import {
  addProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProductById,
  toggleProductAvailability,
} from "../controllers/owner/ownerController.js";

const ownerRouter = express.Router();

ownerRouter.post("/add-product", upload.single("image"), protect, addProduct);
ownerRouter.get("/products", protect, getProduct);
ownerRouter.get("/product/:id", protect, getProductById);
ownerRouter.post("/toggle-product", protect, toggleProductAvailability);
ownerRouter.post("/delete-product", protect, deleteProduct);
ownerRouter.post("/edit-product/:id", upload.single("image"), protect, editProduct);
ownerRouter.get("/dashboard", protect, getDashboardData);
ownerRouter.post(
  "/update-image",
  upload.single("image"),
  protect,
  updateProfileImage
);

export default ownerRouter;
