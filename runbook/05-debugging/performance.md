# Performance

> Last Updated: 2026-09-14

## Bundle Analysis

### Current State

| Metric | Target | Notes |
|--------|--------|-------|
| Initial JS bundle | < 300KB gzipped | React + Router + Supabase + Tailwind |
| Largest chunk | — | `TaskExecution.tsx` (49KB source) |
| First Contentful Paint | < 1.5s | Static SPA on Vercel CDN |
| Time to Interactive | < 3s | After hydration |

### Analysis Commands

```bash
cd client
npm run build
# Check dist/ folder sizes
du -sh dist/assets/*
```

## Optimization Opportunities

### Code Splitting

**Problem:** `App.tsx` (45KB) imports all 26 pages upfront.

**Fix:** Lazy-load page components:
```tsx
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TaskExecution = lazy(() => import('./pages/TaskExecution'));
const Earnings = lazy(() => import('./pages/Earnings'));

// In router
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

### Image Optimization
- Use WebP/AVIF formats
- Lazy-load below-fold images
- Use `loading="lazy"` on `<img>` tags
- Consider a CDN-based image optimizer (Vercel Image Optimization)

### Font Loading
- Fonts loaded via Google Fonts with `display=swap`
- Consider self-hosting fonts to reduce external requests
- Only load weights actually used (300, 400, 500, 600, 700 for Inter)

### Animation Performance
- GSAP animations should use `will-change: transform` sparingly
- Prefer `transform` and `opacity` for hardware-accelerated animations
- Use `ScrollTrigger` with `scrub` for efficient scroll-driven animations
- Test with Chrome DevTools Performance tab

## Monitoring Checklist

- [ ] Lighthouse CI score > 90 (Performance)
- [ ] No layout shifts (CLS < 0.1)
- [ ] Largest Contentful Paint < 2.5s
- [ ] No memory leaks from unmounted GSAP timelines
- [ ] Server response times < 500ms for list endpoints
- [ ] File upload endpoints handle 50MB files without timeout
