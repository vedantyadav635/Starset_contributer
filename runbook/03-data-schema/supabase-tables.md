# Supabase Database Schema

> Last Updated: 2026-09-14  
> Database: PostgreSQL via Supabase

## Tables

### `profiles`

Stores contributor profile data, linked to `auth.users`.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | `uuid` | NO | Primary key, references `auth.users.id` |
| `contributor_id` | `serial` | YES | Auto-incrementing contributor number |
| `name` | `text` | NO | Full name |
| `email` | `text` | NO | Email address |
| `age` | `integer` | YES | Age |
| `gender` | `text` | YES | Gender |
| `location` | `text` | YES | City/Country |
| `languages` | `jsonb` | YES | Array of `{ language, proficiency }` |
| `devices` | `text[]` | YES | Device types used |
| `balance` | `decimal` | NO | Current earnings balance (default: 0) |
| `completed_tasks` | `integer` | NO | Total completed (default: 0) |
| `role` | `text` | NO | `'contributor'` or `'admin'` |
| `created_at` | `timestamptz` | NO | Registration timestamp |

### `tasks`

Admin-created data collection tasks.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | `uuid` | NO | Primary key |
| `title` | `text` | NO | Task title |
| `type` | `text` | NO | TaskType enum value |
| `compensation` | `decimal` | NO | Payment per completion |
| `currency` | `text` | NO | Currency code (USD, INR, etc.) |
| `estimated_time_sec` | `integer` | YES | Estimated time in seconds |
| `status` | `text` | NO | TaskStatus enum value |
| `language` | `text` | NO | Target language |
| `instructions` | `text` | YES | Markdown instructions |
| `deadline` | `timestamptz` | YES | Task deadline |
| `image_url` | `text` | YES | Reference image URL |
| `ai_capability` | `text` | YES | AI model being trained |
| `data_usage` | `text` | YES | Data consent scope |
| `prompt` | `text` | NO | The task prompt/question |
| `options` | `jsonb` | YES | Survey/evaluation options |
| `project` | `text` | NO | Parent project name |
| `difficulty` | `text` | NO | Beginner/Intermediate/Expert |
| `requirements` | `text[]` | YES | Required equipment/conditions |
| `submission_count` | `integer` | NO | Current submissions (default: 0) |
| `max_submissions` | `integer` | NO | Maximum allowed (default: 100) |
| `created_at` | `timestamptz` | NO | Creation timestamp |
| `created_by` | `uuid` | NO | Admin user ID |

### `submissions`

Contributor task submissions.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | `uuid` | NO | Primary key |
| `task_id` | `uuid` | NO | References `tasks.id` |
| `user_id` | `uuid` | NO | References `auth.users.id` |
| `type` | `text` | NO | Submission type (audio, image, text, playlist) |
| `status` | `text` | NO | `pending` / `approved` / `rejected` |
| `data` | `jsonb` | YES | Submission content/metadata |
| `file_url` | `text` | YES | Uploaded file URL |
| `file_size` | `integer` | YES | File size in bytes |
| `duration` | `decimal` | YES | Audio duration in seconds |
| `metadata` | `jsonb` | YES | Validation metadata |
| `admin_notes` | `text` | YES | Admin review notes |
| `reviewed_by` | `uuid` | YES | Admin who reviewed |
| `reviewed_at` | `timestamptz` | YES | Review timestamp |
| `created_at` | `timestamptz` | NO | Submission timestamp |

### `transactions`

Payment/earning records.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | `uuid` | NO | Primary key |
| `user_id` | `uuid` | NO | References `auth.users.id` |
| `amount` | `decimal` | NO | Payment amount |
| `currency` | `text` | NO | Currency code |
| `description` | `text` | YES | Description |
| `status` | `text` | NO | `Pending` / `Processed` / `Failed` |
| `submission_id` | `uuid` | YES | Related submission |
| `created_at` | `timestamptz` | NO | Transaction timestamp |

## Row Level Security (RLS)

| Table | Policy | Rule |
|-------|--------|------|
| `profiles` | Read own | `auth.uid() = id` |
| `profiles` | Update own | `auth.uid() = id` |
| `tasks` | Read all (authenticated) | `auth.role() = 'authenticated'` |
| `tasks` | Insert (admin only) | Service-role via server |
| `submissions` | Read own | `auth.uid() = user_id` |
| `submissions` | Insert own | `auth.uid() = user_id` |
| `transactions` | Read own | `auth.uid() = user_id` |

> ⚠️ **Admin operations bypass RLS** — the server uses the `service_role` key.

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  auth.users  │────▶│   profiles   │     │    tasks     │
│  (Supabase)  │     │              │     │              │
└──────┬───────┘     └──────────────┘     └──────┬───────┘
       │                                         │
       │              ┌──────────────┐           │
       └─────────────▶│ submissions  │◀──────────┘
                      │              │
                      └──────┬───────┘
                             │
                      ┌──────▼───────┐
                      │ transactions │
                      │              │
                      └──────────────┘
```
