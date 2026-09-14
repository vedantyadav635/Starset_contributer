# Rollback Procedures

> Last Updated: 2026-09-14

## Client Rollback (Vercel)

### Option 1: Instant Rollback (Recommended)
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. Takes effect immediately (CDN propagation: ~30 seconds)

### Option 2: Git Revert
```bash
git revert HEAD  # Revert last commit
# Push after confirmation (per GEMINI.md policy)
```

## Server Rollback (Render)

### Option 1: Manual Deploy of Previous Commit
1. Go to Render Dashboard → Service → Events
2. Find the last successful deploy
3. Click "Manual Deploy" → Select the commit hash
4. Wait for deploy to complete (~2 minutes)

### Option 2: Git Revert
```bash
git revert HEAD
# Push after confirmation
# Render auto-deploys
```

## Database Rollback

> ⚠️ **Database changes are NOT automatically reversible.** Always back up before schema changes.

### Before Schema Changes
```sql
-- Create a point-in-time snapshot (Supabase Pro feature)
-- Or manually export critical data:
COPY (SELECT * FROM submissions) TO '/tmp/submissions_backup.csv' CSV HEADER;
```

### Reverting Schema Changes
```sql
-- Undo specific migration (example)
ALTER TABLE tasks DROP COLUMN IF EXISTS new_column;
```

## Rollback Checklist

- [ ] Identify the bad deployment
- [ ] Confirm rollback target (commit hash or deployment ID)
- [ ] Execute rollback
- [ ] Verify production is working
- [ ] Communicate to team
- [ ] Create ticket for proper fix
