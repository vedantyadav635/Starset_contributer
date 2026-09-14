# New Developer Onboarding

> Last Updated: 2026-09-14

## Welcome to Starset! 🚀

This guide will get you from zero to productive in about 2 hours.

## Day 1 Checklist

### Access & Accounts
- [ ] GitHub repo access
- [ ] Supabase project access (read-only, or full for admins)
- [ ] Vercel team access (for deployment viewing)
- [ ] Render team access (for server logs)

### Local Setup
- [ ] Clone the repo
- [ ] Follow [Local Setup Guide](../04-environment/local-setup.md)
- [ ] Verify client runs at http://localhost:5173
- [ ] Verify server runs at http://localhost:3000
- [ ] Create a test account via signup

### Orientation Reading (Priority Order)
1. [ ] [README.md](../../README.md) — Project overview
2. [ ] [System Overview](../01-architecture/system-overview.md) — Architecture
3. [ ] [Tech Stack](../01-architecture/tech-stack.md) — Technologies used
4. [ ] [Folder Structure](../01-architecture/folder-structure.md) — Where things live
5. [ ] [Design System Overview](../02-design-system/overview.md) — Design principles
6. [ ] [Color Tokens](../02-design-system/color-tokens.md) — The palette
7. [ ] [Code Style](./code-style.md) — How we write code
8. [ ] [Git Workflow](./git-workflow.md) — How we ship code

---

## Key Concepts

### The Platform
Starset is a **crowdsourcing platform for AI training data**. Contributors complete tasks (record audio, label images, annotate text) and earn money. Admins create tasks and review submissions.

### Architecture in 30 Seconds
- **Client:** React SPA on Vercel — handles all UI
- **Server:** Express API on Render — handles file uploads, validation, admin ops
- **Database:** Supabase PostgreSQL — stores everything
- **Auth:** Supabase Auth — email/password with JWT tokens

### Design System in 30 Seconds
- One accent color: `--signal` (blue)
- Warm neutrals (not pure white/gray)
- Inter for body, Inter Tight for headlines
- All tokens in `index.css`, bridged to Tailwind via `@theme inline`
- Light + dark mode via `html.dark` class

---

## First Tasks (Good Starter Issues)

| Difficulty | Task Type | Example |
|-----------|-----------|---------|
| 🟢 Easy | Fix a typo | Update text on About page |
| 🟢 Easy | Add an icon | Add missing icon to sidebar |
| 🟡 Medium | New static page | Create a new info page |
| 🟡 Medium | UI improvement | Improve card layout on Marketplace |
| 🔴 Hard | New feature | Add a new task type |

---

## Who to Ask

| Topic | Contact |
|-------|---------|
| Architecture / Design decisions | Lead developer |
| Supabase / Database | Backend developer |
| UI / Design system | Frontend developer |
| Deployment / DevOps | Lead developer |

---

## Common Gotchas for New Developers

1. **Tailwind 4 is different** — uses `@theme inline` and `@custom-variant`, not the v3 config pattern
2. **Two animation libraries** — Framer Motion for components, GSAP for scroll/timeline
3. **Auth state is in context** — use `useAuth()` hook, not direct Supabase calls
4. **API URL has fallback logic** — see `client/config/api.ts`
5. **Never `git push` without asking** — this is a strict project rule
6. **`index.css` is intentionally large** — it's the design system, not a mess
7. **Some files are `.jsx`** — legacy files, will be migrated to `.tsx`
