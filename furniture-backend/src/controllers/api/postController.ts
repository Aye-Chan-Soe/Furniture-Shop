import { Request, Response, NextFunction } from "express";
import { body, query, validationResult, param } from "express-validator";
import { errorCode } from "../../../config/errorCode";
import { checkUserIfNotExist } from "../../utils/auth";
import { checkUploadFile } from "../../utils/check";
import { createError } from "../../utils/error";
import { getUserById } from "../../services/authService";
import {
  getPostById,
  getPostList,
  getPostWithRelations,
} from "../../services/postService";
import { getOrSetCache } from "../../utils/cache";

interface CustomRequest extends Request {
  userId?: any;
}

export const getPost = [
  param("id", "Post Id is required.").isInt({ gt: 0 }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const postId = req.params.id; // String
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    //const post = await getPostWithRelations(+postId);
    const cacheKey = `posts:${JSON.stringify(postId)}`;
    const post = await getOrSetCache(cacheKey, async () => {
      return await getPostWithRelations(+postId);
    });

    // const modifiedPost = {
    //   id: post!.id,
    //   title: post?.title,
    //   content: post?.content,
    //   body: post?.body,
    //   image: "/optimize/" + post?.image.split(".")[0] + ".webp",
    //   updatedAt: post?.updatedAt.toLocaleDateString("en-US", {
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    //   }),
    //   fullName:
    //     (post?.author.firstName ?? "") + " " + (post?.author.lastName ?? ""),
    //   category: post?.category.name,
    //   type: post?.type.name,
    //   tags:
    //     post?.tags && post.tags.length > 0
    //       ? post.tags.map((i) => i.name)
    //       : null,
    // };

    res.status(200).json({
      message: "OK",
      post,
    });
  },
];

// Offset Pagination
export const getPostsByPagination = [
  query("page", "Page number must be unsigned integer.")
    .isInt({ gt: 0 })
    .optional(),
  query("limit", "Limit number must be unsigned integer.")
    .isInt({ gt: 4 })
    .optional(),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    const skip = (+page - 1) * +limit; // 1-1 * 5 = 0 => skip 0 => 1
    const options = {
      skip,
      take: +limit + 1,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        updatedAt: true,
        author: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    };

    //const posts = await getPostList(options);
    const cacheKey = `posts:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cacheKey, async () => {
      return await getPostList(options);
    });

    const hasNextPage = posts.length > +limit;
    let nextPage = null;
    const previousPage = +page !== 1 ? +page - 1 : null;

    if (hasNextPage) {
      posts.pop();
    }
    nextPage = +page + 1;

    res.status(200).json({
      message: "Get all post.",

      currentPage: page,
      previousPage,
      hasNextPage: nextPage,
      posts,
    });
  },
];

export const getInfinitePostsByPagination = [
  query("Cursor", "Cursor must be Post ID.").isInt({ gt: 0 }).optional(),
  query("limit", "Limit number must be unsigned integer.")
    .isInt({ gt: 4 })
    .optional(),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const lastCursor = req.query.cursor;
    const limit = req.query.limit || 5;

    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    const options = {
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
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

    //const posts = await getPostList(options);
    const cacheKey = `posts:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cacheKey, async () => {
      return await getPostList(options);
    });
    const hasNextPage = posts.length > +limit; // 6 > 5
    if (hasNextPage) {
      posts.pop();
    }

    const newCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    res.status(200).json({
      message: "Get All infinite posts.",
      hasNextPage,
      newCursor,
      posts,
    });
  },
];
