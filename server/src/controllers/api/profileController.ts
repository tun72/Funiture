import { Response, Request, NextFunction } from "express";
import { query, validationResult } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { getUserById } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";
import { authorise } from "../../utils/authorise";

interface CustomRequest extends Request {
  userId?: number;
}

export const changeLanguage = [
  query("lng", "Invalid Language Code.")
    .trim()
    .notEmpty()
    .matches("^[a-z]+$")
    .isLength({ min: 2, max: 3 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      console.log(errors);
      const error: any = new Error(errors[0].msg);
      error.code = errorCode.invalid;
      error.status = 400;
      return next(error);
    }

    const { lng } = req.query;
    res.cookie("i18next", lng);
    res.status(200).json({ message: req.t("changeLng", { lang: lng }) });
  },
];

export const testPermission = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);
  const info: any = {
    title: "Testing permission",
  };

  const isGrant = authorise(true, user!.role, "AUTHOR");

  if (isGrant) {
    info.content = "Your are allowed Author!";
  }
  res.status(200).json({ message: info });
};
