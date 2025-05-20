import express from "express";
import authRoute from "./auth";
import viewRoute from "./web/view";
import adminRoute from "./admin";
import userRoute from "./api";

import { auth } from "../../middlewares/auth";
import { authorise } from "../../middlewares/authorise";

const router = express.Router();
// app.use("/api/v1", healthRoute);

// auth
router.use("/api/v1", authRoute);

// admin
router.use("/api/v1/admin", auth, authorise(true, "ADMIN"), adminRoute);

// user
router.use("/api/v1", userRoute);

router.use(viewRoute);

export default router;
