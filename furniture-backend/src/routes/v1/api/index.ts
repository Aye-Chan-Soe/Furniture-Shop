import express from "express";
import {
  changeLanguage,
  testPermission,
  uploadProfile,
  uploadProfileMultiple,
  uploadProfileOptimize,
  getMyPhoto,
} from "../../../controllers/api/profileController";
import { auth } from "../../../middlewares/auth";
import upload, { uploadMemory } from "../../../middlewares/uploadFile";
import {
  getPost,
  getPostsByPagination,
  getInfinitePostsByPagination,
} from "../../../controllers/api/postController";
import {
  getProduct,
  getProductsByPagination,
  getCategoryType,
} from "../../../controllers/api/productController";

const router = express.Router();

router.post("/change-Language", changeLanguage);
router.get("/test-permission", auth, testPermission);
router.patch("/profile/upload", auth, upload.single("Avatar"), uploadProfile);
router.patch(
  "/profile/upload/optimize",
  auth,
  upload.single("Avatar"),
  uploadProfileOptimize
);

router.patch(
  "/profile/upload/multiple",
  auth,
  upload.array("Avatar"),
  uploadProfileMultiple
);

router.get("/profile/my-photo", getMyPhoto); // Just for testing

router.get("/posts", auth, getPostsByPagination); // offset pagination
router.get("/posts/infinite", auth, getInfinitePostsByPagination); // Cursor-based Pagination
router.get("/posts/:id", auth, getPost);

router.get("/products/:id", auth, getProduct);
router.get("/products", auth, getProductsByPagination); // Cursor-based Pagination

router.get("/filter-type", auth, getCategoryType);
export default router;
