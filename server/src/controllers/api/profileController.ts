import { Response, Request, NextFunction } from "express";
import { query, validationResult } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { getUserById, updateUser } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";
import { authorise } from "../../utils/authorise";
import { checkPhotoIfNotExist } from "../../utils/check";

import path from "node:path";
import { unlink } from "node:fs/promises";
import { createError } from "../../utils/error";
import sharp from "sharp";
import ImageQueue from "../../jobs/queues/imageQueue";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
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

export const uploadProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  const image = req.file;
  checkUserIfNotExist(user);
  checkPhotoIfNotExist(image);

  const fileName = image!.filename;

  if (user?.image) {
    try {
      const filePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        user.image
      );
      await unlink(filePath);
      // await unlink(filePath);
    } catch (e) {
      console.log(e);
    }
  }

  await updateUser(user!.id, { image: fileName });

  res
    .status(200)
    .json({ message: "Profile picture successfully changed", fileName });
};

export const uploadProfileMultiple = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  const images = req.files;
  checkUserIfNotExist(user);

  if (images?.length === 0) {
    return next(createError("No images", 400, errorCode.invalid));
  }

  // checkPhotoIfNotExist(image);

  // const fileName = image!.filename;

  // if (user?.image) {
  //   try {
  //     const filePath = path.join(
  //       __dirname,
  //       "../../..",
  //       "/uploads/images",
  //       user.image
  //     );
  //     await unlink(filePath);
  //     // await unlink(filePath);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // await updateUser(user!.id, { image: fileName });

  res
    .status(200)
    .json({ message: "multiple file upload successfully changed" });
};

export const uploadProfileOptimize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  const image = req.file;
  checkUserIfNotExist(user);
  checkPhotoIfNotExist(image);

  // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  // const fileName = uniqueSuffix + ".webp";

  const splitFileName = req.file?.filename.split(".")[0];

  const job = await ImageQueue.add(
    "optimize-image",
    {
      filePath: req.file?.path,
      fileName: `${splitFileName}.webp`,
      width: 300,
      height: 300,
      quality: 50,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );

  // try {
  //   const optimizeImagePath = path.join(
  //     __dirname,
  //     "../../..",
  //     "/uploads/images",
  //     fileName
  //   );
  //   await sharp(req.file?.buffer)
  //     .resize(200, 200)
  //     .webp({ quality: 50 })
  //     .toFile(optimizeImagePath);
  // } catch (err) {
  //   console.log(err);
  //   return next(
  //     createError("Image optimization failed", 500, errorCode.invalid)
  //   );
  // }

  if (user?.image) {
    try {
      const originalfilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        user.image
      );
      await unlink(originalfilePath);

      const optimizefilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/optimize",
        user.image.split(".")[0] + ".webp"
      );
      await unlink(optimizefilePath);

      // await unlink(filePath);
    } catch (e) {
      console.log(e);
    }
  }

  await updateUser(user!.id, { image: req.file?.filename });

  res.status(200).json({
    message: "Profile picture successfully changed",
    image: splitFileName + ".webp",
    jobId: job.id,
  });
};

export const getMyPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = path.join(
    __dirname,
    "../../..",
    "/uploads/images",
    req.params.photo
  );

  res.sendFile(file, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error sending file" });
    }
    // Don't send another response if it was successful
  });
};
