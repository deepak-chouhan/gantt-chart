import z from "zod";
import { validate } from "../../../utils/validate.js";

const createTaskSchema = z.object({
  name: z
    .string()
    .min(1, "Task name is required")
    .max(255, "Task name cannot exceed 255 characters"),
  status: z
    .enum(["OPEN", "IN_PROGRESS", "COMPLETED", "BLOCKED"])
    .default("OPEN"),
  assigneeId: z.uuid("Invalid assignee Id").nullable().optional(),
  startDate: z.coerce.date({
    error: "Invalid date format, expected YYYY-MM-DD",
  }),
  endDate: z.coerce.date({
    error: "Invalid date format, expected YYYY-MM-DD",
  }),
  parentTaskId: z.uuid("Invalid parent task ID").nullable().optional(),
});

const taskIdSchema = z.object({
  taskId: z.uuid("Invalid task Id").trim(),
});

export const validateCreateTask = validate(createTaskSchema);
export const validateTaskIdParam = validate(taskIdSchema, "params");
