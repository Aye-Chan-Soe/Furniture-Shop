import express from "express";
import { getAllUsers } from "../../../controllers/admin/userController";
import { setMaintenance } from "../../../controllers/admin/systemController";
import upload from "../../../middlewares/uploadFile";
import {
  createPost,
  deletePost,
  updatePost,
} from "../../../controllers/admin/postController";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../controllers/admin/productController";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/maintenance", setMaintenance);

// CRUD for Posts
router.post("/posts", upload.single("image"), createPost); // Create
router.patch("/posts", upload.single("image"), updatePost); // Update
router.delete("/posts", deletePost);

// CRUD for Products
router.post("/products", upload.array("images", 4), createProduct); // Create, Maximum image 4
router.patch("/products", upload.array("images"), updateProduct); // Update
router.delete("/products", deleteProduct);

export default router;
