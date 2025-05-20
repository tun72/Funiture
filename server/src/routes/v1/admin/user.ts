import express from "express";

import { getAllUsers } from "../../../controllers/admin/userController";
import { authorise } from "../../../middlewares/authorise";

const router = express.Router();
router.use(authorise(true, "ADMIN"));
router.get("/users", getAllUsers); // register

// router.post()

export default router;
