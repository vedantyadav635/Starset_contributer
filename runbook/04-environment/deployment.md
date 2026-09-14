# Deployment

> Last Updated: 2026-09-14

## Architecture

```
              ┌─────────────────────────────┐
   Users ────▶│  Vercel CDN (client SPA)    │
              │  vercel.json: SPA rewrites   │
              └──────────────┬──────────────┘
                             │ API calls
              ┌──────────────▼──────────────┐
              │  Render (Express server)    │
              │  Health check: /health       │
              └──────────────┬──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │  Supabase (PostgreSQL)      │
              └─────────────────────────────┘
```

## Client Deployment (Vercel)

### Configuration

**File:** [`client/vercel.json`](file:///e:/starset%20intelligence/Starset_contributer/client/vercel.json)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> This enables SPA routing — all paths serve `index.html`, React Router handles the rest.

### Vercel Project Settings

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Environment Variables (Vercel Dashboard)

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://starset-contributer.onrender.com` |
| `VITE_SUPABASE_URL` | Production Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Production anon key |
| `GEMINI_API_KEY` | (if used) |

### Deploy Process

1. Push to `main` branch → Vercel auto-deploys
2. Or manually: `npx vercel --prod` from `client/` directory
3. Preview deploys created for each PR

---

## Server Deployment (Render)

### Render Service Settings

| Setting | Value |
|---------|-------|
| Environment | Node |
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start` |
| Health Check Path | `/health` |
| Auto-Deploy | Yes (on push to main) |

### Environment Variables (Render Dashboard)

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Production Supabase URL |
| `SUPABASE_SERVICE_KEY` | 🔒 Production service role key |
| `PORT` | `10000` (Render default) |
| `B2_APPLICATION_KEY_ID` | Backblaze key ID |
| `B2_APPLICATION_KEY` | 🔒 Backblaze secret |
| `B2_BUCKET_ID` | Production bucket ID |
| `B2_BUCKET_NAME` | Production bucket name |

### Free Tier Considerations

> ⚠️ **Render free tier spins down after 15 minutes of inactivity.** The health check endpoint (`/health`) is pinged periodically to keep the server alive. First request after spin-down takes ~30 seconds.

**Mitigation options:**
1. Use an external cron service (e.g., cron-job.org) to ping `/health` every 14 minutes
2. Upgrade to Render paid tier for always-on
3. Accept the cold-start delay for low-traffic periods

---

## Pre-Deploy Checklist

- [ ] All environment variables set in hosting dashboard
- [ ] `npm run build` succeeds locally for both client and server
- [ ] No `console.log` statements with sensitive data
- [ ] API URL in client `.env` points to production server
- [ ] Supabase RLS policies are configured
- [ ] Rate limiting is enabled
- [ ] `.gitignore` includes `.env`, `node_modules/`, `dist/`

---

## Domain Setup

| Service | Domain | Notes |
|---------|--------|-------|
| Client (Vercel) | Custom domain via Vercel DNS | Add CNAME/A records |
| Server (Render) | `*.onrender.com` subdomain | Or custom domain on paid plan |
| Supabase | Managed by Supabase | No custom domain needed |
