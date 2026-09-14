# Radius & Borders

> Last Updated: 2026-09-14  
> Source: `client/index.css` lines 65–71

## Radius Tokens

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--r-xs` | `4px` | `rounded-xs` | Tiny elements, tags, badges |
| `--r-sm` | `6px` | `rounded-sm` | Inputs, small buttons |
| `--r-md` | `10px` | `rounded-md` | Standard buttons, chips |
| `--r-lg` | `14px` | `rounded-lg` | Cards, panels, modals |
| `--r-xl` | `20px` | `rounded-xl` | Large cards, hero elements |
| `--r-pill` | `999px` | `rounded-pill` | Pills, tags, full-round buttons |

## Border (Line) Tokens

| Token | Tailwind | Usage |
|-------|----------|-------|
| `--line` | `border-line` | Default borders, dividers |
| `--line-strong` | `border-line-strong` | Emphasized borders, active states |
| `--line-faint` | `border-line-faint` | Subtle separators, backgrounds |

## Legacy Aliases

| Legacy Token | Maps To |
|-------------|---------|
| `--radius-card` | `var(--r-lg)` |
| `--radius-pill` | `var(--r-pill)` |
| `--border` | `var(--line)` |

## Usage Examples

```tsx
// Card
<div className="rounded-lg border border-line bg-surface p-6">
  Card content
</div>

// Pill button
<button className="rounded-pill bg-signal px-6 py-2 text-white">
  Get Started
</button>

// Input field
<input className="rounded-sm border border-line px-3 py-2" />

// Badge/tag
<span className="rounded-xs bg-signal-soft px-2 py-0.5 text-xs font-medium text-signal-ink">
  Audio
</span>
```

## Rules

> 📌 **Cards always use `rounded-lg`** (14px) — this is the canonical card radius.

> 📌 **Interactive elements** (buttons, inputs) use `rounded-sm` or `rounded-md`.

> 📌 **Border width is always `1px`** unless intentionally emphasized.

> 📌 **Border color** defaults to `--line`. Use `--line-strong` for focus/hover states.
