# Spacing & Layout

> Last Updated: 2026-09-14  
> Source: `client/index.css` lines 73–88

## Spacing Scale (4px Base)

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--s-1` | `0.25rem` | 4px | Icon gaps, tiny margins |
| `--s-2` | `0.5rem` | 8px | Tight padding, inline gaps |
| `--s-3` | `0.75rem` | 12px | Button padding, list gaps |
| `--s-4` | `1rem` | 16px | Standard padding, card content |
| `--s-5` | `1.25rem` | 20px | Section sub-gaps |
| `--s-6` | `1.5rem` | 24px | Card padding, group spacing |
| `--s-8` | `2rem` | 32px | Section inner spacing |
| `--s-10` | `2.5rem` | 40px | Large component gaps |
| `--s-12` | `3rem` | 48px | Section dividers |
| `--s-16` | `4rem` | 64px | Section padding |
| `--s-20` | `5rem` | 80px | Large section padding |
| `--s-24` | `6rem` | 96px | Hero/footer padding |

## Container Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--container` | `1280px` | Standard page content |
| `--container-wide` | `1440px` | Full-width sections |
| `--container-text` | `720px` | Long-form text (legal, blog) |
| `--gutter` | `clamp(1.25rem, 4vw, 2.5rem)` | Page side padding |

## Navigation

| Token | Value | Usage |
|-------|-------|-------|
| `--nav-h` | `68px` | Fixed navbar height |

## Section Rhythm (Fluid Vertical Spacing)

| Token | Value | Usage |
|-------|-------|-------|
| `--section-y` | `clamp(4rem, 8vw, 7rem)` | Standard section spacing |
| `--section-y-lg` | `clamp(5rem, 10vw, 9rem)` | Major section divisions |
| `--section-y-sm` | `clamp(3rem, 6vw, 5rem)` | Compact section spacing |

> 💡 **`clamp()` prevents extremes**: Sections never collapse below 3–5rem on mobile, never exceed 7–9rem on ultrawide.

## Layout Patterns

### Page Container
```tsx
<div className="mx-auto max-w-[var(--container)] px-[var(--gutter)]">
  {/* Content */}
</div>
```

### Text Container (Legal/Blog)
```tsx
<div className="mx-auto max-w-[var(--container-text)] px-[var(--gutter)]">
  {/* Long-form content */}
</div>
```

### Section Spacing
```tsx
<section className="py-[var(--section-y)]">
  {/* Section content */}
</section>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card />
  <Card />
  <Card />
</div>
```

## Responsive Breakpoints

Tailwind 4 default breakpoints (used throughout):

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| `sm` | `640px` | Mobile landscape |
| `md` | `768px` | Tablet |
| `lg` | `1024px` | Small desktop |
| `xl` | `1280px` | Desktop (matches `--container`) |
| `2xl` | `1400px` | Wide desktop (custom in config) |

## Rules

> 📌 **Use spacing tokens** for consistency. Avoid arbitrary values like `p-[13px]`.

> 📌 **Section spacing is always fluid** — use `--section-y` variants, never fixed `py-32`.

> 📌 **The container has centered padding** — set via `container: { center: true, padding: '1rem' }` in Tailwind config.
