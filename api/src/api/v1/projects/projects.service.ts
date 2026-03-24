import { ErrorCode } from "../../../types/error.types.js";
import AppError from "../../../utils/appError.js";
import { getTeamMembershipQuery } from "../teams/teams.query.js";
import {
  createProjectQuery,
  getAllTeamProjectsQuery,
} from "./projects.query.js";

export const createProject = async (
  name: string,
  description: string | null,
  startDate: string,
  endDate: string,
  teamId: string,
  userId: string,
) => {
  const membership = await getTeamMembershipQuery(teamId, userId);
  if (!membership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }

  return await createProjectQuery(
    name,
    description,
    startDate,
    endDate,
    teamId,
  );
};

export const getAllTeamProjects = async (teamId: string, userId: string) => {
  const membership = await getTeamMembershipQuery(teamId, userId);
  if (!membership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }

  return await getAllTeamProjectsQuery(teamId);
};
