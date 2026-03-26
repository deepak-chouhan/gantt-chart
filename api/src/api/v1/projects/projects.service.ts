import { ErrorCode } from "../../../types/error.types.js";
import { IProject } from "../../../types/project.types.js";
import AppError from "../../../utils/appError.js";
import { getTeamMembershipQuery } from "../teams/teams.query.js";
import {
  createProjectQuery,
  getProjectByIdQuery,
  getProjectsByTeamIdQuery,
  updateProjectQuery,
} from "./projects.query.js";

export const assertProjectExists = async (
  projectId: string,
): Promise<IProject> => {
  const project = await getProjectByIdQuery(projectId);
  if (!project) {
    throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Project not found");
  }

  return project;
};

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

  return await getProjectsByTeamIdQuery(teamId);
};

export const getProject = async (projectId: string, userId: string) => {
  const project = await assertProjectExists(projectId);

  const membership = await getTeamMembershipQuery(project.teamId, userId);
  if (!membership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }

  return project;
};

export const updateProject = async (
  projectId: string,
  userId: string,
  fields: Partial<
    Pick<IProject, "name" | "description" | "statDate" | "endDate">
  >,
) => {
  const project = await assertProjectExists(projectId);

  const membership = await getTeamMembershipQuery(project.teamId, userId);
  if (!membership) {
    throw new AppError(
      ErrorCode.FORBIDDEN_ACCESS,
      "You are not a member of this team",
    );
  }

  const newStartDate = fields.statDate ?? project.statDate;
  const newEndDate = fields.endDate ?? project.endDate;

  if (new Date(newEndDate) < new Date(newStartDate)) {
    throw new AppError(
      ErrorCode.INVALID_INPUT,
      "end_date must be after start_date",
    );
  }

  return await updateProjectQuery(project.id, fields);
};
