import { Response, Request, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: number;
}
export const getAllUsers = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.userId;

  console.log(id);

  res.status(200).json({
    message: "All users",
  });
};
