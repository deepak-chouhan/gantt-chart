import { ErrorCode } from "../../../types/error.types.js";
import AppError from "../../../utils/appError.js";
import {
  addMemberQuery,
  createTeamQuery,
  deleteTeamQuery,
  getTeamMembershipQuery,
  getTeamsByUserIdQuery,
  getTeamWithMembersQuery,
  removeMemberQuery,
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
      "You are not a admin of this team",
    );
  }

  if (membership.role != "ADMIN") {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "Only the admin can delete the team",
    );
  }

  await deleteTeamQuery(teamId);
};

export const inviteMember = async (
  teamId: string,
  targetUserId: string,
  requestorUserId: string,
) => {
  const requestorMembership = await getTeamMembershipQuery(
    teamId,
    requestorUserId,
  );
  if (!requestorMembership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }
  if (requestorMembership.role !== "OWNER") {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "Only owner can invite members",
    );
  }

  // TODO: Send Email Invite (Later Plans)

  const existingMembership = await getTeamMembershipQuery(teamId, targetUserId);
  if (existingMembership) {
    throw new AppError(
      ErrorCode.INVALID_INPUT,
      "User is already a member of this team",
    );
  }

  return await addMemberQuery(teamId, targetUserId);
};

export const removeMember = async (
  teamId: string,
  targetUserId: string,
  requestorUserId: string,
) => {
  const requestorMembership = await getTeamMembershipQuery(
    teamId,
    requestorUserId,
  );

  if (!requestorMembership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }
  if (requestorMembership.role !== "OWNER") {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "Only owner can remove members",
    );
  }
  if (targetUserId == requestorUserId) {
    throw new AppError(
      ErrorCode.INVALID_INPUT,
      "Owner cannot remove themselves, delete the team instead",
    );
  }

  const targetMembership = await getTeamMembershipQuery(teamId, targetUserId);
  if (!targetMembership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "User is not a member of this team",
    );
  }

  await removeMemberQuery(teamId, targetUserId);
};

export const leaveTeam = async (teamId: string, userId: string) => {
  const membership = await getTeamMembershipQuery(teamId, userId);
  if (!membership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }

  if (membership.role === "OWNER") {
    throw new AppError(
      ErrorCode.INVALID_INPUT,
      "Owner cannot remove themselves, delete the team instead",
    );
  }

  await removeMemberQuery(teamId, userId);
};
