# Local Development Setup

> Last Updated: 2026-09-14

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | v16+ (v20+ recommended) | `node --version` |
| npm | v8+ | `npm --version` |
| Git | Any | `git --version` |
| Supabase account | — | [supabase.com](https://supabase.com) |

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repo-url>
cd Starset_contributer
```

### 2. Client Setup

```bash
cd client
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm run dev
```

Client runs at: **http://localhost:5173**

### 3. Server Setup (in a separate terminal)

```bash
cd server
# Create .env with server credentials (see 04-environment/env-variables.md)
npm install
npm run dev
```

Server runs at: **http://localhost:3000**

### 4. Verify Setup

| Check | URL | Expected |
|-------|-----|----------|
| Client loads | http://localhost:5173 | Landing page renders |
| Server health | http://localhost:3000/health | `{ "status": "ok" }` |
| Supabase Auth | Sign up on the app | Successful registration |
| API connection | Open Dashboard (logged in) | Tasks load from API |

## Common Setup Issues

### `VITE_SUPABASE_URL is not set` warning
**Cause:** Missing or empty `.env` file in `client/`  
**Fix:** Copy `.env.example` to `.env` and fill in Supabase credentials

### Port 5173 already in use
**Fix:** Kill the existing process or change port in `vite.config.ts`
```bash
npx kill-port 5173
```

### Server fails to start — `SUPABASE_SERVICE_KEY` undefined
**Cause:** Missing `server/.env`  
**Fix:** Create `server/.env` with required variables

### `ERR_MODULE_NOT_FOUND` on import
**Cause:** Dependencies not installed  
**Fix:** Run `npm install` in both `client/` and `server/`

### CORS errors in browser console
**Cause:** Server not running or wrong `VITE_API_URL`  
**Fix:** Ensure server is running on port 3000, `VITE_API_URL=http://localhost:3000`

## Available Scripts

### Client

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Production build to `dist/` |
| Preview | `npm run preview` | Preview production build locally |

### Server

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start with ts-node-dev (auto-restart) |
| Build | `npm run build` | Compile TypeScript to `dist/` |
| Start | `npm run start` | Run compiled JS (production) |

## IDE Setup

### VS Code Recommended Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer
- Error Lens
- GitLens

### VS Code Settings (Optional)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```
