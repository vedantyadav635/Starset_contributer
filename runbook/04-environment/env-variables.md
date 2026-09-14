# Environment Variables

> Last Updated: 2026-09-14

## Client (`client/.env`)

| Variable | Required | Exposed | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | Yes (`import.meta.env`) | Backend API URL. Defaults to `https://starset-contributer.onrender.com` |
| `VITE_SUPABASE_URL` | **Yes** | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | Yes | Supabase anon/public key (safe for browser) |
| `GEMINI_API_KEY` | No | Yes (via `process.env`) | Google Gemini API key (injected by Vite define) |

> ⚠️ **All `VITE_` prefixed variables are bundled into the client.** Never put secrets here.

> ⚠️ **`GEMINI_API_KEY` is exposed via `vite.config.ts` define** — it ends up in the browser bundle. Consider moving to server-side.

### Template (`client/.env.example`)

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=
```

---

## Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | **Yes** | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | **Yes** | 🔒 Service-role key (bypasses RLS) |
| `PORT` | No | Server port (default: 3000) |
| `B2_APPLICATION_KEY_ID` | Yes* | Backblaze B2 key ID |
| `B2_APPLICATION_KEY` | Yes* | 🔒 Backblaze B2 secret key |
| `B2_BUCKET_ID` | Yes* | Backblaze bucket ID |
| `B2_BUCKET_NAME` | Yes* | Backblaze bucket name |

> 🔒 **`SUPABASE_SERVICE_KEY` grants full database access.** Treat as a production secret. Never commit, never log.

> *Backblaze keys are required if file uploads are enabled.

### Template (`server/.env`)

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=3000
B2_APPLICATION_KEY_ID=your-b2-key-id
B2_APPLICATION_KEY=your-b2-secret-key
B2_BUCKET_ID=your-bucket-id
B2_BUCKET_NAME=your-bucket-name
```

---

## Environment-Specific Behavior

| Behavior | Local | Production |
|----------|-------|-----------|
| API URL | `http://localhost:3000` | `https://starset-contributer.onrender.com` |
| Supabase | Dev project | Production project |
| CORS origin | `*` (all origins) | `*` (same — protected by auth) |
| Rate limit | 200/15min | 200/15min |
| File storage | Backblaze B2 | Backblaze B2 |

---

## Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] `SUPABASE_SERVICE_KEY` is never in client code
- [ ] `VITE_SUPABASE_ANON_KEY` is the anon key, not service key
- [ ] Production env vars are set in Vercel/Render dashboards, not committed
- [ ] `GEMINI_API_KEY` exposure is acceptable for the use case
