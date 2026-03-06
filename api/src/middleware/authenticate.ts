import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import AppError from "../utils/appError.js";
import { ErrorCode } from "../types/error.types.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(new AppError(ErrorCode.UNAUTHORIZED, "No token provided"));
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    if (!payload?.id) {
      return next(
        new AppError(ErrorCode.UNAUTHORIZED, "Invalid token payload"),
      );
    }


    req.user = { id: payload.id };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(ErrorCode.UNAUTHORIZED, "Access token expired"));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(ErrorCode.UNAUTHORIZED, "Invalid access token"));
    }
    return next(new AppError(ErrorCode.UNAUTHORIZED, "Authentication failed"));
  }
};
