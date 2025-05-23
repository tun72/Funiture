import { Response, Request, NextFunction } from "express";
import { param, query, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import {
  getPostById,
  getPostsLists,
  getPostWithRelations,
} from "../../services/postService";
import { getUserById } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";
import { getOrSetCache } from "../../utils/cache";
import {
  getProductsLists,
  getProductWithRelations,
} from "../../services/productService";
import { disconnect } from "node:process";

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
    const user = getUserById(req.userId!);
    checkUserIfNotExist(user);
    const productId = req.params.id;

    // const post = await ;

    const key = `products:${JSON.stringify(productId)}`;
    const product = await getOrSetCache(key, async () => {
      return getProductWithRelations(+productId);
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
      data: {
        product,
      },
    });
  },
];

// // cursor based pagination
export const getProductsByPagination = [
  query("cursor", "cursor must be unsigned integer.")
    .isInt({ gt: 0 })
    .optional(),
  query("limit", "Limit number must be unsigned integer.")
    .isInt({ gt: 4 })
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

    const userId = req.userId;
    checkUserIfNotExist(userId);

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
        id: "asc",
      },
    };

    const key = `products:${JSON.stringify(req.query)}`;

    const posts = await getOrSetCache(key, async () => {
      return getProductsLists(options);
    });

    const hasNextPage = posts.length > +limit;

    if (hasNextPage) {
      posts.pop();
    }

    const newCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
    res.status(200).json({
      message: "Get All infinite posts",
      data: {
        posts,
        hasNextPage,
        newCursor,
      },
    });
  },
];
