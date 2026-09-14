# API Contracts

> Last Updated: 2026-09-14  
> Source: [`client/config/api.ts`](file:///e:/starset%20intelligence/Starset_contributer/client/config/api.ts)  
> Server: [`server/src/app.ts`](file:///e:/starset%20intelligence/Starset_contributer/server/src/app.ts)

## Base URL

| Environment | URL |
|------------|-----|
| **Local** | `http://localhost:3000` |
| **Production** | `https://starset-contributer.onrender.com` |
| **Fallback** | If `VITE_API_URL` is empty, defaults to production |

## Authentication

All API routes (except `/health`) require a valid Supabase JWT token:

```
Authorization: Bearer <supabase-jwt-token>
```

Admin routes additionally require `role = 'admin'` in the user's profile.

## Rate Limiting

| Scope | Window | Max Requests |
|-------|--------|-------------|
| Global | 15 minutes | 200 per IP |

---

## Health Check

### `GET /health`
**Auth:** None  
**Purpose:** Keep-alive for Render free tier

```json
// Response: 200 OK
{ "status": "ok" }
```

---

## Admin Endpoints

> 🔒 All admin routes require `requireAuth` + `requireAdmin` middleware.

### `GET /admin/tasks`
**Purpose:** List all tasks (admin view)

```json
// Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Record English greetings",
    "type": "Audio Collection",
    "compensation": 0.50,
    "currency": "USD",
    "submission_count": 42,
    "max_submissions": 100,
    ...
  }
]
```

### `POST /admin/tasks`
**Purpose:** Create a new task

```json
// Request Body
{
  "title": "Record English greetings",
  "type": "Audio Collection",
  "compensation": 0.50,
  "currency": "USD",
  "language": "English",
  "prompt": "Say 'Hello, how are you?' naturally",
  "project": "English ASR v2",
  "difficulty": "Beginner",
  "instructions": "Speak clearly in a quiet room...",
  "ai_capability": "Speech Recognition",
  "data_usage": "Model training only",
  "estimated_time_sec": 120,
  "deadline": "2026-12-31T00:00:00Z",
  "requirements": ["Headphones"],
  "max_submissions": 100
}

// Response: 201 Created
{ "id": "uuid", "message": "Task created successfully" }
```

### `DELETE /admin/tasks/:taskId`
**Purpose:** Delete a task

```json
// Response: 200 OK
{ "message": "Task deleted successfully" }
```

### `GET /admin/stats`
**Purpose:** Platform analytics

```json
// Response: 200 OK
{
  "totalTasks": 45,
  "totalSubmissions": 1234,
  "pendingSubmissions": 56,
  "totalContributors": 320,
  "totalPayout": 5432.50
}
```

### `GET /admin/submissions`
**Purpose:** All submissions (with filters)

**Query Params:** `?status=pending&task_id=uuid&page=1&limit=20`

### `GET /admin/submissions/pending`
**Purpose:** Pending submissions only

### `PUT /admin/submissions/:id/approve`
**Purpose:** Approve a submission

```json
// Response: 200 OK
{ "message": "Submission approved", "submission_id": "uuid" }
```

### `PUT /admin/submissions/:id/reject`
**Purpose:** Reject a submission

```json
// Request Body (optional)
{ "reason": "Audio quality too low" }

// Response: 200 OK
{ "message": "Submission rejected", "submission_id": "uuid" }
```

### `GET /admin/export/:taskId`
**Purpose:** Export task submission data

```json
// Response: 200 OK (or CSV download)
{
  "task": { ... },
  "submissions": [ ... ],
  "metadata": {
    "total": 42,
    "approved": 38,
    "rejected": 4,
    "exported_at": "2026-09-14T12:00:00Z"
  }
}
```

---

## Contributor Endpoints

> 🔒 Requires `requireAuth` middleware.

### `GET /contributor/tasks`
**Purpose:** List available tasks for contributors

```json
// Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Record English greetings",
    "type": "Audio Collection",
    "compensation": 0.50,
    "currency": "USD",
    "difficulty": "Beginner",
    "project": "English ASR v2",
    "submission_count": 42,
    ...
  }
]
```

---

## Submission Endpoints

> 🔒 Requires `requireAuth` middleware.

### `POST /submissions/audio`
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `audio` | File | Yes | Audio file (WAV, MP3, WebM, OGG) |
| `task_id` | string | Yes | Task UUID |
| `user_id` | string | Yes | Supabase user UUID |
| `metadata` | JSON string | No | Client-side validation data |

### `POST /submissions/image`
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | Yes | Image file (JPEG, PNG, WebP) |
| `task_id` | string | Yes | Task UUID |
| `user_id` | string | Yes | Supabase user UUID |
| `labels` | JSON string | No | Image labels/annotations |

### `POST /submissions/text`
**Content-Type:** `application/json`

```json
{
  "task_id": "uuid",
  "user_id": "uuid",
  "text": "The annotated text content...",
  "annotations": {}
}
```

### `POST /submissions/playlist`
**Content-Type:** `application/json`

```json
{
  "task_id": "uuid",
  "user_id": "uuid",
  "selections": ["track_id_1", "track_id_2"],
  "metadata": {}
}
```

---

## User Endpoints

> 🔒 Requires `requireAuth` middleware.

### `GET /user/submissions/:userId`
**Purpose:** User's submission history

### `GET /user/submissions/:userId/task/:taskId`
**Purpose:** Check if user already completed a specific task

```json
// Response: 200 OK
{ "completed": true, "submission_id": "uuid" }
```

### `GET /user/stats/:userId`
**Purpose:** User dashboard statistics

```json
// Response: 200 OK
{
  "completedTasks": 15,
  "pendingTasks": 3,
  "totalEarnings": 45.50,
  "recentSubmissions": [ ... ]
}
```

---

## Error Response Format

All errors follow this shape:

```json
{
  "error": "Human-readable error message"
}
```

| Status | Meaning |
|--------|---------|
| `400` | Bad request — invalid input |
| `401` | Unauthorized — missing or invalid JWT |
| `403` | Forbidden — insufficient role (not admin) |
| `404` | Not found |
| `429` | Rate limited |
| `500` | Server error |
