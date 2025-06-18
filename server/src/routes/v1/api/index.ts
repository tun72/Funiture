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
import {
  getInfinitePostByPagination,
  getPost,
  getPostByPagination,
} from "../../../controllers/api/postController";
import {
  getProduct,
  getProductsByPagination,
} from "../../../controllers/api/productController";
import { getCategotyAndType } from "../../../controllers/api/categoryTypeController";

const router = express.Router();

router.post("/change-language", changeLanguage); // register
router.get("/test-permission", auth, testPermission);

router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile);

router.patch(
  "/profile/upload/optimize",
  auth,
  upload.single("avatar"),
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

// post
router.get("/posts/offset", auth, getPostByPagination); // offset Pagination

router.get("/posts/cursor", auth, getInfinitePostByPagination); // Cursor-based pagination

router.get("/posts/:id", auth, getPost);

router.get("/posts", auth, getInfinitePostByPagination); // Cursor-based pagination

// router.post()

// product
router.get("/products/:id", auth, getProduct);

router.get("/products", auth, getProductsByPagination); // Cursor-based pagination

router.get("/filter-type", auth, getCategotyAndType);

export default router;
