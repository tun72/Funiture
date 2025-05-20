import express from "express";

import { getAllUsers } from "../../../controllers/admin/userController";
import { setMaintenance } from "../../../controllers/admin/settingController";

const router = express.Router();

router.get("/users", getAllUsers); // register
router.post("/maintenance", setMaintenance);

// router.post()

export default router;
