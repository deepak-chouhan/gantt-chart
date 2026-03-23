import { z } from "zod";
import { validate } from "../../../utils/validate.js";

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
  teamId: z.uuid("Invalid team ID").trim(),
});

const inviteMemberSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
});

export const memberParamSchema = z.object({
  teamId: z.uuid("Invalid team Id").trim(),
  userId: z.uuid("Invalid user Id").trim(),
});

export const validateCreateTeam = validate(createTeamSchema);
export const validateUpdateTeam = validate(updateTeamSchema);
export const validateInviteMember = validate(inviteMemberSchema);
export const validateTeamIdParam = validate(teamIdParamSchema, "params");
export const validateMemberParam = validate(memberParamSchema, "params");
