# Checklists

> Last Updated: 2026-09-14

## Pre-Deploy Checklist

### Client

- [ ] `npm run build` succeeds without errors
- [ ] `npx tsc --noEmit` passes (no type errors)
- [ ] All `VITE_*` env vars set in Vercel dashboard
- [ ] `vercel.json` present with SPA rewrites
- [ ] No `console.log` with sensitive data
- [ ] No hardcoded localhost URLs
- [ ] Dark mode tested on key pages
- [ ] Mobile responsive on landing page, dashboard, task execution
- [ ] SEO meta tags present on public pages
- [ ] `robots.txt` and `manifest.json` up to date

### Server

- [ ] `npm run build` succeeds
- [ ] All env vars set in Render dashboard
- [ ] `SUPABASE_SERVICE_KEY` is NOT the anon key
- [ ] Rate limiting configured appropriately
- [ ] `/health` endpoint responds correctly
- [ ] CORS allows production client origin
- [ ] File upload size limits are reasonable
- [ ] No secrets in logged output

### Database

- [ ] RLS policies enabled on all tables
- [ ] Admin-only operations use server (service_role key)
- [ ] No orphaned data from test submissions
- [ ] Backup taken before schema changes

---

## Incident Response Checklist

### Step 1: Identify

- [ ] What is broken? (Client? Server? Database? Auth?)
- [ ] When did it start?
- [ ] How many users are affected?
- [ ] Is there an error message or status code?

### Step 2: Communicate

- [ ] Acknowledge the issue to affected users (if applicable)
- [ ] Set severity level (see below)

### Step 3: Diagnose

- [ ] Check Vercel deployment status
- [ ] Check Render service status and logs
- [ ] Check Supabase dashboard for issues
- [ ] Check browser console for client errors
- [ ] Test `/health` endpoint
- [ ] Test a simple API call manually (curl)

### Step 4: Fix

- [ ] Apply fix and deploy
- [ ] OR rollback to last known good deploy
- [ ] Verify fix in production

### Step 5: Post-Mortem

- [ ] Document what happened
- [ ] Document root cause
- [ ] Document what was done to fix
- [ ] Identify prevention measures

---

## Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|--------------|---------|
| **P0 — Critical** | Platform fully down | Immediate | Server crash, database down |
| **P1 — High** | Major feature broken | < 2 hours | Auth broken, submissions failing |
| **P2 — Medium** | Feature degraded | < 24 hours | Slow response times, UI glitches |
| **P3 — Low** | Minor issue | Next sprint | Cosmetic bugs, typos |

---

## Code Review Checklist

- [ ] TypeScript types used correctly (no `any`)
- [ ] No hardcoded values (use tokens/constants)
- [ ] Error states handled (loading, error, empty)
- [ ] Accessible (keyboard navigation, screen reader)
- [ ] Responsive (tested at 320px, 768px, 1280px)
- [ ] Dark mode works
- [ ] No console errors or warnings
- [ ] Comments for non-obvious logic
- [ ] Component is focused (single responsibility)
- [ ] No unused imports
