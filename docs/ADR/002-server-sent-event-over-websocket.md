# ADR 002: Server-Sent Events over WebSocket for real-time updates

## Date

2026-04-23

## Status

Accepted

## Context

The Gantt chart app requires real-time updates when tasks or projects are mutated, connected clients need to see changes immediately without polling.

Two options were considered: WebSocket and SSE.

## Decision

Use SSE (Server-Sent Events) via Express's streaming response for real-time event delivery to clients.

Redis pub/sub is still used to fan out events across server instances via a single shared channel `gantt:events`.

## Alternatives considered

### Option 1 : WebSocket

Bidirectional persistent connection. Necessary when the client needs to send data over the persistent connection. In this app all mutations go through REST, the persistent connection is only ever used server -> client.

### Option 2 : Polling

Client polls REST endpoint on an interval. Simple but inefficient, generates unecessary load and introduces latency proportional to poll interval.

### Option 3 : Server Sent Event (SSE)

Unidirection server -> client streaming over standard HTTP. Sufficient because clients never need to send data over persistent connection.

## Consequences

- Client connect via `GET /api/v1/sse/:projectId
- All mutation continue to use REST endpoint
- If bidirection communication is needed in future, migration to WebSocket would be required

## Files

- `src/sse/sse.service.ts` - SSE Handler
- `src/api/v1/sse/sse.routes.ts` - SSE route registration
- `src/server.ts` - calls `subscribeToRedis()` at startup
