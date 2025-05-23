import { Response, Request, NextFunction } from "express";
interface CustomRequest extends Request {
  userId?: number;
}
export const notFound = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  //   throw new Error("Error Error");
  res.status(404).render("404", { title: "Home", error: "Page Not Found" });
};
