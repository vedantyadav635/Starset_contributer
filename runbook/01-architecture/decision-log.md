# Architecture Decision Records (ADR)

> Last Updated: 2026-09-14

## ADR-001: React 19 with Vite over Next.js

**Status:** Accepted  
**Date:** 2026

**Context:** Needed a frontend framework for a SPA-style contributor platform.

**Decision:** React 19 + Vite instead of Next.js.

**Rationale:**
- The app is a SPA — no server-side rendering needed for contributor/admin dashboards
- Vite provides faster HMR and simpler configuration
- Auth is handled client-side via Supabase, no need for server-side session management
- Deployment to Vercel as a static SPA is simpler and cheaper

**Consequences:**
- SEO is handled via `SEOHead.tsx` component with meta tags (not SSR)
- All routes use client-side rendering with React Router
- API calls go directly to the Express server

---

## ADR-002: Supabase as Backend-as-a-Service

**Status:** Accepted  
**Date:** 2026

**Context:** Needed auth, database, and storage with minimal ops overhead.

**Decision:** Supabase (PostgreSQL + Auth + Storage).

**Rationale:**
- Built-in email/password auth with JWT tokens
- PostgreSQL with Row Level Security (RLS) for data isolation
- Real-time subscriptions available if needed
- Generous free tier for MVP, scales to Pro
- Client SDK works seamlessly with React

**Consequences:**
- Server uses `service_role` key for admin operations (bypasses RLS)
- Client uses `anon` key (respects RLS)
- Auth state managed in `AuthContext.jsx`

---

## ADR-003: Separate Express API Server

**Status:** Accepted  
**Date:** 2026

**Context:** Need server-side logic for file validation, admin operations, and secure data access.

**Decision:** Standalone Express 5 server deployed on Render.

**Rationale:**
- File uploads (audio, images) need server-side validation before storage
- Admin operations need `service_role` key — cannot expose in browser
- Rate limiting and security middleware better handled server-side
- Music-metadata library runs server-side for audio analysis

**Consequences:**
- Two separate deployments (Vercel client + Render server)
- CORS configured to allow cross-origin requests
- Health check endpoint at `/health` keeps Render free tier alive

---

## ADR-004: Tailwind CSS 4 with Design Token System

**Status:** Accepted  
**Date:** 2026

**Context:** Need a consistent, maintainable design system.

**Decision:** Tailwind CSS 4 with CSS custom properties and `@theme inline` bridge.

**Rationale:**
- CSS variables enable runtime theme switching (light ↔ dark)
- `@theme inline` bridges CSS vars into Tailwind utility classes
- Single `index.css` file is the canonical source of truth for all tokens
- shadcn/ui compatibility maintained via `tailwind.config.js`

**Consequences:**
- All colors, spacing, radii referenced via `var(--token-name)`
- Dark mode uses `html.dark` class (set by `ThemeContext.tsx`)
- `index.css` is large (~40KB) but intentionally so — it's the design system

---

## ADR-005: Dual Animation Libraries (Framer Motion + GSAP)

**Status:** Accepted  
**Date:** 2026

**Context:** Need both simple component animations and complex scroll-driven sequences.

**Decision:** Use both Framer Motion and GSAP.

**Rationale:**
- Framer Motion: Declarative, great for mount/unmount transitions and layout animations
- GSAP: Superior for scroll-triggered timelines, complex sequences, and performance-critical animations
- `AnimationProvider.tsx` manages shared context and cleanup

**Consequences:**
- Two animation dependencies — bundle size impact mitigated by tree-shaking
- Convention: Use Framer Motion for component-level animations, GSAP for page-level cinematic effects

---

## ADR-006: Monorepo with Separate Package.json Files

**Status:** Accepted  
**Date:** 2026

**Context:** Client and server have different dependency trees and deployment targets.

**Decision:** Single repo with separate `package.json` for `client/` and `server/`.

**Rationale:**
- Independent dependency management (no workspace tooling overhead)
- Independent deployment pipelines
- Simple mental model: `cd client && npm install` or `cd server && npm install`

**Consequences:**
- No shared types between client and server (types defined separately)
- Root `package-lock.json` exists but is minimal
- Consider workspace setup if shared packages emerge

---

## ADR-007: Backblaze B2 for Media Storage

**Status:** Accepted  
**Date:** 2026

**Context:** Need cost-effective cloud storage for audio recordings and images.

**Decision:** Backblaze B2 over AWS S3 or Supabase Storage.

**Rationale:**
- Significantly cheaper than S3 for storage-heavy workloads
- S3-compatible API for familiarity
- No egress fees for Cloudflare-proxied downloads
- Good fit for write-heavy, read-occasional media storage

**Consequences:**
- Server-side SDK manages uploads
- Credentials never exposed to client
- Media URLs may need CDN proxying for performance

---

## Template for New ADRs

```markdown
## ADR-XXX: [Title]

**Status:** Proposed | Accepted | Deprecated | Superseded
**Date:** YYYY-MM-DD

**Context:** [Why this decision is needed]

**Decision:** [What was decided]

**Rationale:** [Why this option over alternatives]

**Consequences:** [Impact of the decision]
```
