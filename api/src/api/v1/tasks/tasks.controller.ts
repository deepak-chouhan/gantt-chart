import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpStatus } from "../../../types/error.types.js";
import {
  createTask,
  deleteTask,
  getTask,
  getTasksByProject,
  updateTask,
} from "./tasks.service.js";
import AppError from "../../../utils/appError.js";
import ApiResponse from "../../../utils/apiResponse.js";

export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = req.params.projectId as string;
    const userId = req.user.id;
    const { name, status, startDate, endDate, assigneeId, parentTaskId } =
      req.body;

    const task = await createTask(
      name,
      status,
      startDate,
      endDate,
      projectId,
      assigneeId ?? null,
      parentTaskId ?? null,
      userId,
    );

    return res.status(HttpStatus.CREATED).json(
      new ApiResponse({
        statusCode: HttpStatus.CREATED,
        message: "Task created successfully",
        data: { task },
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

export const getTasksByProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tasks = await getTasksByProject(
      req.params.projectId as string,
      req.user.id,
    );

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Tasks retrieved successfully",
        data: { tasks },
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

export const getTaskByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await getTask(req.params.taskId as string, req.user.id);

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Task retrieved successfully",
        data: { task },
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

export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.taskId as string;
    const { name, status, startDate, endDate, assigneeId, parentTaskId } =
      req.body;

    const task = await updateTask(taskId, userId, {
      name,
      status,
      startDate,
      endDate,
      assigneeId,
      parentTaskId,
    });

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Task updated successfully",
        data: { task },
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

export const deleteTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.taskId as string;
    await deleteTask(taskId, userId);

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Task deleted successfully",
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
