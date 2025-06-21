import { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/authService";
import { errorCode } from "../../config/errorCode";
import { createError } from "../utils/error";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}
// authorise(true, "ADMIN", "AUTHOR") // deny - "USER"
// authorise(false, "USER") // allow - "ADMIN", "AUTHOR"

export const authorise = (permission: boolean, ...roles: string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await getUserById(userId!);

    if (!user) {
      return next(
        createError(
          "You are not an authenticated user",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const result = roles.includes(user.role);

    // permission && result
    //authorise(true, "ADMIN", "AUTHOR") //deny - "USER"
    if (permission && !result) {
      return next(
        createError(req.t("unauthorised"), 403, errorCode.unauthorised)
      );
    }

    //authorise(false, "USER") // allow - "ADMIN", "AUTHOR"
    if (!permission && result) {
      return next(
        createError(req.t("unauthorised"), 403, errorCode.unauthorised)
      );
    }

    req.user = user;
    next();
  };
};
