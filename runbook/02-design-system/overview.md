# Design System — Overview

> Last Updated: 2026-09-14  
> Source of Truth: `client/index.css`

## Design Philosophy

The Starset design system is built on three principles:

### 1. Signal, Not Noise
One accent color (`--signal`) carries all interactive meaning. Everything else is neutral. This creates a clear visual hierarchy where calls-to-action are unmistakable.

### 2. Warmth Over Sterility
Warm neutrals (`#fbfaf8` paper, not `#ffffff`) prevent the clinical feel of pure whites and grays. The platform deals with human data contribution — it should feel approachable.

### 3. Restraint in Motion
Animations serve function (revealing content, confirming actions) — never decoration. Shadows are subtle, transitions are swift, and nothing glows.

## Token Architecture

```
┌──────────────────────────────────────────────────┐
│                  CSS Custom Properties            │
│              (:root / html.dark overrides)        │
│                                                    │
│  Primitives:  --paper, --ink, --signal, --ok...   │
│  Semantic:    --background, --foreground...       │
│  Layout:      --container, --gutter, --nav-h...   │
│  Motion:      --ease, --dur, --dur-fast...        │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│            @theme inline (Tailwind Bridge)        │
│                                                    │
│  --font-sans → font-sans utility                  │
│  --color-paper → bg-paper, text-paper...          │
│  --color-signal → bg-signal, text-signal...       │
│  --radius-md → rounded-md                         │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│              Tailwind Utility Classes             │
│                                                    │
│  bg-paper  text-ink  border-line  rounded-lg      │
│  shadow-md  font-display  text-signal             │
└──────────────────────────────────────────────────┘
```

## Theming Strategy

| Aspect | Implementation |
|--------|---------------|
| **Theme toggle** | `ThemeContext.tsx` adds/removes `dark` class on `<html>` |
| **Persistence** | Theme stored in `localStorage` |
| **System preference** | Respects `prefers-color-scheme` on first visit |
| **Custom variants** | `@custom-variant dark (&:where(.dark, .dark *))` |
| **Legacy aliases** | `:root, html.dark` block maps old token names to new |

## File Map

| File | Purpose |
|------|---------|
| [`index.css`](file:///e:/starset%20intelligence/Starset_contributer/client/index.css) | All design tokens, utility classes, component styles |
| [`tailwind.config.js`](file:///e:/starset%20intelligence/Starset_contributer/client/tailwind.config.js) | shadcn/ui compatibility only |
| [`components.json`](file:///e:/starset%20intelligence/Starset_contributer/client/components.json) | shadcn/ui + MagicUI registry |
| [`ThemeContext.tsx`](file:///e:/starset%20intelligence/Starset_contributer/client/context/ThemeContext.tsx) | Theme state management |
| [`ThemeToggle.tsx`](file:///e:/starset%20intelligence/Starset_contributer/client/components/ThemeToggle.tsx) | UI toggle component |
