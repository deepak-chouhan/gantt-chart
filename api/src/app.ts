import express, { NextFunction, Request, Response } from "express";

import healthRouter from "./routes/health.js";
import V1Router from "./api/v1/index.js";
import AppError from "./utils/appError.js";
import ApiResponse from "./utils/apiResponse.js";

import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./api/v1/docs/swagger.js";
import { ErrorCode, HttpStatus } from "./types/error.types.js";
import { logger } from "./config/logger.js";
import { env } from "./config/env.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/v1/openapi.json", (_req, res) => res.json(swaggerSpec));
app.use("/api/v1", V1Router);

app.use("/health", healthRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode || 500).json(
      new ApiResponse({
        statusCode: err.statusCode,
        message: err.message,
        error: {
          code: err.errorCode || "INTERNAL_SERVER_ERROR",
          message: err.message,
          details: env.node_env === "production" ? null : err.details || null,
        },
      }),
    );
  }

  // Unknown error
  const message = err instanceof Error ? err.message : "Unknown error";
  logger.error("Unhandled error:", err);
  return res.status(500).json(
    new ApiResponse({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Something went wrong",
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message:
          env.node_env === "production" ? "Something went wrong" : message,
      },
    }),
  );
});

export default app;
