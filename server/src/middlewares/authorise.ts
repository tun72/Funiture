import { Response, Request, NextFunction } from "express";
import { query, validationResult } from "express-validator";
import { getUserById } from "../services/authService";
import { errorCode } from "../../config/errorCode";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}

export const authorise =
  (permission: boolean, ...roles: string[]) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await getUserById(userId!); 
    if (!user) {
      const error: any = new Error(req.t("accNotRegister"));
      error.status = 401;
      error.code = errorCode.unauthenticated;
      return next(error);
    }

    const result = roles.includes(user.role);

    if (permission && !result) {
      const error: any = new Error("This action is not allowed.");
      error.status = 403;
      error.code = errorCode.unauthorized;
      return next(error);
    }

    if (!permission && result) {
      const error: any = new Error("This action is not allowed.");
      error.status = 403;
      error.code = errorCode.unauthorized;
      return next(error);
    }
    req.user = user;

    next();
  };
