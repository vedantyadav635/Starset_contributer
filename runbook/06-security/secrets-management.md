# Secrets Management

> Last Updated: 2026-09-14

## Secret Inventory

| Secret | Location | Risk Level | Rotation |
|--------|----------|-----------|----------|
| `SUPABASE_SERVICE_KEY` | Server `.env` / Render | 🔴 Critical | Regenerate in Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | Client `.env` / Vercel | 🟢 Low | Public by design (RLS protects data) |
| `B2_APPLICATION_KEY` | Server `.env` / Render | 🟡 Medium | Rotate in Backblaze dashboard |
| `GEMINI_API_KEY` | Client `.env` / Vercel | 🟡 Medium | Rotate in Google AI Studio |

## Storage Rules

| Rule | Details |
|------|---------|
| ✅ **Do** | Store secrets in hosting dashboard (Vercel / Render) |
| ✅ **Do** | Use `.env` files for local development |
| ✅ **Do** | Keep `.env` in `.gitignore` |
| ❌ **Don't** | Commit `.env` files to Git |
| ❌ **Don't** | Log secrets to console |
| ❌ **Don't** | Put `service_role` key in client code |
| ❌ **Don't** | Share secrets over Slack/email in plaintext |

## Rotation Procedures

### Supabase Service Key

1. Go to Supabase Dashboard → Project Settings → API
2. Note the new `service_role` key
3. Update in Render environment variables
4. Restart Render service
5. Verify `/health` responds correctly
6. Test an admin API call

### Backblaze B2 Key

1. Go to Backblaze Dashboard → App Keys
2. Create a new application key
3. Update `B2_APPLICATION_KEY_ID` and `B2_APPLICATION_KEY` in Render
4. Restart Render service
5. Test a file upload
6. Delete old key in Backblaze

### Gemini API Key

1. Go to Google AI Studio → API Keys
2. Create new key
3. Update in Vercel environment variables
4. Trigger redeploy
5. Delete old key in Google AI Studio

## Access Control

| Secret | Who Has Access |
|--------|---------------|
| Supabase Service Key | Lead developer only |
| Supabase Anon Key | All developers (public) |
| Backblaze Keys | Backend developer |
| Gemini API Key | Lead developer |
| Vercel Dashboard | Deployment managers |
| Render Dashboard | Backend developers |

## Emergency: Secret Leaked

1. **Immediately rotate** the compromised secret
2. **Check access logs** (Supabase audit log, Render logs)
3. **Assess damage** — what data could have been accessed?
4. **Update all environments** with new secrets
5. **Document the incident** in `07-operations/incident-response.md`
