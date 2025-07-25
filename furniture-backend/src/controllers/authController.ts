import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import moment from "moment";
import jwt from "jsonwebtoken";

import {
  getUserByPhone,
  createOtp,
  getOtpByPhone,
  updateOtp,
  createUser,
  updateUser,
  getUserById,
} from "../services/authService";
import {
  checkOtpErrorIfSameDate,
  checkOtpRow,
  checkUserExist,
  checkUserIfNotExist,
} from "../utils/auth";
import { generateOTP, generateToken } from "../utils/generate";
import { max, min } from "moment";
import { errorCode } from "../../config/errorCode";
import { createError } from "../utils/error";

export const register = [
  body("phone", "Invalid phone number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      //console.log({ errors: errors[0].msg });
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }

    const user = await getUserByPhone(phone);
    checkUserExist(user);

    //OTP generate
    const otp = 123456; // For Testing
    //const otp = generateOTP(); //For Producting
    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otp.toString(), salt);
    const token = generateToken();

    const otpRow = await getOtpByPhone(phone);
    let result;
    if (!otpRow) {
      const otpData = {
        phone,
        otp: hashOtp, //hash this otp before saving to DB
        rememberToken: token,
        count: 1,
      };

      result = await createOtp(otpData);
    } else {
      const lastOtpRequest = new Date(otpRow.createdAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();
      const isSameDate = lastOtpRequest === today;
      checkOtpErrorIfSameDate(isSameDate, otpRow.error);

      if (!isSameDate) {
        const otpData = {
          otp: hashOtp,
          rememberToken: token,
          count: 1,
          error: 0,
        };
        result = await updateOtp(otpRow.id, otpData);
      } else {
        if (otpRow.count === 3) {
          return next(
            createError(
              "OTP is allowed to request 3 times per day",
              405,
              errorCode.overLimit
            )
          );
        } else {
          const otpData = {
            otp: hashOtp,
            rememberToken: token,
            count: {
              increment: 1,
            },
          };
          result = await updateOtp(otpRow.id, otpData);
        }
      }

      res.status(200).json({
        message: `We are sending otp tp 09${result.phone}`,
        phone: result.phone,
        token: result.rememberToken,
      });
    }
  },
];

export const verifyOtp = [
  body("phone", "Invalid phone number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 }),
  body("otp", "Invalid OTP")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 6, max: 6 }),
  body("token", "Invalid token").trim().notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { phone, otp, token } = req.body;
    const user = await getUserByPhone(phone);
    checkUserExist(user);

    const otpRow = await getOtpByPhone(phone);
    checkOtpRow(otpRow);

    const lastOtpVerify = new Date(otpRow!.createdAt).toLocaleDateString();

    const today = new Date().toLocaleDateString();
    const isSameDate = lastOtpVerify === today;
    //If OTP verify is in the same date and over limit
    checkOtpErrorIfSameDate(isSameDate, otpRow!.error);

    //If token is wrong
    if (otpRow?.rememberToken !== token) {
      const otpData = {
        error: 5,
      };

      await updateOtp(otpRow!.id, otpData);

      return next(createError("Invalid token.", 401, errorCode.invalid));
    }

    //If OTP is expired
    const isExpired = moment().diff(otpRow!.updatedAt, "minutes") > 2;
    if (isExpired) {
      return next(createError("OTP is expired.", 403, errorCode.otpExpired));
    }

    const isMatchOtp = await bcrypt.compare(otp, otpRow!.otp);
    //If OTP is wrong
    if (!isMatchOtp) {
      //If OTP error is first time today
      if (!isSameDate) {
        const otpData = {
          error: 1,
        };
        await updateOtp(otpRow!.id, otpData);
      } else {
        //If OTP error is not first time today
        const otpData = {
          error: { increment: 1 },
        };
        await updateOtp(otpRow!.id, otpData);
      }

      return next(createError("OTP is incorrect.", 400, errorCode.invalid));
    }

    //All are OK
    const verifyToken = generateToken();
    const otpData = {
      verifyToken,
      error: 0,
      count: 1,
    };

    const result = await updateOtp(otpRow!.id, otpData);

    res.status(200).json({
      message: "OTP is successfully verified.",
      phone: result.phone,
      token: result.verifyToken,
    });
  },
];

export const confirmPassword = [
  body("phone", "Invalid phone number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 }),
  body("password", "Password must be 8 digits")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 8, max: 8 }),
  body("token", "Invalid token").trim().notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { phone, password, token } = req.body;
    const user = await getUserByPhone(phone);
    checkUserExist(user);

    const otpRow = await getOtpByPhone(phone);
    checkOtpRow(otpRow);

    //If OTP error count over limit
    if (otpRow?.error === 5) {
      return next(
        createError("This request may be an attack!", 400, errorCode.attack)
      );
    }

    //If token is wrong
    if (otpRow?.verifyToken !== token) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpRow!.id, otpData);

      return next(createError("Invalid token.", 400, errorCode.invalid));
    }

    //If request is expired
    const isExpired = moment().diff(otpRow!.updatedAt, "minutes") > 10;
    if (isExpired) {
      return next(
        createError(
          "Your request is expired. Please try again.",
          403,
          errorCode.requestExpired
        )
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const randomToken = "I will replace refresh token soon";

    // Create new user
    const userData = {
      phone,
      password: hashPassword,
      randomToken,
    };

    const newUser = await createUser(userData);

    //Autharization Token
    const accessTokenPayload = { id: newUser.id };
    const refreshTokenPayload = { id: newUser.id, phone: newUser.phone };
    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15, // 15 minutes
      }
    );

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d", // 30 days
      }
    );

    // Update user with refreshToken
    const userUpdateData = {
      randomToken: refreshToken,
    };
    await updateUser(newUser.id, userUpdateData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // "none" for cross-site cookies in production
        maxAge: 60 * 15 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // "none" for cross-site cookies in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(201)
      .json({
        message: "Successfully created an account.",
        userId: newUser.id,
      });
  },
];
export const login = [
  body("phone", "Invalid phone number")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 5, max: 12 }),
  body("password", "Password must be 8 digits")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 8, max: 8 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const password = req.body.password;
    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }
    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    //If wrong password is over limit
    if (user!.status === "FREEZE") {
      return next(
        createError(
          "Your account is temporarily locked. Please contact support.",
          401,
          errorCode.accountFreeze
        )
      );
    }

    // Check is password match
    const isMatchPassword = await bcrypt.compare(password, user!.password);
    if (!isMatchPassword) {
      // -----Starting to record wrong password attempts-----
      const lastRequest = new Date(user!.updatedAt).toLocaleDateString();
      const isSameDate = lastRequest === new Date().toLocaleDateString();

      // If wrong password is first time today
      if (!isSameDate) {
        const userData = {
          errorLoginCount: 1,
        };
        await updateUser(user!.id, userData);
      } else {
        // If errorLoginCount is 3, freeze the account
        if (user!.errorLoginCount >= 3) {
          const userData = {
            status: "FREEZE",
          };
          await updateUser(user!.id, userData);
        } else {
          const userData = {
            errorLoginCount: { increment: 1 },
          };
          await updateUser(user!.id, userData);
        }
      }
      // -----Ending to record wrong password attempts-----

      return next(createError("wrongPasswd", 401, errorCode.invalid));
    }

    // Autharization Token
    const accessTokenPayload = { id: user!.id };
    const refreshTokenPayload = { id: user!.id, phone: user!.phone };
    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15, // 15 minutes
      }
    );

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d", // 30 days
      }
    );

    const userData = {
      errorLoginCount: 0, // Reset errorLoginCount after successful login
      randomToken: refreshToken,
    };

    await updateUser(user!.id, userData);
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // "none" for cross-site cookies in production
        maxAge: 60 * 15 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // "none" for cross-site cookies in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(200)
      .json({
        message: "Successfully logged In.",
        userId: user!.id,
      });
  },
];

export const logout = [
  async (req: Request, res: Response, next: NextFunction) => {
    // Clear HTTP-only cookies
    // Update randomToken in User Table

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

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        phone: string;
      };
    } catch (err) {
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
    checkUserIfNotExist(user);

    if (user!.phone !== decoded.phone) {
      return next(
        createError(
          "You are not an authenticated user",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const userData = {
      randomToken: generateToken(), // Replace with the new randomToken
    };
    await updateUser(user!.id, userData);

    // Clear cookies

    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // "none" for cross-site cookies in production
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // "none" for cross-site cookies in production
      })
      .status(200)
      .json({
        message: "Successfully logged out. See you soon!",
      });
  },
];

export const forgetPassword = [
  body("phone", "Invalid Phone Number.")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 5, max: 12 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    let phone = req.body.phone;
    if (phone.slice(0, 2) === "09") {
      phone = phone.substring(2, phone.length);
    }

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    // OTP sending logic here
    // Generate OTP & call OTP sending API
    // If sms OTP cannot be sent, response error
    // Save OTP to DB

    const otp = 123456; // For testing
    // const otp = generateOTP(); // For production use
    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otp.toString(), salt);
    const token = generateToken();

    const otpRow = await getOtpByPhone(phone);
    // Warning - Your app may let users change their phone number.
    // If so, you need to check if phone number exists in Otp table.

    let result;

    const lastOtpRequest = new Date(otpRow!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const isSameDate = lastOtpRequest === today;
    checkOtpErrorIfSameDate(isSameDate, otpRow!.error);
    // If OTP request is not in the same date
    if (!isSameDate) {
      const otpData = {
        otp: hashOtp,
        rememberToken: token,
        count: 1,
        error: 0,
      };
      result = await updateOtp(otpRow!.id, otpData);
    } else {
      // If OTP request is in the same date and over limit
      if (otpRow!.count === 3) {
        return next(
          createError(
            "OTP is allowed to request 3 times per day",
            405,
            errorCode.overLimit
          )
        );
      } else {
        // If OTP request is in the same date but not over limit
        const otpData = {
          otp: hashOtp,
          rememberToken: token,
          count: otpRow!.count + 1,
        };
        result = await updateOtp(otpRow!.id, otpData);
      }
    }
    res.status(200).json({
      message: `We are sending OTP to 09${result.phone} to reset password.`,
      phone: result.phone,
      token: result.rememberToken,
    });
  },
];

export const verifyOtpForPassword = [
  body("phone", "Invalid phone number")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 5, max: 12 }),
  body("otp", "Invalid OTP")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 6, max: 6 }),
  body("token", "Invalid token").trim().notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { phone, otp, token } = req.body;

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    const otpRow = await getOtpByPhone(phone);

    const lastOtpVerify = new Date(otpRow!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const isSameDate = lastOtpVerify === today;
    // If OTP error is in the same date and over limit
    checkOtpErrorIfSameDate(isSameDate, otpRow!.error);

    // Token is wrong
    if (otpRow?.rememberToken !== token) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpRow!.id, otpData);

      return next(createError("Invalid token", 400, errorCode.invalid));
    }

    // OTP is expired
    const isExpired = moment().diff(otpRow!.updatedAt, "minutes") > 2;
    if (isExpired) {
      return next(createError("OTP is expired", 403, errorCode.otpExpired));
    }

    const isMatchOtp = await bcrypt.compare(otp, otpRow!.otp);
    // OTP is wrong
    if (!isMatchOtp) {
      // If OTP error is first time today
      if (!isSameDate) {
        const otpData = {
          error: 1,
        };
        await updateOtp(otpRow!.id, otpData);
      } else {
        // If OTP error is not first time today
        const otpData = {
          error: { increment: 1 },
        };
        await updateOtp(otpRow!.id, otpData);
      }

      return next(createError("OTP is incorrect", 401, errorCode.invalid));
    }

    // All are OK
    const verifyToken = generateToken();
    const otpData = {
      verifyToken,
      error: 0,
      count: 1,
    };
    const result = await updateOtp(otpRow!.id, otpData);

    res.status(200).json({
      message: "OTP is successfully verified to reset password",
      phone: result.phone,
      token: result.verifyToken,
    });
  },
];

export const resetPassword = [
  // Validate and sanitize fields.
  body("token", "Token must not be empty.").trim().notEmpty().escape(),
  body("phone", "Invalid Phone Number.")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 5, max: 12 }),
  body("password", "Password must be 8 digits.")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 8, max: 8 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { token, phone, password } = req.body;

    const user = await getUserByPhone(phone);
    checkUserIfNotExist(user);

    const otpRow = await getOtpByPhone(phone);

    if (otpRow!.error === 5) {
      return next(
        createError(
          "This request may be an attack. If not, try again tomorrow.",
          401,
          errorCode.attack
        )
      );
    }

    if (otpRow!.verifyToken !== token) {
      const otpData = {
        error: 5,
      };
      await updateOtp(otpRow!.id, otpData);

      return next(createError("Token is invalid.", 400, errorCode.attack));
    }

    // request is expired
    const isExpired = moment().diff(otpRow!.updatedAt, "minutes") > 5;
    if (isExpired) {
      return next(
        createError(
          "Your request is expired. Please try again.",
          403,
          errorCode.requestExpired
        )
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // jwt token
    const accessPayload = { id: user!.id };
    const refreshPayload = { id: user!.id, phone: user!.phone };

    const accessToken = jwt.sign(
      accessPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15, // 15 mins
      }
    );

    const refreshToken = jwt.sign(
      refreshPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d", // "30d" in production
      }
    );

    const userUpdateData = {
      password: hashPassword,
      randomToken: refreshToken,
    };
    await updateUser(user!.id, userUpdateData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 mins
        path: "/",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: "/",
      })
      .status(200)
      .json({
        message: "Successfully reset your password.",
        userId: user!.id,
      });
  },
];

// interface CustomRequest extends Request {
//   userId?: number;
// }

// export const authCheck = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = req.userId;
//   const user = await getUserById(userId!);
//   checkUserIfNotExist(user);

//   res
//     .status(200)
//     .json({
//       message: "You are authenticated.",
//       userId: user?.id,
//       username: user?.firstName + " " + user?.lastLogin,
//       image: user?.image,
//     });
// };
