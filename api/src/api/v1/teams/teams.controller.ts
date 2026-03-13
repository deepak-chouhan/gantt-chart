import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError.js";
import { ErrorCode, HttpStatus } from "../../../types/error.types.js";
import {
  createTeam,
  deleteTeam,
  getMyTeams,
  getTeamWithMembers,
  updateTeam,
} from "./teams.service.js";
import ApiResponse from "../../../utils/apiResponse.js";

export const createTeamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const team = await createTeam(name, req.user.id);

    return res.status(HttpStatus.CREATED).json(
      new ApiResponse({
        statusCode: HttpStatus.CREATED,
        message: "Team created successfully.",
        data: { team },
      }),
    );
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(ErrorCode.INVALID_INPUT, "Something went wrong"));
  }
};

export const getMyTeamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teams = await getMyTeams(req.user.id);

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Teams retrieved successfully",
        data: { teams },
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

export const getTeamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const team = await getTeamWithMembers(
      req.params.teamId as string,
      req.user.id,
    );

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus,
        message: "Team retrieved successfully",
        data: { team },
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

export const updateTeamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;

    const team = await updateTeam(
      req.params.teamId as string,
      req.user.id,
      name,
    );

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Team updated successfully",
        data: { team },
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

export const deleteTeamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteTeam(req.params.teamId as string, req.user.id);

    return res.status(HttpStatus.OK).json(
      new ApiResponse({
        statusCode: HttpStatus.OK,
        message: "Team deleted successfully",
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
