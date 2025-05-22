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

interface CustomRequest extends Request {
  userId?: number;
}
export const getPost = [
  param("id", "Post Id is required.").isInt({ gt: 0 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const user = getUserById(req.userId!);

    checkUserIfNotExist(user);
    const postId = req.params.id;

    // const post = await ;

    const key = `posts:${JSON.stringify(postId)}`;
    const post = await getOrSetCache(key, async () => {
      return getPostWithRelations(+postId);
    });

    if (!post) {
      return next(createError("Post not found", 404, errorCode.notFound));
    }

    const modifiedPost = {
      ...post,
      tags:
        post?.tags && post.tags.length > 0
          ? post.tags.map((i: any) => i.name)
          : null,
    };

    res.status(200).json({
      message: "Post Detail",
      data: {
        post: modifiedPost,
      },
    });
  },
];

// offset based pagination
export const getPostByPagination = [
  query("page", "Page number must be unsigned integer.")
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
    const user = getUserById(req.userId!);
    checkUserIfNotExist(user);

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    const options = {
      skip: (+page - 1) * +limit,
      take: +limit + 1,
      select: {
        id: true,
        title: true,
        image: true,
        content: true,
        author: {
          select: {
            fullName: true,
          },
        },
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    };
    const key = `posts:${JSON.stringify(req.query)}`;

    const posts = await getOrSetCache(key, async () => {
      return getPostsLists(options);
    });

    // const posts = await getPostsLists(options);

    const hasNextPage = posts.length > +limit;
    let nextpage = null;
    const previousPage = +page !== 1 ? +page - 1 : null;

    if (hasNextPage) {
      posts.pop();
      nextpage = +page + 1;
    }

    res.status(200).json({
      message: "Post Detail",
      data: {
        posts,
        currentPage: page,
        nextPage: nextpage,
        previousPage,

        // post: modifiedPost,
      },
    });
  },
];

// cursor based pagination
export const getInfinitePostByPagination = [
  query("lastCursor", "lastCursor must be unsigned integer.")
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
    const lastCursor = req.query.lastCursor;
    const limit = req.query.limit || 5;

    const options = {
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        title: true,
        image: true,
        content: true,
        updatedAt: true,
        author: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    };

    const key = `posts:${JSON.stringify(req.query)}`;

    const posts = await getOrSetCache(key, async () => {
      return getPostsLists(options);
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
