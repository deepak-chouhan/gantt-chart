import { env } from "./env.js";
import { Redis } from "ioredis";
import { logger } from "./logger.js";

export const redis = new Redis(env.redisUrl);

redis.on("connect", () => logger.info("Redis conneted."));
redis.on("error", (err) => logger.error("Redis error:", err));
