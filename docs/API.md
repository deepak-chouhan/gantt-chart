# API Design

## ROUTES

Base URL: `/api/v1`

### AUTH Route

```
POST /auth/google
POST /auth/refresh
POST /auth/logout
POST /auth/me
```

### TEAM Route

```
POST /teams                             # Creates Team
GET /teams                              # Gets team with matching user membership
GET /teams/:teamId                      # Gets team with teamIdd along with members
PATCH /teams/:teamId                    # Updates team with teamId
DELETE /team/:teamId                    # Deletes team with teamId and membership

POST /teams/:teamId/members             
DELETE /team/:teamId/members/:userId
```

### PROJECT Route

```
POST /teams/:teamId/projects
GET /teams/:teamId/projects

GET /projects/:projectId
PATCH /projects/:projectId
DELETE /projects/:projectId
```

### TASK Route

```
POST /projects/:projectId/tasks
GET /projects/:projectId/tasks

GET /tasks/:taskId
PATCH /tasks/:taskId
DELETE /tasks/:taskId
```

### CSV IMPORT/EXPORT Route

```
POST /projects/:projectId/export
POST /projects/:projectId/import

GET /jobs/:jobId
```

### WEBSOCKET Route

```
WS /ws/projects/:projectId
```

## RESPONSES

### SUCCESS Response

```json
{
    "success": true,
    "data": { ... }
}
```

### ERROR Response

```json
{
    "success": false,
    "error": {
        "code": "FOREBIDEN_ACCESS",
        "message": "User does not have access to view the project"
    }
}
```

## MIDDLEWARE Stack

```
Request -> RateLimit -> Auth -> RouteHandler -> ErrorHandler -> Response
```
