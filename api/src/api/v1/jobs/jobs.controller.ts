import multer from "multer";

import AppError from "../../../utils/appError.js";
import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../../../types/error.types.js";
import path from "node:path";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype !== "text/csv" || ext !== ".csv") {
      cb(
        new AppError(
          ErrorCode.INVALID_INPUT,
          "Only valid CSV files are allowed",
        ),
      );

      return;
    }

    cb(null, true);
  },
});

export const exportController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};

export const importController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};

export const getJobController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};
