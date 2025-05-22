import express from "express";

import { getAllUsers } from "../../../controllers/admin/userController";
import { setMaintenance } from "../../../controllers/admin/settingController";
import upload from "../../../middlewares/uploadFile";
import {
  createPost,
  deletePost,
  updatePost,
} from "../../../controllers/admin/postController";
import { createProduct } from "../../../controllers/admin/productController";

const router = express.Router();

router.get("/users", getAllUsers); // register
router.post("/maintenance", setMaintenance);

// router.post()

// CRUD for posts
router.post("/posts", upload.single("image"), createPost);
router.patch("/posts", upload.single("image"), updatePost);
router.delete("/posts", deletePost);

// CRUD for posts
router.post("/products", upload.array("images", 4), createProduct);
// router.patch("/products", upload.array("image", 4), updateProduct);
// router.delete("/products", deleteProduct);

export default router;
