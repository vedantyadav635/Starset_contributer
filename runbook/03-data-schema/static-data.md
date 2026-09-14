# Static Data Files

> Last Updated: 2026-09-14  
> Location: `client/data/`

## Overview

Static data files provide hardcoded content for pages that don't need dynamic data from the database. These are TypeScript files exporting typed arrays/objects.

---

## `jobs.ts` — Career Listings

**Path:** [`client/data/jobs.ts`](file:///e:/starset%20intelligence/Starset_contributer/client/data/jobs.ts)  
**Used by:** `pages/Careers.tsx`

```typescript
// Structure (inferred)
interface Job {
  id: string;
  title: string;              // e.g., "Senior ML Engineer"
  department: string;         // e.g., "Engineering"
  location: string;           // e.g., "Remote"
  type: string;               // e.g., "Full-time"
  description: string;        // Job description
  requirements: string[];     // Required qualifications
  responsibilities: string[]; // Key responsibilities
}
```

---

## `datasets.ts` — Dataset Catalog

**Path:** [`client/data/datasets.ts`](file:///e:/starset%20intelligence/Starset_contributer/client/data/datasets.ts)  
**Used by:** `components/DatasetExplorer.tsx`, `components/DatasetPreview.tsx`

Contains the catalog of AI training datasets available on the platform.

---

## `datasetLandings.ts` — Dataset Landing Pages

**Path:** [`client/data/datasetLandings.ts`](file:///e:/starset%20intelligence/Starset_contributer/client/data/datasetLandings.ts)  
**Used by:** `pages/DatasetLandingPage.tsx`

Marketing/informational content for individual dataset landing pages.

---

## `languages.ts` — Supported Languages

**Path:** [`client/data/languages.ts`](file:///e:/starset%20intelligence/Starset_contributer/client/data/languages.ts)  
**Used by:** Task creation forms, contributor profiles, language filters

```typescript
// Structure (inferred)
interface Language {
  code: string;               // ISO 639-1 code (e.g., "en")
  name: string;               // English name (e.g., "English")
  nativeName?: string;        // Native name (e.g., "English")
  region?: string;            // Region variant (e.g., "India")
}
```

---

## Editing Guidelines

> 📌 **Changing static data is a code change** — it requires a commit and deploy.

> 💡 **Future consideration:** Move frequently-changing data (jobs, datasets) to Supabase tables for admin-editable content.

> ⚠️ **IDs must be stable** — if external systems or URLs reference data IDs, changing them is a breaking change.
