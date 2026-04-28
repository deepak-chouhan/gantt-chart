import { sseClients } from "../api/v1/sse/sse.controller.js";
import { logger } from "../config/logger.js";
import { redis } from "../config/redis.js";

const CHANNEL = "gantt:events";

export const publishEvent = async <T>(
  projectId: string,
  event: string,
  data: T,
) => {
  await redis.publish(CHANNEL, JSON.stringify({ projectId, event, data }));
};

export const subscribeToRedis = () => {
  const subscriber = redis.duplicate();

  subscriber.subscribe(CHANNEL, (err) => {
    if (err) logger.error("Redis subscription error:", err);
  });

  subscriber.on("message", (_channel, message) => {
    const { projectId, event, data } = JSON.parse(message);
    const projectClients = sseClients.get(projectId) ?? [];

    projectClients.forEach(({ res }) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  });
};
