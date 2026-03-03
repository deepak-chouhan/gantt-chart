import { ErrorCode, HttpStatus } from "../../../types/error.types.js";

export const ErrorStatusMap: Record<ErrorCode, HttpStatus> = {
  [ErrorCode.INVALID_INPUT]: HttpStatus.BAD_REQUEST,
  [ErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.FORBIDDEN_ACCESS]: HttpStatus.FORBIDDEN,
  [ErrorCode.RESOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};

export default class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: String;
  public readonly details?: unknown;

  constructor(
    errorCode: ErrorCode,
    message: string,
    details?: unknown,
    statusCode?: HttpStatus,
  ) {
    super(message);
    this.statusCode = statusCode ?? ErrorStatusMap[errorCode];
    this.errorCode = errorCode;
    this.details = details;
  }
}
