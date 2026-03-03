import express, { NextFunction, Request, Response } from "express";
import healthRouter from "./routes/health.js";
import V1Router from "./api/v1/index.js";
import AppError from "./api/v1/utils/appError.js";

const app = express();

app.use("/health", healthRouter);

app.use("/api/v1", V1Router);

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  return res.status(err.statusCode || 500).json({
    sucess: false,
    error: {
      code: err.errorCode || "INTERNAL_SERVER_ERROR",
      message: err.message,
      details: err.details || null,
    },
  });
});

export default app;
