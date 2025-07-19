import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { errorCode } from "../../config/errorCode";
import { getUserById, updateUser } from "../services/authService";
import { createError } from "../utils/error";

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
    return next(
      createError(
        "You are not an authenticated user.",
        401,
        errorCode.unauthenticated
      )
    );
  }

  const generateNewToken = async () => {
    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as {
        id: number;
        phone: string;
      };
    } catch (e) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (isNaN(decoded.id)) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const user = await getUserById(decoded.id);

    if (!user) {
      return next(
        createError(
          "You're not authenticated user",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user!.phone !== decoded.phone) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user!.randToken !== refreshToken) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
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
        return next(
          createError(
            "You are not an authenticated user.",
            401,
            errorCode.unauthenticated
          )
        );
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
        return next(
          createError("Access Token is Invalid.", 400, errorCode.attack)
        );
      }
    }
  }

  // next();

  // verify access token
};
