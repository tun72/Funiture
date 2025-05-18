import { Response, Request, NextFunction } from "express";
interface CustomRequest extends Request {
  userId?: number;
}
export const home = (req: CustomRequest, res: Response, next: NextFunction) => {
  //   throw new Error("Error Error");
  res.render("index", { title: "Home" });
};
