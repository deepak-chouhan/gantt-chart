import { NextFunction, Request, Response } from "express";
import {
  createProject,
  deleteProject,
  getAllTeamProjects,
  getProject,
  updateProject,
} from "./projects.service.js";
import { ErrorCode, HttpStatus } from "../../../types/error.types.js";
import ApiResponse from "../../../utils/apiResponse.js";
import AppError from "../../../utils/appError.js";
import { publishEvent } from "../../../sse/sse.service.js";

export const createProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, description, startDate, endDate } = req.body;
  try {
    const { teamId } = req.params;

    const project = await createProject(
      name,
      description ?? null,
      startDate,
      endDate,
      teamId as string,
      req.user.id,
    );

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Project created successfully",
        data: {
          project,
        },
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};

export const getProjectsByTeamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projects = await getAllTeamProjects(
      req.params.teamId as string,
      req.user.id,
    );

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Teams retrieved succesfully",
        data: {
          projects,
        },
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};

export const getProjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await getProject(
      req.params.projectId as string,
      req.user.id,
    );

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Project retrieved successfully",
        data: { project },
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};

export const updateProjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await updateProject(
      req.params.projectId as string,
      req.user.id,
      req.body,
    );

    await publishEvent(project.id, "project:updated", { project });

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Project updated successfully",
        data: { project },
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};

export const deleteProjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteProject(req.params.projectId as string, req.user.id);

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Project deleted successfully",
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Something went wrong"),
    );
  }
};
