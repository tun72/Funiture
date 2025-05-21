import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import ImageQueue from "../../jobs/queues/imageQueue";
import { createOnePost, PostArgs } from "../../services/postService";
import { checkUserIfNotExist } from "../../utils/auth";
import path from "node:path";
import { unlink } from "node:fs/promises";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}
export const createPost = [
  body("title", "Titile is required.").trim("").notEmpty().escape(),
  body("content", "Content is required.").trim("").notEmpty().escape(),
  body("body", "Body is required").trim("").notEmpty().escape(),
  body("category", "Category is required").trim("").notEmpty().escape(),
  body("type", "Type is required.").trim("").notEmpty().escape(),
  body("tags", "Tag is invalid")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: string) => tag.trim() !== "");
      }
    }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      // console.log(errors);
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const user = req.user;
    checkUserIfNotExist(user);
    const { title, content, body, category, type, tags } = req.body;

    const splitFileName = req.file?.filename.split(".")[0];

    await ImageQueue.add(
      "optimize-image",
      {
        filePath: req.file?.path,
        fileName: `${splitFileName}.webp`,
        width: 835,
        height: 577,
        quality: 100,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    );

    const deleteImage = async () => {
      if (req.file?.filename) {
        try {
          const originalfilePath = path.join(
            __dirname,
            "../../..",
            "/uploads/images",
            req.file.filename
          );
          await unlink(originalfilePath);

          const optimizefilePath = path.join(
            __dirname,
            "../../..",
            "/uploads/optimize",
            req.file.filename.split(".")[0] + ".webp"
          );
          await unlink(optimizefilePath);
        } catch (e) {
          console.log(e);
        }
      }
    };

    let post;
    try {
      const data: PostArgs = {
        title,
        content,
        body,
        category,
        tags,
        type,
        image: req.file?.filename!,
        authorId: user.id,
      };

      post = await createOnePost(data);
    } catch (err: any) {
      await deleteImage();
      return next(createError(err.message, 500, errorCode.invalid));
    }

    res.status(200).json({
      message: "Successfully created new post",
      data: {
        post,
      },
    });
  },
];

export const updatePost = [
  body("password", "Please provide a password.")
    .trim("")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be minium of 8 characters."),

  body("phone", "Invalid phone Number")
    .trim("")
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone number invalid."),
  body("token", "Invalid token").trim("").notEmpty().escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      // console.log(errors);
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    res.status(200).json({
      message: "User account successfully created",
    });
  },
];

export const deletePost = [
  body("password", "Please provide a password.")
    .trim("")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be minium of 8 characters."),

  body("phone", "Invalid phone Number")
    .trim("")
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone number invalid."),
  body("token", "Invalid token").trim("").notEmpty().escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      // console.log(errors);
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    res.status(200).json({
      message: "User account successfully created",
    });
  },
];
