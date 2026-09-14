# Authentication Flow

> Last Updated: 2026-09-14

## Overview

Authentication is handled by **Supabase Auth** (email/password) with JWT tokens.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. SIGNUP                                                   │
│  ┌──────┐    POST /auth/v1/signup     ┌──────────┐          │
│  │Client│ ─────────────────────────▶ │ Supabase │          │
│  │      │ ◀───────────────────────── │ Auth     │          │
│  └──────┘    { session, user }       └──────────┘          │
│       │                                    │                │
│       │  2. STORE SESSION                  │ Create user    │
│       │  localStorage + AuthContext        │ in auth.users  │
│       ▼                                    ▼                │
│  ┌──────────────┐              ┌──────────────────┐        │
│  │ React State  │              │ profiles table   │        │
│  │ AuthContext   │              │ (via trigger)    │        │
│  └──────────────┘              └──────────────────┘        │
│                                                              │
│  3. API CALLS                                                │
│  ┌──────┐   Authorization: Bearer <JWT>   ┌──────────┐     │
│  │Client│ ──────────────────────────────▶ │ Express  │     │
│  │      │                                  │ Server   │     │
│  └──────┘                                  └────┬─────┘     │
│                                                  │           │
│                                    requireAuth() │           │
│                                    verify JWT    │           │
│                                    with Supabase │           │
│                                                  ▼           │
│                                           ┌──────────┐      │
│                                           │ Supabase │      │
│                                           │ DB       │      │
│                                           └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

| Component | File | Role |
|-----------|------|------|
| `AuthContext.jsx` | `client/context/AuthContext.jsx` | Manages auth state, provides `user`, `session`, `signIn`, `signOut` |
| `supabaseClient.ts` | `client/supabaseClient.ts` | Initializes Supabase client with anon key |
| `requireAuth` | `server/src/middleware/requireAuth.ts` | Express middleware — verifies JWT |
| `requireAdmin` | `server/src/middleware/requireAuth.ts` | Express middleware — checks admin role |

## Token Lifecycle

| Event | Action |
|-------|--------|
| Login/Signup | Supabase returns `access_token` (JWT) + `refresh_token` |
| API Request | Client sends `Authorization: Bearer <access_token>` |
| Token Expiry | Supabase SDK auto-refreshes using `refresh_token` |
| Logout | `supabase.auth.signOut()` — clears tokens from storage |
| Tab Close | Session persists in `localStorage` |
| Tab Reopen | `supabase.auth.getSession()` restores session |

## User Roles

| Role | Set By | Access |
|------|--------|--------|
| `contributor` | Default on signup | Contributor routes only |
| `admin` | Manual DB update | Admin + contributor routes |

### Setting Admin Role

```sql
-- In Supabase SQL Editor
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

> ⚠️ There is no admin signup UI — admin accounts are created manually.

## Security Considerations

- 🔒 **Anon key** is safe in the browser — RLS protects data
- 🔒 **Service key** is server-only — bypasses RLS for admin ops
- 🔒 **JWTs** are short-lived (default: 1 hour) with auto-refresh
- 🔒 **Password reset** goes through Supabase email flow
- 🔒 **Session** is stored in `localStorage` — XSS could expose tokens
