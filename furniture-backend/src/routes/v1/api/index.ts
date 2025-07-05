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

export default router;
