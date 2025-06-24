import { Request, Response, NextFunction } from "express";
import { getSettingStatus } from "../services/settingService";
import { errorCode } from "../../config/errorCode";
import { createError } from "../utils/error";

const whitelists = ["127.0.0.1"];
export const maintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip: any = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (whitelists.includes(ip)) {
    console.log(`Allowed IP: ${ip}`);
    next();
  } else {
    console.log(`Not allowed IP: ${ip}`);
    const setting = await getSettingStatus("maintenance");
    if (setting?.value === "true") {
      return next(
        createError(
          "The system is currently under maintenance. Please try again later.",
          503,
          errorCode.maintenance
        )
      );
    }
    next();
  }
};
