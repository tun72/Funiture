import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { errorCode } from "../../config/errorCode";
import { getUserById, updateUser } from "../services/authService";
import { checkUserIfNotExist } from "../utils/auth";

interface CustomRequest extends Request {
  userId?: number;
}
export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  // for mobile
  // const platform = req.headers["x-platform"];
  // if (platform === "mobile") {
  //   accessToken = req.headers.authorization
  //     ? req.headers.authorization.split(" ")[1]
  //     : null;
  // } else {

  // }

  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    const error: any = new Error("You are not an authenticated user.");
    error.code = errorCode.unauthenticated;
    error.status = 401;
    return next(error);
  }

  const generateNewToken = async () => {
    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as {
        id: number;
        phone: string;
      };

      console.log(decoded);
    } catch (e) {
      console.log(e);
      const error: any = new Error("You are not an authenticated user.");
      error.code = errorCode.unauthenticated;
      error.status = 401;
      return next(error);
    }

    if (isNaN(decoded.id)) {
      const error: any = new Error("You are not an authenticated user.");
      error.code = errorCode.unauthenticated;
      error.status = 401;
      return next(error);
    }

    const user = await getUserById(decoded.id);
    checkUserIfNotExist(user);

    if (user!.phone !== decoded.phone) {
      const error: any = new Error("You are not an authenticated user.");
      error.code = errorCode.unauthenticated;
      error.status = 401;
      return next(error);
    }

    if (user!.randToken !== refreshToken) {
      const error: any = new Error("You are not an authenticated user.");
      error.code = errorCode.unauthenticated;
      error.status = 401;
      return next(error);
    }

    const assessTokenPayload = { id: user!.id };
    const refreshTokenPayload = { id: user!.id, phone: user!.phone };

    const new_accessToken = jwt.sign(
      assessTokenPayload,
      process.env.ACCESS_SECRET_KEY!,
      {
        expiresIn: 60 * 15,
      }
    );
    const new_refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_SECRET_KEY!,
      {
        expiresIn: "30d",
      }
    );

    await updateUser(user!.id, { randToken: new_refreshToken });

    res
      .cookie("accessToken", new_accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", new_refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

    req.userId = user!.id;
    next();
  };

  if (!accessToken) {
    generateNewToken();
    // next();
    // const error: any = new Error("Access Token has expired");
    // error.code = errorCode.accessTokenExpired;
    // error.status = 401;
    // return next(error);
  } else {
    let decoded;

    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY!) as {
        id: number;
      };

      if (isNaN(decoded.id)) {
        const error: any = new Error("You are not an authenticated user.");
        error.code = errorCode.unauthenticated;
        error.status = 401;
        return next(error);
      }
      req.userId = decoded.id;
      next();
    } catch (e: any) {
      if (e.name === "TokenExpiredError") {
        generateNewToken();
        // next();

        // e.message = "Access Token is expired.";
        // e.status = 400;
        // e.code = errorCode.accessTokenExpired;
      } else {
        e.message = "Access Token is Invalid.";
        e.status = 400;
        e.code = errorCode.attack;
        return next(e);
      }
    }
  }

  // next();

  // verify access token
};
