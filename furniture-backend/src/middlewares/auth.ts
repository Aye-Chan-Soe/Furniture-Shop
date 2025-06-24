import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorCode } from "../../config/errorCode";
import { getUserById, updateUser } from "../services/authService";
import { createError } from "../utils/error";

interface CustomRequest extends Request {
  userId?: number;
}

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  // const platform = req.headers["x-platform"];
  // if (platform === "mobile") {
  //   const accessTokenMobile = req.headers.authorization?.split(" ")[1];
  //   console.log("Request from Mobile", accessTokenMobile);
  // } else {
  //   console.log("Request from Web");
  // }

  // Check is the cookies habe accessToken and refreshToken
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    return next(
      createError(
        "You are not an authenticated user",
        401,
        errorCode.unauthenticated
      )
    );
  }

  const generateNewToken = async () => {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        phone: string;
      };
    } catch (error) {
      return next(
        createError(
          "You are not an authenticated user",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (isNaN(decoded.id)) {
      return next(
        createError(
          "You are not an authenticated user",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const user = await getUserById(decoded.id);
    if (!user) {
      return next(createError("User not found", 401, errorCode.invalid));
    }

    if (user.phone !== decoded.phone) {
      return next(
        createError(
          "You are not an authenticated user",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user.randomToken !== refreshToken) {
      return next(
        createError(
          "You are not an authenticated user",
          401,
          errorCode.unauthenticated
        )
      );
    }

    // Autharization Token
    const accessTokenPayload = { id: user.id };
    const refreshTokenPayload = { id: user.id, phone: user.phone };
    const newAccessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15, // 15 minutes
      }
    );

    const newRefreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d", // 30 days
      }
    );

    const userData = {
      randomToken: newRefreshToken,
    };

    await updateUser(user!.id, userData);

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // "none" for cross-site cookies in production
        maxAge: 60 * 15 * 1000, // 15 minutes
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // "none" for cross-site cookies in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

    req.userId = user.id;
    return next();
  };

  if (!accessToken) {
    generateNewToken(); // await generateNewToken();
    // const error: any = new Error("Access Token has expired.");
    // error.status = 401;
    // error.code = errorCode.accessTokenExpired;
    // return next(error);
  } else {
    // Verify the accessToken
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        id: number;
      };

      if (isNaN(decoded.id)) {
        return next(
          createError(
            "You are not an authenticated user",
            401,
            errorCode.unauthenticated
          )
        );
      }

      req.userId = decoded.id;

      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        generateNewToken(); // await generateNewToken();
        // error.message = "Access token has expired.";
        // error.status = 401;
        // error.code = errorCode.accessTokenExpired;
      } else {
        return next(
          createError("Invalid access token.", 400, errorCode.attack)
        );
      }
    }
  }
};
