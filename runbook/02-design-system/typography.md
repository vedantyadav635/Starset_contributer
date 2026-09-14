# Typography

> Last Updated: 2026-09-14  
> Source: `client/index.css` — `@theme inline` block (lines 163–165)

## Font Families

| Token | Stack | Usage |
|-------|-------|-------|
| `--font-sans` | `"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` | Body text, UI elements |
| `--font-display` | `"Inter Tight", "Inter", ui-sans-serif, system-ui, sans-serif` | Headlines, hero text, branding |
| `--font-mono` | `"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace` | Code, data, contributor IDs |

## Tailwind Utilities

```
font-sans      → Inter (body)
font-display   → Inter Tight (headings)
font-mono      → JetBrains Mono (code)
```

## Font Loading

Fonts are loaded via Google Fonts in `index.html`. Ensure these `<link>` tags are present:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Type Scale (Recommended)

| Name | Size | Weight | Line Height | Font | Usage |
|------|------|--------|-------------|------|-------|
| **Display XL** | 4rem (64px) | 800 | 1.05 | Display | Hero headlines |
| **Display LG** | 3rem (48px) | 700 | 1.1 | Display | Section headlines |
| **Display** | 2.25rem (36px) | 700 | 1.15 | Display | Page titles |
| **Heading 1** | 1.875rem (30px) | 600 | 1.2 | Display | Major section titles |
| **Heading 2** | 1.5rem (24px) | 600 | 1.25 | Sans | Sub-section titles |
| **Heading 3** | 1.25rem (20px) | 600 | 1.3 | Sans | Card titles |
| **Body LG** | 1.125rem (18px) | 400 | 1.6 | Sans | Lead paragraphs |
| **Body** | 1rem (16px) | 400 | 1.6 | Sans | Standard body copy |
| **Body SM** | 0.875rem (14px) | 400 | 1.5 | Sans | Secondary text, metadata |
| **Caption** | 0.75rem (12px) | 500 | 1.4 | Sans | Labels, timestamps |
| **Overline** | 0.6875rem (11px) | 600 | 1.3 | Sans | Category labels, uppercase text |

## Weight Guide

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Decorative text only |
| Regular | 400 | Body copy, descriptions |
| Medium | 500 | Buttons, labels, navigation |
| Semibold | 600 | Headings, emphasis |
| Bold | 700 | Display text, page titles |
| Extrabold | 800 | Hero headlines |
| Black | 900 | Display-only, very large text |

## Usage Examples

```tsx
// Hero headline
<h1 className="font-display text-6xl font-extrabold tracking-tight text-ink">
  Fuel the Future of AI
</h1>

// Section title
<h2 className="font-display text-3xl font-bold text-ink">
  How It Works
</h2>

// Body text
<p className="font-sans text-base text-body leading-relaxed">
  Contribute your voice to train the next generation of AI models.
</p>

// Code/data
<span className="font-mono text-sm text-muted">
  CONTRIBUTOR-00412
</span>

// Overline label
<span className="font-sans text-xs font-semibold uppercase tracking-widest text-signal">
  Audio Collection
</span>
```

## Rules

> 📌 **Never use browser default fonts.** Always specify `font-sans`, `font-display`, or `font-mono`.

> 📌 **Headlines use `font-display`** (Inter Tight). Body text uses `font-sans` (Inter).

> 📌 **Tracking:** Use `tracking-tight` for display/hero text (≥2rem). Normal tracking for body text.

> 💡 **Performance:** `font-display: swap` is set in Google Fonts URL. Text renders immediately with fallback, swaps when font loads.
