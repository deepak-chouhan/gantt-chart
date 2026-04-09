import { ErrorCode } from "../../../types/error.types.js";
import AppError from "../../../utils/appError.js";
import { assertProjectExists } from "../projects/projects.service.js";
import { getTeamMembershipQuery } from "../teams/teams.query.js";
import { assertTeamMember } from "../teams/teams.service.js";
import {
  createTaskQuery,
  getTaskByIdQuery,
  getTasksByProjectIdQuery,
} from "./tasks.query.js";

export const assertTaskExists = async (taskId: string) => {
  const task = await getTaskByIdQuery(taskId);
  if (!task) {
    throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Task not found");
  }
  return task;
};

export const createTask = async (
  name: string,
  status: string,
  startDate: string,
  endDate: string,
  projectId: string,
  assigneeId: string | null,
  parentTaskId: string | null,
  userId: string,
) => {
  const project = await assertProjectExists(projectId);
  await assertTeamMember(project.teamId, userId);

  if (assigneeId) {
    const assigneeMembership = await getTeamMembershipQuery(
      project.teamId,
      assigneeId,
    );

    if (!assigneeMembership) {
      throw new AppError(
        ErrorCode.INVALID_INPUT,
        "Assignee must be a member of the project team",
      );
    }
  }

  if (parentTaskId) {
    const parentTask = await assertTaskExists(parentTaskId);

    if (parentTask.projectId !== projectId) {
      throw new AppError(
        ErrorCode.INVALID_INPUT,
        "Parent task must belong to the same project",
      );
    }

    if (parentTask.parentTaskId) {
      throw new AppError(
        ErrorCode.INVALID_INPUT,
        "Subtasks cannot have their own subtasks",
      );
    }
  }

  return await createTaskQuery(
    name,
    status,
    startDate,
    endDate,
    projectId,
    assigneeId,
    parentTaskId,
  );
};

export const getTasksByProject = async (projectId: string, userId: string) => {
  const project = await assertProjectExists(projectId);
  await assertTeamMember(project.teamId, userId);
  return await getTasksByProjectIdQuery(projectId);
};

export const getTask = async (taskId: string, userId: string) => {
  const task = await assertTaskExists(taskId);
  const project = await assertProjectExists(task.projectId);
  await assertTeamMember(project.teamId, userId);

  return task;
};
