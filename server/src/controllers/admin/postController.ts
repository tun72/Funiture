import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import ImageQueue from "../../jobs/queues/imageQueue";
import {
  createOnePost,
  deleteOnePost,
  getPostById,
  PostArgs,
  updateOnePost,
} from "../../services/postService";
// import { checkUserIfNotExist } from "../../utils/auth";
import path from "node:path";
import { unlink } from "node:fs/promises";
import sanitizeHtml from "sanitize-html";
import { checkPhotoIfNotExist } from "../../utils/check";
import cacheQueue from "../../jobs/queues/cacheQueue";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}

const removeFile = async (
  originalFile: string,
  optimizedFile?: string | null
) => {
  try {
    const originalfilePath = path.join(
      __dirname,
      "../../..",
      "/uploads/images",
      originalFile
    );
    await unlink(originalfilePath);

    if (optimizedFile) {
      const optimizefilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/optimize",
        optimizedFile
      );
      await unlink(optimizefilePath);
    }
  } catch (e) {
    // console.log(e);
  }
};

export const createPost = [
  body("title", "Titile is required.").trim("").notEmpty().escape(),
  body("content", "Content is required.").trim("").notEmpty().escape(),
  body("body", "Body is required")
    .trim("")
    .notEmpty()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),
  body("category", "Category is required").trim("").notEmpty().escape(),
  body("type", "Type is required.").trim("").notEmpty().escape(),
  body("tags", "Tag is invalid")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value
          .split(",")
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag !== "");
      }
    }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      if (req.file) {
        await removeFile(req.file.filename);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const image = req.file;
    checkPhotoIfNotExist(image);
    const user = req.user;
    // if (!user) {
    //   if (req.file) {
    //     await removeFile(req.file.filename);
    //   }
    //   return next(
    //     createError(
    //       "This account is not registered.",
    //       401,
    //       errorCode.unauthenticated
    //     )
    //   );
    // }
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

      await cacheQueue.add(
        "invalidate-post-cache",
        {
          pattern: "posts:*", // delete all posts start with posts:*
        },
        {
          jobId: `invlidate-${Date.now()}`,
          priority: 1,
        }
      );
    } catch (err: any) {
      await removeFile(req.file?.fieldname!);
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
  body("postId", "Post Id is required").isInt({ min: 1 }),
  body("title", "Titile is required.").trim("").notEmpty().escape(),
  body("content", "Content is required.").trim("").notEmpty().escape(),
  body("body", "Body is required")
    .trim("")
    .notEmpty()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),
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
      if (req.file) {
        await removeFile(req.file.filename);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { postId, title, content, body, category, type, tags } = req.body;

    console.log(req.file);

    const image = req.file;

    const user = req.user;
    // if (!user) {
    //   if (req.file) {
    //     await removeFile(req.file.filename);
    //   }
    //   return next(
    //     createError(
    //       "This account is not registered.",
    //       401,
    //       errorCode.unauthenticated
    //     )
    //   );
    // }

    const post = await getPostById(+postId);

    if (!post) {
      await removeFile(req!.file!.filename);

      return next(
        createError("This post does not exist", 401, errorCode.invalid)
      );
    }

    if (post.authorId !== user.id) {
      await removeFile(req!.file!.filename);

      return next(
        createError(
          "This postt does not belong to you.",
          403,
          errorCode.unauthorized
        )
      );
    }

    let data: any = {
      title,
      content,
      body,
      category,
      tags,
      type,
    };

    console.log(image);

    if (image) {
      data.image = image.filename;
      await removeFile(post.image, post.image.split(".")[0] + ".webp");

      await ImageQueue.add(
        "optimize-image",
        {
          filePath: req.file?.path,
          fileName: `${image.filename.split(".")[0]}.webp`,
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
    }

    const updatePost = await updateOnePost(post.id, data);

    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*", // delete all posts start with posts:*
      },
      {
        jobId: `invlidate-${Date.now()}`,
        priority: 1,
      }
    );

    res.status(200).json({
      message: "Post update successfully",
      data: {
        updatePost,
      },
    });
  },
];

export const deletePost = [
  body("postId", "Post Id is required").trim("").notEmpty().isInt({ min: 1 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { postId } = req.body;
    const user = req.user;
    if (!user) {
      if (req.file) {
        await removeFile(req.file.filename);
      }
      return next(
        createError(
          "This account is not registered.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const post = await getPostById(+postId);

    if (!post) {
      return next(
        createError("This post does not exist", 401, errorCode.invalid)
      );
    }

    if (post.authorId !== user.id) {
      return next(
        createError(
          "This postt does not belong to you.",
          403,
          errorCode.unauthorized
        )
      );
    }

    const deletePost = await deleteOnePost(post.id);

    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*", // delete all posts start with posts:*
      },
      {
        jobId: `invlidate-${Date.now()}`,
        priority: 1,
      }
    );

    if (deletePost) {
      await removeFile(
        deletePost.image,
        deletePost.image.split(".")[0] + ".webp"
      );
    }

    res.status(200).json({
      message: "Post delete successfully.",
    });
  },
];
