import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import AppError from "../../../utils/appError.js";
import { ErrorCode } from "../../../types/error.types.js";

const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .max(255, "Team name cannot exceed 255 characters")
    .trim(),
});

const updateTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .max(255, "Team name cannot exceed 255 characters")
    .trim(),
});

const teamIdParamSchema = z.object({
  teamId: z.uuid("Invalid team ID"),
});

const validate = (schema: z.ZodSchema, source: "body" | "params" = "body") => {
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

export const validateCreateTeam = validate(createTeamSchema);
export const validateUpdateTeam = validate(updateTeamSchema);
export const validateTeamIdParam = validate(teamIdParamSchema);
