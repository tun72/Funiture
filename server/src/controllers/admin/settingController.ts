import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import { createOrUpdateSettingStatus } from "../../services/settingService";

interface CustomRequest extends Request {
  user?: any;
}

export const setMaintenance = [
  body("mode", "Mode must be boolean").isBoolean(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const user = req.user;
    const { mode } = req.body;

    const value = mode ? "true" : "false";
    const message = mode
      ? "Successfully set Maintenance Mode"
      : "Successfully turn off Maintenance Mode";
    await createOrUpdateSettingStatus("maintenance", value);
    res.status(200).json({ message });
  },
];
