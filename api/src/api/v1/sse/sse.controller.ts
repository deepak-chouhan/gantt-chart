import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError.js";
import { ErrorCode } from "../../../types/error.types.js";

export const sseClients = new Map<
  string,
  { res: Response; projectId: string; userId: string }[]
>();

export const sseEventController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = req.params.projectId as string;
    const userId = req.user.id;

    // SSE Stream Headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const client = { res, projectId, userId };
    const existing = sseClients.get(projectId) ?? [];
    sseClients.set(projectId, [...existing, client]);

    const hearbeat = setInterval(() => {
      res.write(": hearbeat\n\n");
    }, 30_000);

    req.on("close", () => {
      clearInterval(hearbeat);
      const remaining = (sseClients.get(projectId) ?? []).filter(
        (c) => c !== client,
      );
      sseClients.set(projectId, remaining);
    });
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }

    return next(
      new AppError(ErrorCode.INTERNAL_SERVER_ERROR, "Internal Server Error"),
    );
  }
};
