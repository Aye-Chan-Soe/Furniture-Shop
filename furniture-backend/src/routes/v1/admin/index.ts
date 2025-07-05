import express from "express";
import { getAllUsers } from "../../../controllers/admin/userController";
import { setMaintenance } from "../../../controllers/admin/systemController";
import upload from "../../../middlewares/uploadFile";
import {
  createPost,
  deletePost,
  updatePost,
} from "../../../controllers/admin/Post/postController";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/maintenance", setMaintenance);

// CRUD for Posts
router.post("/posts", upload.single("image"), createPost); // Create
router.patch("/posts", upload.single("image"), updatePost); // Update
router.delete("/posts", deletePost);

export default router;
