# Incident Response

> Last Updated: 2026-09-14

## Severity Classification

| Level | Description | Response | Examples |
|-------|-------------|----------|----------|
| **P0** | Platform down | Immediate | Server crash, DB unreachable, auth broken |
| **P1** | Major feature broken | < 2 hours | Submissions failing, admin panel broken |
| **P2** | Feature degraded | < 24 hours | Slow load times, UI bugs, dark mode broken |
| **P3** | Minor issue | Next sprint | Typos, cosmetic issues, edge case bugs |

## Incident Template

```markdown
## Incident Report: [TITLE]

**Date:** YYYY-MM-DD HH:MM UTC
**Severity:** P0 / P1 / P2 / P3
**Duration:** X hours Y minutes
**Impact:** Description of user impact

### Timeline
- HH:MM — Issue detected
- HH:MM — Investigation started
- HH:MM — Root cause identified
- HH:MM — Fix deployed
- HH:MM — Verified working

### Root Cause
What caused the issue.

### Resolution
What was done to fix it.

### Prevention
What will be done to prevent recurrence.

### Action Items
- [ ] Action 1 — Owner — Due date
- [ ] Action 2 — Owner — Due date
```

## Quick Diagnosis Flowchart

```
Is the website loading?
├── NO → Check Vercel status → Is Vercel down?
│        ├── YES → Wait / check status.vercel.com
│        └── NO  → Check deployment logs → Fix & redeploy
│
└── YES → Are API calls failing?
         ├── NO → Client-side issue → Check browser console
         │
         └── YES → Check /health endpoint
                  ├── DOWN → Render issue → Check Render logs
                  │         → Is it cold start? → Wait 30s
                  │         → Is it crashed? → Check logs → Fix & deploy
                  │
                  └── UP → Auth issue?
                          ├── 401 → Token expired / Supabase down
                          ├── 403 → Role mismatch
                          └── 500 → Server bug → Check Render logs
```

## Communication Templates

### Acknowledging an Issue
> "We're aware of [brief description] and are investigating. We'll update you as soon as we have more information."

### Issue Resolved
> "[Brief description] has been resolved. The issue was caused by [root cause]. We've [what was done] to prevent this from happening again."

## Post-Incident Review

After every P0 or P1 incident:

1. **Schedule a review** within 48 hours
2. **Document the incident** using the template above
3. **Identify systemic issues** — was it preventable?
4. **Create action items** with owners and deadlines
5. **Store the report** in `runbook/07-operations/incidents/` directory
