# CI/CD Pipeline

> Last Updated: 2026-09-14

## Current Status

> ⚠️ **No formal CI/CD pipeline is configured yet.** Deployments are triggered by Git push to Vercel (client) and Render (server) auto-deploy.

## Recommended Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  client-build:
    name: Client Build & Type Check
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: client
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - run: npm ci
      - run: npx tsc --noEmit          # Type check
      - run: npm run build             # Build check

  server-build:
    name: Server Build & Type Check
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: server
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      - run: npm ci
      - run: npx tsc --noEmit          # Type check
      - run: npm run build             # Build check
```

### Quality Gates (Future)

| Gate | Tool | Status |
|------|------|--------|
| TypeScript type check | `tsc --noEmit` | 🟡 Recommended |
| ESLint | `eslint .` | 🔴 Not configured |
| Prettier | `prettier --check .` | 🔴 Not configured |
| Unit tests | Vitest | 🔴 Not configured |
| E2E tests | Playwright | 🔴 Not configured |
| Bundle size check | `vite-plugin-inspect` | 🔴 Not configured |
| Lighthouse CI | `@lhci/cli` | 🔴 Not configured |

### Deployment Flow

```
Feature branch → PR → CI checks → Merge to main
                                       │
                        ┌──────────────┤
                        ▼              ▼
                   Vercel auto     Render auto
                   deploy client   deploy server
```
