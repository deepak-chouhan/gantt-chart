# ADR 001: snake_case to cameCase transformation strategy

## Date

2026-03-26

## Status

Accepted

## Context

PostgreSQL conventionally uses snake_case for column name(e.g. `start_date`, `team_id`, `created_at`). TypeScript and JavaScript conventionally uses cameCase (e.g. `startDate`, `teamId`, `createdAt`). Since we are using raw SQL queries without an ORM, there is no built-in mapping between the two conventions.

We need a consistent strategy to handle this mismatch across all query results.

## Decision

We apply a the camseCase transformation explicitly at the query function using two utility function is `src/utils/tranform.ts`:

- `toCamelCaseKeys<T>(obj)` - transforms a singleDB row

Every query function in `*.queries.ts` is responsible for calling the appropriate transform before returning the results. No tranform logic exists in service or controller layer.

## Alternatives considered

### Option 1 : SQL column aliases per query

Manually alias every snake_case column in every query: `SELECT start_date AS "startDate"`.

Rejected because it requires repetitive boilerplate in every query and
is easy to forget, especially when adding new columns.

### Option 2 : Global pool-level transform

Override `pool.query` once to auto-transform all rows globally.

Rejected because it is implicit, the transform is invisible at the
query level making debugging harder. It also makes the pool config
responsible for a concern that belongs in the data layer.

### Option 3 : Per-query transform utilities (chosen)

Call `toCamelCaseKeys` explicitly in each query function.

Accepted because:

- Transform is visible and explicit at the point of data access.
- Each query function has full control over its output shape.
- Easier to debug, you can see exactly where the mapping happens

## Consequences

- Every query function must call `toCamelCaseKeys` before returning. this is a convention that must be followed consistently

- `toSnakeCaseKeys` was considered but not implemented. Raw SQL with explicit `$1, $2` parameters does not require converting object keys to snake_case since column names are hardcoded in query strings

## Files

- `src/utils/transforms.ts` — transform utilities
- `src/*/**.queries.ts` — all query functions apply transform before returning
