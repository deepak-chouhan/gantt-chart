import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError.js";
import { ErrorCode, HttpStatus } from "../../../types/error.types.js";
import { createTeam, getMyTeams } from "./teams.service.js";
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
    if (error instanceof Error) {
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
  const teams = await getMyTeams(req.user.id);

  return res.status(HttpStatus.OK).json(
    new ApiResponse({
      statusCode: HttpStatus.OK,
      message: "Teams retrieved successfully",
      data: { teams },
    }),
  );
};


