import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../types/error.types.js";
import AppError from "./appError.js";

export const validate = (
  schema: z.ZodSchema,
  source: "body" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(source === "body" ? req.body : req.params);

    if (!result.success) {
      const details = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return next(
        new AppError(ErrorCode.INVALID_INPUT, "Input verification failed", {
          errors: details,
        }),
      );
    }

    if (source === "body") {
      req.body = result.data;
    }

    return next();
  };
};
