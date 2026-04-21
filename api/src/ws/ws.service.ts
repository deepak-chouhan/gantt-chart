import WebSocket, { WebSocketServer } from "ws";
import { redis } from "../config/redis.js";
import { AuthenticatedWebSocket, WsEventType } from "./ws.types.js";
import { logger } from "../config/logger.js";

const CHANNEL = "gantt:events";

export const publishEvent = async <T>(
  projectId: string,
  event: WsEventType,
  data: T,
) => {
  const message = JSON.stringify({ projectId, event, data });
  await redis.publish(CHANNEL, message);
};

export const subscribeToRedis = (wss: WebSocketServer) => {
  const subscriber = redis.duplicate();
  subscriber.subscribe(CHANNEL, (err) => {
    if (err) {
      logger.error("Redis subscription error: ", err);
      return;
    }

    logger.info(`Subscribed to Redis channel: ${CHANNEL}`);
  });

  subscriber.on("message", (_channel, message) => {
    try {
      const { projectId, event, data } = JSON.parse(message);

      wss.clients.forEach((client) => {
        const ws = client as unknown as AuthenticatedWebSocket;

        if (ws.readyState === WebSocket.OPEN && ws.projectId === projectId) {
          ws.send(JSON.stringify({ event, data }));
        }
      });
    } catch (error) {
      logger.error("Error processing Redis message:", error);
    }
  });
};
