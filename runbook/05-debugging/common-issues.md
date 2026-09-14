# Common Issues & Fixes

> Last Updated: 2026-09-14

## Client Issues

### 🐛 White screen / blank page in production
**Symptoms:** App loads `index.html` but nothing renders  
**Causes:**
1. Missing `vercel.json` rewrites — direct URLs return 404
2. Build error silently swallowed
3. Missing environment variables

**Fix:**
```bash
# Verify build works locally
cd client && npm run build && npm run preview
# Check browser console for errors
# Verify vercel.json has SPA rewrites
```

---

### 🐛 `supabase.auth.getSession()` returns null
**Symptoms:** User appears logged out even after login  
**Causes:**
1. `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` incorrect
2. Supabase project paused (free tier)
3. Browser cleared localStorage

**Fix:** Check `.env` values match Supabase dashboard → Project Settings → API

---

### 🐛 API calls return CORS errors
**Symptoms:** `Access-Control-Allow-Origin` errors in console  
**Causes:**
1. Server not running
2. `VITE_API_URL` points to wrong URL
3. Server CORS middleware misconfigured

**Fix:**
```bash
# Verify server is running
curl http://localhost:3000/health

# Check client .env
# VITE_API_URL=http://localhost:3000
```

---

### 🐛 Styles broken / Tailwind classes not applying
**Symptoms:** Raw unstyled HTML  
**Causes:**
1. Tailwind CSS plugin not loaded in Vite
2. `index.css` not imported in `index.tsx`
3. Class names not matching `@theme inline` definitions

**Fix:** Verify `vite.config.ts` includes `tailwindcss()` plugin and `index.tsx` imports `./index.css`

---

### 🐛 Dark mode flickers on page load
**Symptoms:** Brief flash of light theme before dark applies  
**Cause:** Theme class applied after React hydrates

**Fix:** Add inline script in `index.html` `<head>`:
```html
<script>
  if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
</script>
```

---

### 🐛 GSAP animations not cleaning up
**Symptoms:** Memory leaks, animations running on unmounted components  
**Cause:** Missing cleanup in `useEffect` or not using `useGSAP`

**Fix:** Always use `useGSAP` hook with scope:
```tsx
useGSAP(() => {
  // animations here — auto-cleaned up
}, { scope: containerRef });
```

---

## Server Issues

### 🐛 `401 Unauthorized` on all API requests
**Symptoms:** Every request returns 401  
**Causes:**
1. `requireAuth` middleware can't verify JWT
2. `SUPABASE_URL` or `SUPABASE_SERVICE_KEY` wrong in server `.env`
3. Client sending expired or malformed token

**Debug:**
```bash
# Check server .env
echo $SUPABASE_URL

# Test with a known-good token
curl -H "Authorization: Bearer <token>" http://localhost:3000/contributor/tasks
```

---

### 🐛 `403 Forbidden` — admin routes
**Symptoms:** Authenticated user gets 403 on admin endpoints  
**Cause:** User's `role` in `profiles` table is not `'admin'`

**Fix:** Update role in Supabase SQL editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

---

### 🐛 File uploads fail with `413 Payload Too Large`
**Symptoms:** Large audio/image uploads rejected  
**Cause:** Express body parser or Multer size limit

**Fix:** Check Multer config in `routes/submissions.ts`:
```typescript
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB
```

---

### 🐛 Rate limiting triggered during development
**Symptoms:** `429 Too Many Requests` during local testing  
**Cause:** Global rate limit of 200 requests per 15 minutes

**Fix:** Increase limit in `app.ts` for development:
```typescript
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 1000 : 200,
});
```

---

### 🐛 Render server cold-start timeout
**Symptoms:** First API call after idle period takes 30+ seconds or times out  
**Cause:** Render free tier spins down after inactivity

**Mitigations:**
1. Ping `/health` every 14 minutes via cron service
2. Upgrade to paid Render plan
3. Add loading state in client for slow API responses

---

## Database Issues

### 🐛 RLS policy blocks data access
**Symptoms:** Queries return empty results even when data exists  
**Cause:** Row Level Security policies too restrictive

**Debug:**
```sql
-- Check what policies exist
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test as a specific user (in Supabase SQL editor)
SET request.jwt.claims = '{"sub": "user-uuid", "role": "authenticated"}';
SELECT * FROM your_table;
```

---

## Quick Diagnostic Commands

```bash
# Client
cd client
npm run build 2>&1 | head -50    # Check for build errors
npx tsc --noEmit                  # Type check without building

# Server
cd server
npm run build 2>&1 | head -50    # Check for compile errors
curl http://localhost:3000/health  # Health check

# Network
curl -I https://starset-contributer.onrender.com/health  # Production health
```
