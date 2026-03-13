import { ErrorCode } from "../../../types/error.types.js";
import AppError from "../../../utils/appError.js";
import {
  createTeamQuery,
  deleteTeamQuery,
  getTeamMembershipQuery,
  getTeamsByUserIdQuery,
  getTeamWithMembersQuery,
  updateTeamQuery,
} from "./teams.query.js";

export const createTeam = async (name: string, userId: string) => {
  return await createTeamQuery(name, userId);
};

export const getMyTeams = async (userId: string) => {
  return await getTeamsByUserIdQuery(userId);
};

export const getTeamWithMembers = async (teamId: string, userId: string) => {
  const membership = await getTeamMembershipQuery(teamId, userId);
  if (!membership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }

  const team = await getTeamWithMembersQuery(teamId);
  if (!team) {
    throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Team not found");
  }

  return team;
};

export const updateTeam = async (
  teamId: string,
  userId: string,
  name: string,
) => {
  const membership = await getTeamMembershipQuery(teamId, userId);

  if (!membership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }

  if (membership.role != "owner") {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "Only the owner can update the team",
    );
  }

  return await updateTeamQuery(teamId, name);
};

export const deleteTeam = async (teamId: string, userId: string) => {
  const membership = await getTeamMembershipQuery(teamId, userId);

  if (!membership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }

  if (membership.role != "owner") {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "Only the owner can update the team",
    );
  }

  await deleteTeamQuery(teamId);
};
