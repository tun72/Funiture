import express from "express";

import {
  changeLanguage,
  getMyPhoto,
  testPermission,
  uploadProfile,
  uploadProfileMultiple,
  uploadProfileOptimize,
} from "../../../controllers/api/profileController";
import { auth } from "../../../middlewares/auth";
import upload, { uploadMemory } from "../../../middlewares/uploadFile";

const router = express.Router();

router.post("/change-language", changeLanguage); // register
router.get("/test-permission", auth, testPermission);

router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile);

router.patch(
  "/profile/upload/optimize",
  auth,
  uploadMemory.single("avatar"),
  uploadProfileOptimize
);

router.patch(
  "/profile/upload/multiple",
  auth,
  upload.array("avatar"),
  uploadProfileMultiple
);

// testing
router.get("/profile/myphoto/:photo", getMyPhoto);

// router.post()

export default router;
