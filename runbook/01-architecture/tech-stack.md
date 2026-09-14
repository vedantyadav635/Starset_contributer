# Tech Stack

> Last Updated: 2026-09-14

## Client

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **React** | 19.2.3 | UI framework | Latest stable, concurrent features, server components ready |
| **TypeScript** | ~5.8.2 | Type safety | Catches bugs at compile time, better DX |
| **Vite** | 6.2.0 | Build tool | Fast HMR, ESM-native, lean config |
| **Tailwind CSS** | 4.2.0 | Utility-first CSS | Rapid prototyping, design token bridge via `@theme` |
| **@tailwindcss/vite** | 4.2.0 | Vite plugin for Tailwind | Native integration, no PostCSS config needed |
| **React Router** | 7.12.0 | Client-side routing | File-based patterns, nested layouts |
| **Framer Motion** | 12.34.3 | Animation library | Declarative animations, layout transitions |
| **GSAP** | 3.15.0 | Advanced animation | Complex timelines, ScrollTrigger, performance |
| **@gsap/react** | 2.1.2 | GSAP React bindings | `useGSAP` hook, proper cleanup |
| **Supabase JS** | 2.91.0 | Backend client | Auth, real-time, storage access |
| **Lucide React** | 0.562.0 | Icon library | Consistent, tree-shakeable SVG icons |
| **Recharts** | 3.7.0 | Charts & data viz | Dashboard analytics, earnings graphs |
| **clsx** | 2.1.1 | Class merging | Conditional className composition |
| **tailwind-merge** | 3.5.0 | Tailwind class dedup | Prevents conflicting utility classes |
| **@vitejs/plugin-react** | 5.0.0 | React Vite plugin | JSX transform, Fast Refresh |

## Server

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **Express** | 5.2.1 | HTTP framework | Minimal, well-known, middleware ecosystem |
| **TypeScript** | 5.9.3 | Type safety | Consistent with client |
| **Supabase JS** | 2.93.3 | Database + Auth verification | Service-role access for admin operations |
| **Zod** | 4.4.3 | Schema validation | Runtime type checking for API inputs |
| **Multer** | 2.0.2 | File upload middleware | Multipart form handling (audio, images) |
| **Backblaze B2** | 1.7.1 | Cloud storage SDK | Media file storage (audio recordings, images) |
| **express-rate-limit** | 8.5.2 | Rate limiting | API abuse prevention |
| **music-metadata** | 11.12.1 | Audio metadata parser | Validate audio format, duration, bitrate |
| **cors** | 2.8.6 | CORS middleware | Cross-origin request handling |
| **dotenv** | 17.2.3 | Env management | Load `.env` files |
| **ts-node-dev** | 2.0.0 | Dev server | TypeScript execution with auto-restart |

## Infrastructure

| Service | Purpose | Tier |
|---------|---------|------|
| **Vercel** | Client hosting + CDN | Free / Pro |
| **Render** | Server hosting | Free (with health-check keep-alive) |
| **Supabase** | PostgreSQL + Auth + Storage | Free / Pro |
| **Backblaze B2** | Object storage for media | Pay-as-you-go |

## UI Component Libraries

| Library | Purpose |
|---------|---------|
| **shadcn/ui** | Pre-built accessible components (via `components.json`) |
| **Magic UI** | Premium animated components (registered in `components.json`) |

## Key Version Constraints

> ⚠️ **React 19**: Uses the new JSX transform. Ensure `@vitejs/plugin-react` v5+ is used.

> ⚠️ **Tailwind 4**: Uses `@theme inline` blocks and `@custom-variant` instead of the v3 `theme.extend` pattern. The `tailwind.config.js` file is for shadcn/ui compatibility only.

> ⚠️ **Express 5**: Uses promise-based error handling. Async route handlers automatically forward thrown errors.
