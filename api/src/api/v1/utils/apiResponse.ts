import { HttpStatus } from "../../../types/error.types.js";

interface ApiResponseOptions {
  statusCode: HttpStatus;
  message: string;
  data?: object;
  error?: object;
}

export default class ApiResponse {
  statusCode: HttpStatus;
  data?: object;
  error?: object;
  message?: string;
  success: boolean;
  constructor({ statusCode, message, data, error }: ApiResponseOptions) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
    this.success = statusCode < 400;
  }
}
