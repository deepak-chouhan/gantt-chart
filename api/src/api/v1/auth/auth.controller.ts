import { NextFunction, Request, Response } from "express";
import { googleClient } from "../config/googleClient.js";
import { env } from "../config/env.js";
import AppError from "../utils/appError.js";
import { ErrorCode } from "../../../types/error.types.js";

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: env.auth.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      // Throw error
      return;
    }

    const { sub, email, name, picture } = payload;

    // Find or Create User
    // Generate Access Token and Refresh Token
  } catch (error) {
    next(new AppError(ErrorCode.UNAUTHORIZED, "Google authentication failed"));
  }
};
