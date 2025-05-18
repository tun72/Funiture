import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createOtp, getUserByPhone } from "../services/authServices";
import { checkUserExist } from "../utils/auth";
import { generateOTP, generateToken } from "../utils/generate";

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

    const otp = generateOTP();
    const token = generateToken();

    const result = await createOtp({
      phone,
      otp,
      rememberToken: token,
      count: 1,
    });

    res
      .status(200)
      .json({
        message: `Sending otp to 09${result.phone}`,
        phone: result.phone,
        token: result.rememberToken,
      });
    next();
  },
];

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({});
};

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
