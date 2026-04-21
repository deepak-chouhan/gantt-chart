import { Server } from "node:http";
import { WebSocketServer } from "ws";

const HEARTBEAT_INTERVAL = 30_000;

export const initWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server, path: "/ws" });

  // TODO: Complete websocket initialization
};
