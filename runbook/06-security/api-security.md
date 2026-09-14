# API Security

> Last Updated: 2026-09-14  
> Source: [`server/src/app.ts`](file:///e:/starset%20intelligence/Starset_contributer/server/src/app.ts)

## Middleware Chain

Every request passes through these layers (in order):

```
Request ──▶ CORS ──▶ JSON Parser ──▶ Rate Limiter ──▶ Route Middleware ──▶ Handler
```

### 1. CORS

```typescript
app.use(cors({
  origin: "*",                                    // All origins allowed
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
```

> ⚠️ **`origin: "*"` is intentional** — the API is protected by auth tokens, not origin restrictions. For stricter environments, whitelist specific domains.

### 2. JSON Body Parser

```typescript
app.use(express.json());
```

### 3. Global Rate Limiting

```typescript
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // 15-minute window
  max: 200,                     // 200 requests per IP per window
  standardHeaders: true,        // RateLimit-* headers
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});
```

### 4. Route-Level Auth

| Route Pattern | Middleware |
|--------------|------------|
| `GET /health` | None (public) |
| `/admin/*` | `requireAuth` + `requireAdmin` |
| `/contributor/*` | `requireAuth` |
| `/submissions/*` | `requireAuth` |
| `/user/*` | `requireAuth` |

## Middleware Implementation

### `requireAuth`
1. Extracts `Bearer <token>` from `Authorization` header
2. Calls `supabase.auth.getUser(token)` to verify JWT
3. Attaches `req.user` with user data
4. Returns `401` if token invalid/missing

### `requireAdmin`
1. Runs after `requireAuth` (user already verified)
2. Queries `profiles` table for user's role
3. Returns `403` if role is not `'admin'`

## Security Measures

| Measure | Status | Details |
|---------|--------|---------|
| HTTPS | ✅ | Enforced by Vercel + Render |
| JWT Auth | ✅ | Supabase-issued tokens |
| Rate Limiting | ✅ | 200/15min global |
| CORS | ✅ | Configured (permissive) |
| Input Validation | ✅ | Zod schemas on server |
| RLS | ✅ | Supabase Row Level Security |
| File Validation | ✅ | Server-side format/size checks |
| CSRF | ⚠️ | Not needed (JWT-based, not cookie-based) |
| XSS | ⚠️ | React auto-escapes, but session in localStorage |
| SQL Injection | ✅ | Supabase client uses parameterized queries |

## Hardening Recommendations

1. **Tighten CORS** in production to specific domains
2. **Add Helmet.js** for security headers
3. **Implement per-route rate limits** (stricter on submissions)
4. **Add request logging** for audit trails
5. **Consider HttpOnly cookies** instead of localStorage for sessions
6. **Add CSP headers** to prevent XSS
