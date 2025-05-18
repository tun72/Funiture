import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  createOtp,
  getOtpByPhone,
  getUserByPhone,
  updateOtp,
} from "../services/authServices";
import {
  checkOtpErrorItSameDate,
  checkOtpRow,
  checkUserExist,
} from "../utils/auth";
import { generateOTP, generateToken } from "../utils/generate";
import bcrypt from "bcrypt";

export const register = [
  body("phone", "Invalid phone Number")
    .trim("")
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone number invalid."),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      console.log(errors);
      const error: any = new Error(errors[0].msg);
      error.code = "Error_Invalid";
      error.status = 400;
      return next(error);
    }
    // return res.status(200).json({message : "success"})
    let phone = req.body.phone;

    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }

    const user = await getUserByPhone(phone);
    checkUserExist(user);

    const otpRow = await getOtpByPhone(phone);
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otp.toString(), salt);
    const token = generateToken();

    let result;
    if (!otpRow) {
      result = await createOtp({
        phone,
        otp: hashOtp,
        rememberToken: token,
        count: 1,
      });
    } else {
      const lastOtpReq = new Date(otpRow.updatedAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();

      const isSameDate = lastOtpReq === today;

      checkOtpErrorItSameDate(isSameDate, otpRow.error, otpRow.count);

      if (!isSameDate) {
        result = await updateOtp(otpRow.id, {
          otp: hashOtp,
          rememberToken: token,
          count: 1,
          error: 0,
        });
      } else {
        // else {
        result = await updateOtp(otpRow.id, {
          otp: hashOtp,
          rememberToken: token,
          count: { increment: 1 },
        });
        // }
        // if (otpRow.count === 5) {
        //   const error: any = new Error(
        //     "Otp is allowed to request 3 times per day."
        //   );
        //   error.status = 405;
        //   error.code = "Error_OverLimit";
        //   return next(error);
        // }
      }
    }

    res.status(200).json({
      message: `Sending otp to 09${result.phone}`,
      phone: result.phone,
      token: result.rememberToken,
    });
  },
];

export const verifyOtp = [
  body("phone", "Invalid phone Number")
    .trim("")
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone number invalid."),
  body("otp", "Invalid otp")
    .trim("")
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 6, max: 6 })
    .withMessage("Phone number invalid."),
  body("phone", "Invalid phone Number").trim("").notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      // console.log(errors);
      const error: any = new Error(errors[0].msg);
      error.code = "Error_Invalid";
      error.status = 400;
      return next(error);
    }

    const { phone, otp, token } = req.body;

    const user = await getUserByPhone(phone);
    checkUserExist(user);

    const otpRow = await getOtpByPhone(phone);
    checkOtpRow(otpRow);

    const lastOtpVerify = new Date(otpRow!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();

    const isSameDate = lastOtpVerify === today;
    checkOtpErrorItSameDate(isSameDate, otpRow!.error, otpRow!.count);

    let result;

    if (otpRow?.rememberToken !== token) {
      result = await updateOtp(otpRow!.id, { error: 5 });
      const error: any = new Error("Invalid Token");
      error.code = "Error_Invalid";
      error.status = 400;
      return next(error);
    }
  },
];

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({});
};

export const confirmPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({});
};
