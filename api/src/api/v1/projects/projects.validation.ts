import { z } from "zod";
import { validate } from "../../../utils/validate.js";

const createProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, "Project name is required")
      .max(255, "Project name cannot exceed 255 characters")
      .trim(),
    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .trim()
      .nullable()
      .optional(),
    start_date: z.coerce.date({
      error: "Invalid date format, expected YYYY-MM-DD",
    }),
    end_date: z.coerce.date({
      error: "Invalid date format, expected YYYY-MM-DD",
    }),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

const projectIdParamSchema = z.object({
  projectId: z.uuid("Invalid projectId").trim(),
});

export const validateCreateProject = validate(createProjectSchema);
export const validateProjectIdParam = validate(projectIdParamSchema);
