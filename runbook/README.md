# 📘 Starset Contributor — Project Runbook

> **Version:** 1.0.0  
> **Last Updated:** 2026-09-14  
> **Maintainer:** Starset Engineering Team  
> **Project:** Starset Intelligence — Contributor Platform

---

## Purpose

This runbook is the **single source of truth** for the Starset Contributor Platform. It captures every architectural decision, design token, data schema, API contract, debugging recipe, and operational procedure needed to develop, ship, and maintain the platform at a professional level.

**Use this runbook when:**
- Onboarding a new developer or designer
- Debugging production issues
- Making architectural or design decisions
- Preparing for a release or audit
- Understanding why something was built the way it was

---

## 📂 Runbook Structure

```
runbook/
├── README.md                          ← You are here
│
├── 01-architecture/
│   ├── system-overview.md             ← High-level architecture diagram & flow
│   ├── tech-stack.md                  ← All technologies, versions, and rationale
│   ├── folder-structure.md            ← Detailed project tree with file descriptions
│   └── decision-log.md               ← ADR (Architecture Decision Records)
│
├── 02-design-system/
│   ├── overview.md                    ← Design philosophy & principles
│   ├── color-tokens.md                ← Full color palette (light + dark)
│   ├── typography.md                  ← Fonts, scale, weights, line-heights
│   ├── spacing-and-layout.md          ← Spacing scale, containers, grid system
│   ├── elevation-and-shadows.md       ← Shadow tokens, z-index stacking
│   ├── motion-and-animation.md        ← Easing curves, durations, animation patterns
│   ├── radius-and-borders.md          ← Border radii, line tokens
│   ├── iconography.md                 ← Icon library, usage guidelines
│   └── component-inventory.md         ← All UI components with props & variants
│
├── 03-data-schema/
│   ├── typescript-types.md            ← All TypeScript interfaces & enums
│   ├── supabase-tables.md             ← Database schema & RLS policies
│   ├── api-contracts.md               ← All REST endpoints, request/response shapes
│   └── static-data.md                 ← Static data files (jobs, datasets, languages)
│
├── 04-environment/
│   ├── env-variables.md               ← All environment variables (client + server)
│   ├── local-setup.md                 ← Step-by-step dev environment setup
│   ├── deployment.md                  ← Vercel (client) + Render (server) deployment
│   └── ci-cd.md                       ← Build pipeline & quality gates
│
├── 05-debugging/
│   ├── common-issues.md               ← Known bugs, gotchas, and fixes
│   ├── error-codes.md                 ← API error codes & client error boundaries
│   ├── performance.md                 ← Performance profiling & optimization
│   ├── logging-and-monitoring.md      ← Logging strategy & monitoring setup
│   └── checklist.md                   ← Pre-deploy & incident response checklists
│
├── 06-security/
│   ├── auth-flow.md                   ← Supabase Auth flow, roles, RLS
│   ├── api-security.md                ← Rate limiting, CORS, middleware chain
│   └── secrets-management.md          ← Secret rotation, storage, access control
│
├── 07-operations/
│   ├── release-process.md             ← Versioning, changelogs, release steps
│   ├── rollback-procedures.md         ← How to revert bad deploys
│   ├── database-operations.md         ← Migrations, backups, data ops
│   └── incident-response.md           ← Severity levels, escalation, postmortems
│
└── 08-contributing/
    ├── code-style.md                  ← Linting, formatting, naming conventions
    ├── git-workflow.md                ← Branch strategy, commit conventions, PRs
    ├── review-checklist.md            ← Code review standards
    └── onboarding.md                  ← New developer onboarding guide
```

---

## Quick Links

| Section | What's in it |
|---------|-------------|
| [Architecture](./01-architecture/system-overview.md) | System diagrams, tech stack, folder map |
| [Design System](./02-design-system/overview.md) | Colors, fonts, spacing, components |
| [Data Schema](./03-data-schema/typescript-types.md) | Types, DB tables, API contracts |
| [Environment](./04-environment/local-setup.md) | Local dev, env vars, deployment |
| [Debugging](./05-debugging/common-issues.md) | Known issues, error codes, checklists |
| [Security](./06-security/auth-flow.md) | Auth, CORS, rate limiting, secrets |
| [Operations](./07-operations/release-process.md) | Releases, rollbacks, incident response |
| [Contributing](./08-contributing/code-style.md) | Code style, git workflow, onboarding |

---

## Conventions Used

| Icon | Meaning |
|------|---------|
| ⚠️ | Warning — potential pitfall |
| 🔒 | Security-sensitive — handle with care |
| 💡 | Tip — best practice or shortcut |
| 🐛 | Known bug or quirk |
| 📌 | Pinned — critical info, do not skip |
