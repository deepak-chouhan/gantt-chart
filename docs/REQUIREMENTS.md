# Gantt Chart Collaboration Tool — Requirements

### 0. TERMINOLOGIES

1. **Ubiquitous** - Always active: `The system shall...`
2. **Event-driven** - Triggered by event: `WHEN <event> the system shall...`
3. **Unwanted-behavior** - What to avoid: `IF <condition> THEN the system shall...`
4. **State-driven** - Depends on state: `WHILE <state> the system shall...`

### 1. AUTHENTICATION

- **AUTH-001** [Ubiquitous]: THE system shall identify every user by a unique ID, email and display name.
- **AUTH-002** [Event-driven]: WHEN a user initiates Google OAuth login, the system shall validate the OAuth token, create the user if they don't exist, and return a signed JWT and refresh token.
- **AUTH-003** [Event-driven]: WHEN a JWT access token expires, THE system shall accept a valid refresh token and issue a new access token without requiring re-login.
- **AUTH-004** [Event-driven]: WHEN a refresh token us used, THE system shall rotate it and invalidate the previous one.
- **AUTH-005** [Unwanted-behavior]: IF a request is made to a protected endpoint without a valid JWT, THE system shall return a `401` unauthorized response.
- **AUTH-006** [Unwanted-behavior]: IF a refresh token is expired or invalid, THE system shall return a 401 and require the user to re-authenticate.

### 2. PROJECTS

- **PROJ-001** [Ubiquitous]: THE system shall store each project with a name, description, start date, end date, and owner.
- **PROJ-002** [Event-driven]: WHEN a team member creates a project, THE system shall persist it and return the created project object.
- **PROJ-003** [Event-driven]: WHEN a project is updated, THE system shall broadcast the change to all users currently subscribed to that project via WebSocket.
- **PROJ-003** [Unwanted-behaviour]: IF a project's end date is set to before its start date, THE system shall return a 400 Bad Request with a descriptive error.

### 3. TASKS & SUBTASKS

- **TASK-001** [Ubiquitous]: THE system shall store following data for each task:
    - Name
    - Status
    - Assigne
    - Start Date
    - End Date
    - Parent Project
- **TASK-002** [Event-driven]: WHEN a task is created/updated/deleted, THE system shall boardcast the event to all users subscribed to the parent project via WebSocket.
- **TASK-003** [Event-driven]: WHEN the task's status is updated to **completed**, THE system shall check if all sibling tasks are completed and If so, emit a project completion event.
- **TASK-004** [Unwanted-behaviour]: IF a task's end date is set to before its start date, the system shall return a 400 Bad Request.

### 4. REAL-TIME COLLABORATION

- **COLL-001** [Event-driven]: WHEN a user opens a project, the system shall subscribe them to a project-specific Redis pub/sub channel.
- **COLL-002** [Event-driven]: WHEN a mutation occurs on Task or Project, THE system shall publish the change to the redis channel and broadcast it to all subscribed WebSocket connections.
- **COLL-004** [Event-driven]: WHEN a users closes or leaves a project, THE system shall unsubscribe them from the channel.
- **COLL-005** [Unwanted-behavior]: IF a WebSocket connection drop unexpectedly, THE system shall clean up the subscription without affecting other connected users.
- **COLL-006** [State-driven]: WHILE a user is connected via WebSocket, THE system shall send a heartbeat ping every 30 seconds to detect stale connections.

### 5. CSV IMPORT/EXPORT

- **DATA-001** [Event-driven]: WHEN a user requests a CSV export of a project, THE system shall enqueue a background job and return a job ID immediately with a 202 Accepted response.
- **DATA-002** [Event-driven]: WHEN the export job completes, THE system shall store the CSV in S3 and notify the user via WebSocket with a download URL.
- **DATA-003** [Event-driven]: WHEN a user upload a CSV, the system shall validate the format, enqueue a background job and return a 2023 Accepted with a job ID.
- **DATA-004** [Unwanted-behaviour]: IF a background job fails, THE system shall retry upto 3 times before marking it as failed and notifying the user.

### 5. CACHING

- **CACH-001** [State-driven]: WHILE serving GET request for project detals and task lists, THE system shall return cached response from Redis when available.
- **CACH-002** [Event-driven]: WHEN a project or task is mutated, THE system shall invalidate the relevant Redis cache keys.
- **DATA-003** [Ubiquitous]: THE system shall set a TTL of 5 minutes on all caches project and task responses.

### 5. ENTITIES

```
Entities
|
|---- Users
|   |---- id
|   |---- name
|   |---- email
|   |---- google_id
|   |---- avatar_url
|   |---- provider
|   |---- created_at
|   |---- updated_at
|
|---- Teams
|   |---- id
|   |---- name
|   |---- owner_id
|   |---- created_at
|
|---- TeamMembers
|   |---- team_id
|   |---- user_id
|   |---- role
|   |---- created_at
|
|---- Projects
|   |---- id
|   |---- name
|   |---- description
|   |---- start_date
|   |---- end_date
|   |---- team_id
|
|---- Tasks
|   |---- id
|   |---- name
|   |---- status
|   |---- start_date
|   |---- end_date
|   |---- assignee_id
|   |---- project_id
|   |---- parent_task_id
|
|---- RefreshTokens
|   |---- id
|   |---- user_id
|   |---- token_hash
|   |---- revoked
|   |---- created_at
|   |---- expires_at
|
|---- Jobs
|   |---- id
|   |---- name
|   |---- type
|   |---- status
|   |---- project_id
|   |---- user_id
|   |---- file_url
|   |---- retry_count
|   |---- error_message
```