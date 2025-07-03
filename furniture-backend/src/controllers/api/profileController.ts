import { Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import { unlink } from "node:fs/promises";
import path from "path";
import sharp from "sharp";

import { errorCode } from "../../../config/errorCode";
import { checkUserIfNotExist } from "../../utils/auth";
import { getUserById, updateUser } from "../../services/authService";
import { authorise } from "../../utils/authorise";
import { checkUploadFile } from "../../utils/check";

interface CustomRequest extends Request {
  userId?: number;
  file?: any;
}

// For Changing Languages
export const changeLanguage = [
  query("lng", "Invalid Language code.")
    .trim()
    .notEmpty()
    .matches("^[a-z]+$")
    .isLength({ min: 2, max: 3 }),
  (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    const { lng } = req.query;
    res.cookie("i18next", lng);
    res.status(200).json({ message: req.t("changeLan", { lang: lng }) });
  },
];

// For Testing Role Permissions
export const testPermission = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);

  const info: any = {
    title: "Testing Permission",
  };
  // if user.role === "AUTHOR"
  // content = "You are an author."
  const can = authorise(true, user!.role, "AUTHOR");

  if (can) {
    info.content = "You have permission to read this line.";
  }

  res.status(200).json({ info });
};

// For File Upload
export const uploadProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);
  checkUploadFile(image);

  // console.log("Image file:", image);
  const fileName = image.filename;
  // const filePath = image.path;
  // const filePath = image.path.replace("\\", "/"); // Fix Windows path issue

  if (user?.image) {
    // If user already has an image, delete the old image file
    try {
      const filePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        user!.image!
      );
      await unlink(filePath);
    } catch (error) {
      console.log(error);
    }
  }

  const userData = {
    image: fileName,
  };
  await updateUser(user?.id!, userData);

  res.status(200).json({
    message: "Profile picture uploaded successfully.",
    image: fileName,
  });
};

// For Multiple Files Upload
export const uploadProfileMultiple = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    message: "Multiple profile pictures uploaded successfully",
  });
};

// For Image Optimization
export const uploadProfileOptimize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);
  checkUploadFile(image);

  const fileName = Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;

  try {
    const optimizedImagePath = path.join(
      __dirname,
      "../../..",
      "/uploads/images",
      fileName
    );
    await sharp(req.file?.buffer)
      .resize(200, 200)
      .webp({ quality: 50 })
      .toFile(optimizedImagePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image optimization failed." });
    return;
  }

  if (user?.image) {
    // If user already has an image, delete the old image file
    try {
      const filePath = path.join(
        __dirname,
        "../../..",
        "/uploads/optimize",
        user!.image!.split(".")[0] + ".webp"
      );
      await unlink(filePath);
    } catch (error) {
      console.log(error);
    }
  }

  const userData = {
    image: req.file?.filename,
  };
  await updateUser(user?.id!, userData);
};

// Just for testing
export const getMyPhoto = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const file = path.join(
    __dirname,
    "../../..",
    "/uploads/images",
    "1751308215080-588863177-Capture 1.png" // user.image
  );

  res.sendFile(file, (err) => {
    res.status(404).send("File not found");
  });
};
