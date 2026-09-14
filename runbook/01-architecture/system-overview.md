# System Overview

> Last Updated: 2026-09-14

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        STARSET PLATFORM                         │
├────────────────────────────┬────────────────────────────────────┤
│       CLIENT (SPA)         │          SERVER (API)              │
│                            │                                    │
│  React 19 + TypeScript     │  Express 5 + TypeScript            │
│  Vite 6 (dev + build)      │  ts-node-dev (dev)                 │
│  Tailwind CSS 4            │  Zod (validation)                  │
│  Framer Motion + GSAP      │  Multer (file uploads)             │
│  React Router 7            │  Rate Limiting                     │
│                            │                                    │
│  Port: 5173                │  Port: 3000                        │
│  Deploy: Vercel            │  Deploy: Render                    │
├────────────────────────────┴────────────────────────────────────┤
│                       SUPABASE (BaaS)                           │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│  │ PostgreSQL  │  │ Auth (JWT)   │  │ Storage (Buckets)  │     │
│  │ + RLS       │  │ Email/Pass   │  │ Media uploads      │     │
│  └─────────────┘  └──────────────┘  └────────────────────┘     │
├─────────────────────────────────────────────────────────────────┤
│                    EXTERNAL SERVICES                            │
│                                                                 │
│  Backblaze B2 (cloud storage)    Google Gemini (AI validation)  │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

```
Contributor Browser
       │
       ▼
  ┌─────────┐     ┌──────────────────┐
  │  Vercel  │────▶│  React SPA       │
  │  CDN     │     │  (client-side)   │
  └─────────┘     └────────┬─────────┘
                           │
              Supabase Auth│(JWT token)
                           │
                    ┌──────▼──────┐
                    │  API Server  │
                    │  (Express)   │
                    ├──────────────┤
                    │ Middleware:   │
                    │ • CORS       │
                    │ • Rate Limit │
                    │ • Auth       │
                    │ • Admin Role │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    │  PostgreSQL │
                    └─────────────┘
```

## Data Flow: Task Lifecycle

```
Admin Creates Task ──▶ Task stored in Supabase
       │
       ▼
Contributors browse ──▶ GET /contributor/tasks
       │
       ▼
Contributor executes ──▶ POST /submissions/{type}
       │                    │
       │              ┌─────▼─────┐
       │              │ Validation │
       │              │ (client +  │
       │              │  server)   │
       │              └─────┬─────┘
       │                    │
       ▼                    ▼
Admin reviews ──▶ PUT /admin/submissions/{id}/approve|reject
       │
       ▼
Contributor earnings updated ──▶ Dashboard reflects new balance
```

## User Roles

| Role | Access Level | Key Capabilities |
|------|-------------|------------------|
| **Contributor** | Authenticated user | Browse tasks, execute submissions, view earnings |
| **Admin** | Elevated privileges | Create tasks, review submissions, export data, view stats |
| **Unauthenticated** | Public pages only | Landing page, About, Careers, Blog, Legal pages |

## Key Integration Points

| Integration | Purpose | Configuration |
|------------|---------|---------------|
| Supabase Auth | User authentication (email/password) | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |
| Supabase DB | PostgreSQL with RLS | `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` |
| Backblaze B2 | Cloud object storage for media files | Server-side credentials |
| Google Gemini | AI-powered validation & classification | `GEMINI_API_KEY` |
| Vercel | Client deployment + CDN | `vercel.json` rewrites |
| Render | Server deployment | Health check at `/health` |
