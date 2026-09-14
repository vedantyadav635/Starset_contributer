# Release Process

> Last Updated: 2026-09-14

## Versioning

Follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

MAJOR — Breaking changes (API contract changes, auth flow changes)
MINOR — New features (new task types, new pages)
PATCH — Bug fixes, performance improvements
```

Current version: `0.0.0` (pre-release, defined in `client/package.json`)

## Release Steps

### 1. Prepare

```bash
# Ensure main branch is up to date
git checkout main
git pull origin main

# Create release branch
git checkout -b release/v1.x.x
```

### 2. Update Version

```bash
# Client
cd client
npm version 1.x.x

# Server
cd server
npm version 1.x.x
```

### 3. Test

```bash
# Client
cd client
npx tsc --noEmit
npm run build
npm run preview  # Manual test

# Server
cd server
npm run build
```

### 4. Changelog

Update `CHANGELOG.md` (create if not exists):

```markdown
## [1.x.x] - 2026-MM-DD

### Added
- Description of new features

### Changed
- Description of changes

### Fixed
- Description of bug fixes

### Security
- Description of security updates
```

### 5. Merge & Tag

```bash
git add -A
git commit -m "release: v1.x.x"
# NOTE: Do NOT git push without user confirmation (per GEMINI.md policy)
```

### 6. Deploy

- **Client:** Vercel auto-deploys on merge to `main`
- **Server:** Render auto-deploys on merge to `main`

### 7. Verify Production

- [ ] Client loads at production URL
- [ ] `/health` returns `200`
- [ ] Login flow works
- [ ] Create and execute a test task
- [ ] Admin dashboard loads

---

## Hotfix Process

For urgent production fixes:

```bash
git checkout main
git checkout -b hotfix/describe-fix
# Make fix
git commit -m "fix: describe the fix"
# Merge to main (after review)
```
