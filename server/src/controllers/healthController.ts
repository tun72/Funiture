import { Response, Request, NextFunction } from "express";
interface CustomRequest extends Request {
  userId?: number;
}
export const healthCheck = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  //   throw new Error("Error Error");

  res.status(200).json({ message: "In Good Condition ✅ " });
};
