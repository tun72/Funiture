import express from "express";

import { getAllUsers } from "../../../controllers/admin/userController";

const router = express.Router();

router.get("/users", getAllUsers); // register

// router.post()

export default router;
