import path from "node:path";
import multer from "multer";

import { enqueueExport, enqueueImport, getJob } from "./jobs.service.js";
import AppError from "../../../utils/appError.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpStatus } from "../../../types/error.types.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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

export const exportController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const job = await enqueueExport(
      req.params.projectId as string,
      req.user.id,
    );

    return res.status(HttpStatus.CREATED).json(
      new ApiResponse({
        statusCode: HttpStatus.CREATED,
        message: "Export job enqueued",
        data: { jobId: job.id },
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};

export const importController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return next(
        new AppError(ErrorCode.INVALID_INPUT, "CSV File is required"),
      );
    }

    const job = await enqueueImport(
      req.params.projectId as string,
      req.user.id,
      req.file.buffer,
      req.file.originalname,
    );

    return res.status(HttpStatus.CREATED).json(
      new ApiResponse({
        statusCode: HttpStatus.CREATED,
        message: "Import job enqueued",
        data: { jobId: job.id },
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};

export const getJobController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const job = await getJob(req.params.jobId as string, req.user.id);

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Job retrieved successfully",
        data: { job },
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};
