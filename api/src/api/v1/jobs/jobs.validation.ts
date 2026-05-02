import z from "zod";
import { validate } from "../../../utils/validate.js";

const jobIdParamSchema = z.object({
  jobId: z.uuid("Invalid jobId").trim(),
});

export const validateJobIdParam = validate(jobIdParamSchema, "params");
