import { Response, Request, NextFunction } from "express";

import {
  getAllCategories,
  getAllTypes,
} from "../../services/categoryAndTypeService";
import { checkUserIfNotExist } from "../../utils/auth";
import { getUserById } from "../../services/authService";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}
export const getCategotyAndType = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(Number(userId));
  checkUserIfNotExist(user);
  const category = await getAllCategories();
  const type = await getAllTypes();
  res.status(200).json({
    message: "Get All infinite posts",
    categories: category,
    types: type,
  });
};
