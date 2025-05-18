import express from "express"

import { register, verifyOtp, confirmPassword, login } from "../../controllers/authController";

const router = express.Router();

router.post("/register", register) // register
router.post("/verify-otp", verifyOtp ) // verify
router.post("/comfirm-passsword", confirmPassword)
router.post("/login", login)
// router.post()

export default router