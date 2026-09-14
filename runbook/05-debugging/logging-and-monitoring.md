# Logging & Monitoring

> Last Updated: 2026-09-14

## Current State

> ⚠️ **No structured logging or monitoring is configured.** This document serves as a plan for future implementation.

## Recommended Logging Stack

### Client

| Tool | Purpose |
|------|---------|
| Browser Console | Development debugging |
| Sentry (recommended) | Error tracking + performance monitoring |
| Vercel Analytics | Page views, Web Vitals |

### Server

| Tool | Purpose |
|------|---------|
| `console.log` (current) | Basic stdout logging |
| Pino (recommended) | Structured JSON logging |
| Render Logs | Server stdout/stderr viewer |
| Sentry (recommended) | Error tracking |

## Log Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| `debug` | Detailed dev info | `debug('Processing submission', { taskId, fileSize })` |
| `info` | Normal operations | `info('Task created', { taskId, adminId })` |
| `warn` | Recoverable issues | `warn('Rate limit approaching', { ip, count })` |
| `error` | Failures | `error('Upload failed', { taskId, err })` |
| `fatal` | System-level failures | `fatal('Database connection lost')` |

## What to Log

### Always Log
- Authentication failures (401/403)
- Task creation and deletion
- Submission approve/reject actions
- File upload success/failure
- Server startup and shutdown

### Never Log
- 🔒 Passwords or tokens
- 🔒 Full user profiles
- 🔒 File contents
- 🔒 Supabase service keys

## Health Monitoring

### Endpoints to Monitor

| URL | Method | Expected | Alert If |
|-----|--------|----------|----------|
| `/health` | GET | `200 { "status": "ok" }` | Non-200 for > 1 min |
| Production client URL | GET | `200` | Non-200 for > 2 min |
| Supabase project | Dashboard | Active | Paused (free tier) |

### Recommended Monitoring Services

| Service | Free Tier | Purpose |
|---------|-----------|---------|
| UptimeRobot | 50 monitors | Uptime monitoring |
| BetterStack | 10 monitors | Uptime + incident management |
| Sentry | 5K errors/mo | Error tracking |
| Vercel Analytics | Included | Web Vitals |
