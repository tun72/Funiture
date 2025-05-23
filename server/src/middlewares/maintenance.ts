import { Request, Response, NextFunction } from "express";
import { getSettingStatus } from "../services/settingService";
import { errorCode } from "../../config/errorCode";
import { createError } from "../utils/error";

const whiteLists = ["127.0.0.1"];
export const maintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip: any = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (whiteLists.includes(ip)) {
    console.log(`Allow ip : ${ip}`);
    return next();
  } else {
    const setting = await getSettingStatus("maintenance");
    if (setting?.value === "true") {
      return next(
        createError(
          "The server is currently under maintenance. Please try later",
          503,
          errorCode.errorMaintenance
        )
      );
    }
  }
  next();
};
