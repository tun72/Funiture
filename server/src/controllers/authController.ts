import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  createOtp,
  createUser,
  getOtpByPhone,
  getUserById,
  getUserByPhone,
  updateOtp,
  updateUser,
} from "../services/authService";
import {
  checkOtpErrorItSameDate,
  checkOtpRow,
  checkUserExist,
  checkUserIfNotExist,
} from "../utils/auth";
import { generateOTP, generateToken } from "../utils/generate";
import bcrypt from "bcrypt";
import moment from "moment";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { errorCode } from "../../config/errorCode";
import { createError } from "../utils/error";

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
      return next(createError(errors[0].msg, 400, errorCode.invalid));
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
    console.log(otp);

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
        //   return next(
        //   createError(
        //    req.t("wrongPassword"),
        //     401,
        //     errorCode.invalid
        //   )
        // );
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
  body("token", "Invalid token").trim("").notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
      // console.log(errors);
      return next(createError(errors[0].msg, 400, errorCode.invalid));
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

    const isOTPExpired =
      moment().diff(moment(otpRow!.updatedAt), "minutes") > 2;

    if (isOTPExpired) {
      return next(createError("Otp is expired", 403, errorCode.otpExpired));
    }

    if (otpRow?.rememberToken !== token) {
      await updateOtp(otpRow!.id, { error: 5 });
      return next(createError("Invalid Token", 400, errorCode.invalid));
    }

    const isMatchOtp = await bcrypt.compare(otp, otpRow!.otp);

    if (!isMatchOtp) {
      if (!isSameDate) {
        await updateOtp(otpRow!.id, { error: 1 });
      } else {
        await updateOtp(otpRow!.id, { error: { increment: 1 } });
      }
      return next(createError("Otp is not correct", 400, errorCode.wrongOtp));
    }

    const verifyToken = generateToken();
    const result = await updateOtp(otpRow!.id, {
      verifyToken,
      error: 0,
      count: 1,
    });

    res.status(200).json({
      message: "OTP is successfully verified!",
      phone: result.phone,
      verifyToken: result.verifyToken,
    });
  },
];

export const confirmPassword = [
  body("password", "Please provide a password.")
    .trim("")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be minium of 8 characters."),

  body("phone", "Invalid phone Number")
    .trim("")
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone number invalid."),
  body("token", "Invalid token").trim("").notEmpty().escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      // console.log(errors);
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { phone, password, token } = req.body;

    const user = await getUserByPhone(phone);
    checkUserExist(user);

    const otpRow = await getOtpByPhone(phone);
    checkOtpRow(otpRow);

    if (otpRow!.error >= 5) {
      return next(
        createError("This request may be attack.", 400, errorCode.attack)
      );
    }

    if (otpRow!.verifyToken !== token) {
      return next(
        createError("This request may be attack.", 400, errorCode.attack)
      );
    }

    const isExpired = moment().diff(moment(otpRow!.updatedAt), "minutes") > 10;

    if (isExpired) {
      return next(
        createError(
          "Your request is expired. Please try again.",
          403,
          errorCode.otpExpired
        )
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser({
      password: hashPassword,
      phone,
      randToken: "random-token",
    });

    const assessTokenPayload = { id: newUser.id };
    const refreshTokenPayload = { id: newUser.id, phone: newUser.phone };

    const accessPrivate = process.env.ACCESS_SECRET_KEY;
    const refreshPrivate = process.env.REFRESH_SECRET_KEY;
    const accessToken = jwt.sign(assessTokenPayload, accessPrivate!, {
      expiresIn: 60 * 15,
    });
    const refreshToken = jwt.sign(refreshTokenPayload, refreshPrivate!, {
      expiresIn: "30d",
    });

    await updateUser(newUser.id, { randToken: refreshToken });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "User account successfully created",
        data: {
          userId: newUser.id,
        },
      });
  },
];

export const login = [
  body("password", "Please provide a password.")
    .trim("")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be minium of 8 characters."),

  body("phone", "Invalid phone Number")
    .trim("")
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone number invalid."),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    let { phone, password } = req.body;

    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    if (user!.status === "FREEZE") {
      return next(
        createError(
          "Your account is locked. Please contact us.",
          401,
          errorCode.accountFreeze
        )
      );
    }

    const isMatchPassword = await bcrypt.compare(password, user!.password);

    if (!isMatchPassword) {
      const lastOtpReq = new Date(user!.updatedAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();

      const isSameDate = lastOtpReq === today;

      let userData;
      if (!isSameDate) {
        userData = {
          errorLoginCount: 1,
        };
      } else {
        if (user!.errorLoginCount >= 2) {
          userData = {
            status: "FREEZE",
          };
        } else {
          userData = {
            errorLoginCount: { increment: 1 },
          };
        }
      }
      await updateUser(user!.id, userData);

      return next(createError(req.t("wrongPassword"), 401, errorCode.invalid));
    }

    const assessTokenPayload = { id: user!.id };
    const refreshTokenPayload = { id: user!.id, phone: user!.phone };

    const accessPrivate = process.env.ACCESS_SECRET_KEY;
    const refreshPrivate = process.env.REFRESH_SECRET_KEY;
    const accessToken = jwt.sign(assessTokenPayload, accessPrivate!, {
      expiresIn: 60 * 15,
    });
    const refreshToken = jwt.sign(refreshTokenPayload, refreshPrivate!, {
      expiresIn: "30d",
    });

    const userData = {
      errorLoginCount: 0,
      randToken: refreshToken,
    };

    await updateUser(user!.id, userData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000,
        path: "/",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      })
      .status(201)
      .json({
        message: "Login Success",
        data: {
          userId: user!.id,
        },
      });
  },
];

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    return next(
      createError(
        "Your are not an authenticated user.",
        401,
        errorCode.unauthenticated
      )
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as {
      id: number;
      phone: string;
    };
  } catch (e) {
    return next(
      createError(
        "Your are not an authenticated user.",
        401,
        errorCode.unauthenticated
      )
    );
  }

  if (isNaN(decoded.id)) {
    return next(
      createError(
        "Your are not an authenticated user.",
        401,
        errorCode.unauthenticated
      )
    );
  }

  const user = await getUserById(decoded.id);
  checkUserIfNotExist(user);

  if (user!.phone !== decoded.phone) {
    return next(
      createError(
        "Your are not an authenticated user.",
        401,
        errorCode.unauthenticated
      )
    );
  }

  const userData = {
    randToken: generateToken(),
  };

  await updateUser(user!.id, userData);
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
  });

  res.status(201).json({
    message: "Logout Success. See you soon.",
  });
};

export const forgetPassword = [
  body("phone", "Invalid phone Number")
    .trim("")
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone number invalid."),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    // return res.status(200).json({message : "success"})
    let phone = req.body.phone;

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    let otpRow = await getOtpByPhone(phone);

    let result;

    if (!otpRow) {
      return next(
        createError("This request may be attack.", 400, errorCode.attack)
      );
    }

    const otp = generateOTP();
    console.log(otp);

    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otp.toString(), salt);
    const token = generateToken();

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
      result = await updateOtp(otpRow.id, {
        otp: hashOtp,
        rememberToken: token,
        count: { increment: 1 },
      });
    }

    res.status(200).json({
      message: `Sending otp to 09${result.phone}`,
      phone: result.phone,
      token: result.rememberToken,
    });
  },
];

export const verify = [
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
  body("token", "Invalid token").trim("").notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { phone, otp, token } = req.body;

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    const otpRow = await getOtpByPhone(phone);
    checkOtpRow(otpRow);

    const lastOtpVerify = new Date(otpRow!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const isSameDate = lastOtpVerify === today;
    checkOtpErrorItSameDate(isSameDate, otpRow!.error, otpRow!.count);

    const isOTPExpired =
      moment().diff(moment(otpRow!.updatedAt), "minutes") > 2;

    if (isOTPExpired) {
      return next(createError("Otp is expired", 403, errorCode.otpExpired));
    }

    if (otpRow?.rememberToken !== token) {
      await updateOtp(otpRow!.id, { error: 5 });
      return next(createError("Invalid Token", 400, errorCode.invalid));
    }

    const isMatchOtp = await bcrypt.compare(otp, otpRow!.otp);

    if (!isMatchOtp) {
      if (!isSameDate) {
        await updateOtp(otpRow!.id, { error: 1 });
      } else {
        await updateOtp(otpRow!.id, { error: { increment: 1 } });
      }
      return next(createError("Otp is not correct", 400, errorCode.wrongOtp));
    }

    const verifyToken = generateToken();
    const result = await updateOtp(otpRow!.id, {
      verifyToken,
      error: 0,
      count: 1,
    });

    res.status(200).json({
      message: "OTP is successfully verified! Please reset password.",
      phone: result.phone,
      verifyToken: result.verifyToken,
    });
  },
];

export const resetPassword = [
  body("password", "Please provide a password.")
    .trim("")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be minium of 8 characters."),
  body("phone", "Invalid phone Number")
    .trim("")
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone number invalid."),
  body("token", "Invalid token").trim("").notEmpty().escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { phone, password, token } = req.body;

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);
    const otpRow = await getOtpByPhone(phone);
    checkOtpRow(otpRow);

    if (otpRow!.error >= 5) {
      return next(
        createError("This request may be attack.", 409, errorCode.attack)
      );
    }

    if (otpRow!.verifyToken !== token) {
      return next(
        createError("This request may be attack.", 409, errorCode.attack)
      );
    }

    const isExpired = moment().diff(moment(otpRow!.updatedAt), "minutes") > 5;

    if (isExpired) {
      return next(
        createError(
          "Your request is expired. Please try again.",
          403,
          errorCode.otpExpired
        )
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await updateUser(user!.id, {
      password: hashPassword,
      randToken: generateToken(),
    });

    await updateOtp(otpRow!.id, {
      otp: generateToken(),
      verifyToken: generateToken(),
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    res.status(201).json({
      message: "Password Changed Successfully",
      data: {
        userId: user!.id,
      },
    });
  },
];

interface CustomRequest extends Request {
  userId?: number;
}

export const authCheck = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  //   throw new Error("Error Error");

  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);
  res.status(200).json({
    message: "User is authenticated ✅ ",
    userId: user!.id,
    username: user!.firstName + " " + user!.lastName,
    image: user!.image,
  });
};
