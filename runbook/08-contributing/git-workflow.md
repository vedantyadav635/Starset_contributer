# Git Workflow

> Last Updated: 2026-09-14

## Branch Strategy

```
main (production)
 │
 ├── develop (staging/integration)
 │    │
 │    ├── feature/task-type-video      ← New features
 │    ├── fix/audio-upload-timeout     ← Bug fixes
 │    ├── chore/update-dependencies    ← Maintenance
 │    └── refactor/split-task-exec     ← Refactoring
 │
 └── hotfix/critical-auth-fix          ← Emergency fixes (branch from main)
```

## Branch Naming

```
<type>/<short-description>

Types:
  feature/    — New functionality
  fix/        — Bug fix
  chore/      — Maintenance, deps, config
  refactor/   — Code restructuring (no behavior change)
  docs/       — Documentation only
  hotfix/     — Emergency production fix
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Adding/fixing tests |
| `chore` | Build, deps, config |
| `ci` | CI/CD changes |

### Scopes

| Scope | Meaning |
|-------|---------|
| `client` | Frontend changes |
| `server` | Backend changes |
| `db` | Database schema |
| `auth` | Authentication |
| `ui` | UI components |
| `api` | API endpoints |
| `deps` | Dependencies |

### Examples

```bash
feat(client): add playlist task execution UI
fix(server): handle audio upload timeout for large files
chore(deps): update React to 19.2.3
refactor(client): split TaskExecution into type-specific components
docs: update runbook with deployment procedures
```

## Pull Request Process

### Before Opening a PR

- [ ] Code compiles (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)
- [ ] Tested locally (both client and server)
- [ ] No console errors or warnings
- [ ] Commit messages follow conventions

### PR Template

```markdown
## Description
What does this PR do?

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation

## Screenshots (if UI changes)

## Testing Done
- [ ] Tested locally
- [ ] Tested in dark mode
- [ ] Tested on mobile viewport

## Checklist
- [ ] Code follows style guide
- [ ] No `any` types introduced
- [ ] Design tokens used (no hardcoded values)
- [ ] Responsive design maintained
```

## ⚠️ Git Push Policy

> 📌 **NEVER run `git push` automatically.** Always ask for explicit confirmation before pushing to GitHub or any remote repository.

This is enforced by the project's `GEMINI.md` rules.
