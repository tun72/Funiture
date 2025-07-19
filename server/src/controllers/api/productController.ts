import { Response, Request, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";

import { getUserById } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";
import { getOrSetCache } from "../../utils/cache";
import {
  getProductsLists,
  getProductWithRelations,
} from "../../services/productService";
import {
  addFavouriteProducts,
  removeFavouriteProducts,
} from "../../services/userService";
import cacheQueue from "../../jobs/queues/cacheQueue";

interface CustomRequest extends Request {
  userId?: number;
}
export const getProduct = [
  param("id", "Post Id is required.").isInt({ gt: 0 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const user = await getUserById(req.userId!);
    checkUserIfNotExist(user);
    const productId = req.params.id;

    // const post = await ;

    const key = `products:${JSON.stringify(productId)}`;
    const product = await getOrSetCache(key, async () => {
      return getProductWithRelations(+productId, user!.id);
    });

    if (!product) {
      return next(createError("Post not found", 404, errorCode.notFound));
    }

    // const modifiedPost = {
    //   ...post,
    //   tags:
    //     post?.tags && post.tags.length > 0
    //       ? post.tags.map((i: any) => i.name)
    //       : null,
    // };

    res.status(200).json({
      message: "Post Detail",
      product,
    });
  },
];

// cursor based pagination
export const getProductsByPagination = [
  query("cursor", "cursor must be unsigned integer.")
    .isInt({ gt: 0 })
    .optional(),
  query("limit", "Limit number must be unsigned integer.")
    .isInt({ gt: 3 })
    .optional(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const lastCursor = req.query.cursor;
    const limit = req.query.limit || 5;
    const category = req.query.category;
    const type = req.query.type;

    const user = await getUserById(req.userId!);
    checkUserIfNotExist(user);

    let categories: number[] = [];
    let types: number[] = [];

    if (category) {
      categories = category
        .toString()
        .split(",")
        .map((c) => Number(c))
        .filter((c) => c > 0);
    }

    if (type) {
      types = type
        .toString()
        .split(",")
        .map((t) => Number(t))
        .filter((t) => t > 0);
    }

    const where = {
      AND: [
        categories.length > 0 ? { categoryId: { in: categories } } : {},
        types.length > 0 ? { typeId: { in: types } } : {},
      ],
    };

    const options = {
      where,
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        name: true,
        price: true,
        discount: true,
        description: true,
        status: true,
        images: {
          select: {
            id: true,
            path: true,
          },
          take: 1,
        },
      },
      orderBy: {
        id: "desc",
      },
    };

    const key = `products:${JSON.stringify(req.query)}`;

    const products = await getOrSetCache(key, async () => {
      return getProductsLists(options);
    });

    const hasNextPage = products.length > +limit;

    if (hasNextPage) {
      products.pop();
    }

    const nextCursor =
      products.length > 0 ? products[products.length - 1].id : null;
    res.status(200).json({
      message: "Get All infinite posts",
      products,
      hasNextPage,
      nextCursor,
      prevCursor: lastCursor,
    });
  },
];

export const toggleFavouriteProduct = [
  body("productId", "Product Id is required").isInt({ min: 1 }),
  body("favourite", "Favourite is required").isBoolean(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    const { productId, favourite } = req.body;

    console.log(favourite);

    if (favourite) {
      console.log("hit");

      await addFavouriteProducts(+productId, user!.id);
    } else {
      await removeFavouriteProducts(+productId, user!.id);
    }

    await cacheQueue.add(
      "invalidate-product-cache",
      {
        pattern: "products:*",
      },
      {
        jobId: `invalidate-${Date.now()}`,
        priority: 1,
      }
    );

    res.status(200).json({
      message: favourite
        ? "Successfully added favourite"
        : "Successfully removed favourite",
    });
  },
];
