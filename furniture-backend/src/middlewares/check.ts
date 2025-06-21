import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: number;
}
export const check = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  //   const err = new Error("Token expired") as Error & {
  //     status?: number;
  // code?: string;
  //   };
  //   err.status = 401;
  //   err.code = "TOKEN_EXPIRED";
  //   return next(err);

  req.userId = 12345;
  next();
};
