# Database Operations

> Last Updated: 2026-09-14

## Accessing the Database

| Method | Access Level | Use For |
|--------|-------------|---------|
| Supabase Dashboard → SQL Editor | Full (as postgres) | Schema changes, debugging |
| Supabase Dashboard → Table Editor | Full (visual) | Quick data inspection |
| Server code (service_role key) | Full (bypasses RLS) | Application operations |
| Client code (anon key) | RLS-restricted | User-scoped queries |

## Common Operations

### View All Tasks
```sql
SELECT id, title, type, status, submission_count, created_at
FROM tasks
ORDER BY created_at DESC;
```

### Check Submission Counts
```sql
SELECT t.title, t.type, COUNT(s.id) as submissions, t.max_submissions
FROM tasks t
LEFT JOIN submissions s ON s.task_id = t.id
GROUP BY t.id
ORDER BY submissions DESC;
```

### Find User Submissions
```sql
SELECT s.*, t.title as task_title
FROM submissions s
JOIN tasks t ON t.id = s.task_id
WHERE s.user_id = 'user-uuid'
ORDER BY s.created_at DESC;
```

### Promote User to Admin
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';
```

### Clean Up Test Data
```sql
-- Delete test submissions (be careful!)
DELETE FROM submissions WHERE created_at > '2026-09-01' AND task_id = 'test-task-uuid';

-- Reset submission count
UPDATE tasks SET submission_count = (
  SELECT COUNT(*) FROM submissions WHERE task_id = tasks.id
);
```

## Migration Strategy

> ⚠️ **No formal migration tool is configured.** Schema changes are applied via Supabase SQL Editor.

### Recommended Process
1. Write migration SQL
2. Test in Supabase staging project (if available)
3. Back up production data
4. Apply migration in production SQL Editor
5. Verify application still works
6. Document the migration

### Migration Template
```sql
-- Migration: YYYY-MM-DD_description
-- Author: Name
-- Description: What this migration does

BEGIN;

-- Forward migration
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS new_column TEXT DEFAULT '';

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tasks' AND column_name = 'new_column';

COMMIT;

-- Rollback (save separately)
-- ALTER TABLE tasks DROP COLUMN IF EXISTS new_column;
```

## Backup Strategy

| Method | Frequency | Retention |
|--------|-----------|-----------|
| Supabase auto-backup | Daily (Pro plan) | 7 days |
| Manual SQL export | Before migrations | Keep indefinitely |
| `pg_dump` | On-demand | As needed |

### Manual Export
```sql
-- Export critical tables
COPY (SELECT * FROM profiles) TO STDOUT CSV HEADER;
COPY (SELECT * FROM tasks) TO STDOUT CSV HEADER;
COPY (SELECT * FROM submissions) TO STDOUT CSV HEADER;
COPY (SELECT * FROM transactions) TO STDOUT CSV HEADER;
```
