import express from "express";

import {
  register,
  verifyOtp,
  confirmPassword,
  login,
  logout,
  forgetPassword,
  verify,
  resetPassword,
} from "../../controllers/authController";

const router = express.Router();

router.post("/register", register); // register
router.post("/verify-otp", verifyOtp); // verify
router.post("/confirm-password", confirmPassword);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forget-password", forgetPassword);
router.post("/verify", verify);
router.post("/reset-password", resetPassword);

// router.post()

export default router;
