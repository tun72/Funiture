import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import ImageQueue from "../../jobs/queues/imageQueue";

// import { checkUserIfNotExist } from "../../utils/auth";
import path from "node:path";
import { unlink } from "node:fs/promises";
import sanitizeHtml from "sanitize-html";
import { checkPhotoIfNotExist } from "../../utils/check";
import cacheQueue from "../../jobs/queues/cacheQueue";
import {
  createOneProduct,
  deleteOneProduct,
  getProductById,
  updateOneProduct,
} from "../../services/productService";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
  files?: any;
}

const removeFile = async (
  originalFiles: string[],
  optimizedFiles?: string[] | null
) => {
  try {
    for (const originalFile of originalFiles) {
      const originalfilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        originalFile
      );
      await unlink(originalfilePath);
    }

    if (optimizedFiles) {
      for (const optimizedFile of optimizedFiles) {
        const optimizefilePath = path.join(
          __dirname,
          "../../..",
          "/uploads/optimize",
          optimizedFile
        );
        await unlink(optimizefilePath);
      }
    }
  } catch (e) {
    // console.log(e);
  }
};

export const createProduct = [
  body("name", "Name is required.").trim("").notEmpty().escape(),
  body("description", "Description is required.").trim("").notEmpty().escape(),
  body("price", "Price is required.")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount is required")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("inventory", "Inventory is required").isInt({ min: 1 }),
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
      if (req.files && req.files.length !== 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFile(originalFiles);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    console.log("hit");

    checkPhotoIfNotExist(req.files && req.files.length > 0);

    const {
      name,
      description,
      price,
      discount,
      inventory,
      category,
      type,
      tags,
    } = req.body;

    await Promise.all(
      req.files.map(async (file: any) => {
        const splitFileName = file?.filename.split(".")[0];

        return ImageQueue.add(
          "optimize-image",
          {
            filePath: file?.path,
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
      })
    );

    let product;
    const originalFileNames = req.files.map((file: any) => {
      return { path: file.filename };
    });
    try {
      const data: any = {
        name,
        description,
        price,
        discount,
        inventory: parseInt(inventory),
        category,
        type,
        tags,
        images: originalFileNames,
      };

      product = await createOneProduct(data);

      await cacheQueue.add(
        "invalidate-product-cache",
        {
          pattern: "products:*", // delete all posts start with posts:*
        },
        {
          jobId: `invlidate-${Date.now()}`,
          priority: 1,
        }
      );
    } catch (err: any) {
      // const optimizeFileNames = originalFileNames.map(
      //   (originalFileName: string) => originalFileName.split(".")[0] + ".webp"
      // );
      // await removeFile(originalFileNames, optimizeFileNames);
      return next(createError(err.message, 500, errorCode.invalid));
    }

    res.status(200).json({
      message: "Successfully created new post",
      data: {
        product,
      },
    });
  },
];

export const updateProduct = [
  body("productId", "Product Id is required.").isInt({ min: 1 }),
  body("name", "Name is required.").trim("").notEmpty().escape(),
  body("description", "Description is required.").trim("").notEmpty().escape(),
  body("price", "Price is required.")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount is required")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("inventory", "Inventory is required").isInt({ min: 1 }),
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
      if (req.files && req.files.length !== 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFile(originalFiles);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const {
      productId,
      name,
      description,
      price,
      discount,
      inventory,
      category,
      type,
      tags,
    } = req.body;

    const product = await getProductById(+productId);

    if (!product) {
      if (req.files && req.files.length !== 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFile(originalFiles);
      }
      return next(
        createError("The product does not exist.", 401, errorCode.invalid)
      );
    }
    const data: any = {
      name,
      description,
      price,
      discount,
      inventory: parseInt(inventory),
      category,
      type,
      tags,
      images: [],
    };

    if (req.files && req.files.length !== 0) {
      data.images = req.files.map((file: any) => ({ path: file.filename }));
      await Promise.all(
        req.files.map(async (file: any) => {
          const splitFileName = file?.filename.split(".")[0];
          return ImageQueue.add(
            "optimize-image",
            {
              filePath: file?.path,
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
        })
      );
      const originalFiles = product.images.map((image: any) => image.path);
      const optimizeFiles = originalFiles.map(
        (image) => image.split(".")[0] + ".webp"
      );
      await removeFile(originalFiles, optimizeFiles);
    }

    const updateProduct = await updateOneProduct(product.id, data);

    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "products:*", // delete all posts start with posts:*
      },
      {
        jobId: `invlidate-${Date.now()}`,
        priority: 1,
      }
    );

    res.status(200).json({
      message: "Post update successfully",
      data: {
        updatePostId: updateProduct.id,
      },
    });
  },
];

export const deleteProduct = [
  body("productId", "Product Id is required")
    .trim("")
    .notEmpty()
    .isInt({ min: 1 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { productId } = req.body;

    const product = await getProductById(+productId);

    console.log(product);

    if (!product) {
      return next(
        createError("This post does not exist", 401, errorCode.invalid)
      );
    }

    const deleteProduct = await deleteOneProduct(product.id);

    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "products:*", // delete all posts start with posts:*
      },
      {
        jobId: `invlidate-${Date.now()}`,
        priority: 1,
      }
    );

    if (deleteProduct) {
      const originalFiles = product.images.map((image: any) => image.path);
      const optimizeFiles = originalFiles.map(
        (image) => image.split(".")[0] + ".webp"
      );
      await removeFile(originalFiles, optimizeFiles);
    }

    res.status(200).json({
      message: "Product delete successfully.",
    });
  },
];
