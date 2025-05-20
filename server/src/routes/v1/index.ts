import express from "express";
import authRoute from "./auth";
import viewRoute from "./web/view";
import adminRoute from "./admin";
import userRoute from "./api";

import { auth } from "../../middlewares/auth";
import { authorise } from "../../middlewares/authorise";
import { maintenance } from "../../middlewares/maintenance";

const router = express.Router();
// app.use("/api/v1", healthRoute);

// admin
router.use("/api/v1/admin", auth, authorise(true, "ADMIN"), adminRoute);

// user
router.use("/api/v1/user", userRoute);

// auth
router.use("/api/v1", authRoute);

// maintenance route
// router.use(
//   "/api/v1/admin",
//   maintenance,
//   auth,
//   authorise(true, "ADMIN"),
//   adminRoute
// );

// // user
// router.use("/api/v1/user", maintenance, userRoute);

// // auth
// router.use("/api/v1", maintenance, authRoute);

router.use(viewRoute);

export default router;
