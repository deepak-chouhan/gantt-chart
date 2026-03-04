import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "./env.js";

const { combine, timestamp, errors, json } = winston.format;

const logLevel = env.node_env === "production" ? "info" : "debug";

const baseFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  errors({ stack: true }),
  json(),
);

export const logger = winston.createLogger({
  level: "info",
  format: baseFormat,
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "5m",
      maxFiles: "14d",
      level: "info",
    }),

    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "5m",
      maxFiles: "30d",
      level: "error",
    }),
  ],

  exceptionHandlers: [
    new DailyRotateFile({
      filename: "logs/exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "5m",
      maxFiles: "30d",
    }),
  ],

  rejectionHandlers: [
    new DailyRotateFile({
      filename: "logs/rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "5m",
      maxFiles: "30d",
    }),
  ],
});
