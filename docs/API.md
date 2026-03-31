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

POST /teams/:teamId/members             # Add a user's membership in team
DELETE /teams/:teamId/members/:userId   # Remove a user's membership from team
```

### PROJECT Route

```
POST /teams/:teamId/projects            # Create a Project for team
GET /teams/:teamId/projects             # Get all projects for team

GET /projects/:projectId                # Get project by Id
PATCH /projects/:projectId              # Update a project
DELETE /projects/:projectId             # Delete a project
```

### TASK Route

```
POST /projects/:projectId/tasks         # Create a task in a project
GET /projects/:projectId/tasks          # Get all tasks in a project

GET /tasks/:taskId                      # Get a task by Id
PATCH /tasks/:taskId                    # Update a task
DELETE /tasks/:taskId                   # Delete a task
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
