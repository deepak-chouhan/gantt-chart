export type WsEventType =
  | "task:created"
  | "task:updated"
  | "task:deleted"
  | "project:updated"
  | "job:completed"
  | "job:failed"
  | "error"
  | "ping"
  | "pong";

export interface WsMessage<T> {
  event: WsEventType;
  data?: T;
}

export interface WsEvent<T> extends WsMessage<T> {
  projectId: string;
}

export interface AuthenticatedWebSocket extends WebSocket {
  userId: string;
  projectId: string;
  isAlive: boolean;
}
