import express, { NextFunction, Request, Response } from "express";
import healthRouter from "./routes/health.js";
import V1Router from "./api/v1/index.js";
import AppError from "./api/v1/utils/appError.js";
import ApiResponse from "./api/v1/utils/apiResponse.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./api/v1/docs/swagger.js";

const app = express();
app.use(express.json())

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/v1/openapi.json", (_req, res) => res.json(swaggerSpec));
app.use("/api/v1", V1Router);

app.use("/health", healthRouter);

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  return res.status(err.statusCode || 500).json(
    new ApiResponse({
      statusCode: err.statusCode,
      message: err.message,
      error: {
        code: err.errorCode || "INTERNAL_SERVER_ERROR",
        message: err.message,
        details: err.details || null,
      },
    }),
  );
});

export default app;
