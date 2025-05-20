import express from "express";

import {
  changeLanguage,
  testPermission,
} from "../../../controllers/api/profileController";
import { auth } from "../../../middlewares/auth";

const router = express.Router();

router.post("/change-language", changeLanguage); // register
router.get("/test-permission", auth, testPermission);

// router.post()

export default router;
